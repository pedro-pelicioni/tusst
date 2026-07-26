#!/usr/bin/env bash
# Canonical, reviewable copy of the VPS deploy script.
#
# This file is versioned here for review (see .github/CODEOWNERS), but the
# copy that actually runs on the VPS lives OUTSIDE the git tree, at
# /usr/local/sbin/tusst-deploy.sh, promoted there manually by an operator
# with their own SSH access. It is invoked only via the forced `command=` in
# root's authorized_keys for the dedicated CI deploy key — that key can never
# run anything else, and the CI pipeline can never rewrite this file itself,
# even if the whole repo were compromised. See memory `tusst-vps-deploy` /
# the CI/CD plan for the full rationale.
#
# To change deploy logic: edit this file, get it reviewed/merged, then an
# operator manually copies it to /usr/local/sbin/tusst-deploy.sh over SSH
# with their personal key. The CI pipeline never touches that path.

set -euo pipefail

# Never read anything from the SSH client's stdin, even if it tries to send
# something — this script's own logic is the only thing that ever runs here.
exec </dev/null

REPO_DIR=/opt/tusst
LOCK_FILE=/var/lock/tusst-deploy.lock
DEPLOY_LOG=/var/log/tusst-deploy.log
STATUS_FILE=/run/tusst-deploy.status
PID_FILE=/run/tusst-deploy.pid
HEALTH_URL=http://localhost:3000/api/internal/run
MAX_HEALTH_WAIT=60
SELF="$(readlink -f "$0")"

log() {
  echo "[tusst-deploy] $(date -u +%FT%TZ) $*"
}

# Whatever the SSH client asked for is logged for audit only — never eval'd
# or executed. The forced command already guarantees this script is the only
# thing that runs; this is defense-in-depth against a future edit mistake.
log "client requested (ignored by design): ${SSH_ORIGINAL_COMMAND:-<empty>}"

# ---------------------------------------------------------------------------
# Supervisor / worker split.
#
# The deploy can rebuild the Soroban image, which takes tens of minutes and
# emits nothing at all while Scout compiles its detectors. Running that inside
# the SSH session meant a dropped connection killed the build mid-flight:
# `Timeout, server not responding` after 20 minutes of silence, image left
# unbuilt, tree left advanced.
#
# So the real work runs detached (setsid, own session, no controlling
# terminal) and writes to $DEPLOY_LOG. This invocation only streams that log
# and exits with the worker's status. If the connection dies, the worker keeps
# going — and the next invocation attaches to it instead of starting a second
# one.
#
# `--worker` is set by this script re-executing itself, never by the client:
# SSH_ORIGINAL_COMMAND is ignored (above) and the forced command passes no
# arguments.
# ---------------------------------------------------------------------------
if [ "${1:-}" = "--worker" ]; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "another deploy is already running — exiting"
    exit 1
  fi
  # Publish the pid only once the lock is actually held, so the supervisor
  # can tell "still working" from "died" without racing worker startup.
  echo "$$" >"$PID_FILE"
  # Record the exit status wherever the worker stops, so the supervisor can
  # report it — including the rollback paths, which exit non-zero on purpose.
  record_status() { echo "$?" >"$STATUS_FILE"; }
  trap record_status EXIT
else
  # Distinguish "lock held" from "flock is broken/missing": without this, any
  # flock failure looks identical to a running deploy and the supervisor waits
  # for a worker it never started.
  if ! command -v flock >/dev/null 2>&1; then
    log "flock is not available on this host — refusing to deploy"
    exit 1
  fi

  if flock -n "$LOCK_FILE" true; then
    : >"$DEPLOY_LOG"
    rm -f "$STATUS_FILE" "$PID_FILE"
    setsid nohup "$SELF" --worker >"$DEPLOY_LOG" 2>&1 </dev/null &
    log "started detached worker — streaming $DEPLOY_LOG (a dropped connection no longer kills it)"
  else
    log "a deploy is already running — attaching to it rather than starting a second"
  fi

  tail -n +1 -f "$DEPLOY_LOG" &
  TAIL_PID=$!
  # shellcheck disable=SC2064
  trap "kill $TAIL_PID 2>/dev/null || true" EXIT

  # Liveness is tracked by pid, not by the lock: a freshly spawned worker has
  # not acquired the lock yet, so testing the lock here reports a healthy
  # worker as vanished.
  waited=0
  while [ ! -f "$PID_FILE" ] && [ ! -f "$STATUS_FILE" ]; do
    waited=$((waited + 1))
    if [ "$waited" -gt 30 ]; then
      log "worker never came up — check $DEPLOY_LOG on the host"
      exit 1
    fi
    sleep 1
  done

  while [ ! -f "$STATUS_FILE" ]; do
    WORKER_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "$WORKER_PID" ] && ! kill -0 "$WORKER_PID" 2>/dev/null; then
      # Re-check once: the pid can be gone a beat before the status lands.
      sleep 3
      [ -f "$STATUS_FILE" ] && break
      log "worker (pid $WORKER_PID) exited without recording a status — check $DEPLOY_LOG on the host"
      exit 1
    fi
    sleep 5
  done

  sleep 1
  STATUS="$(cat "$STATUS_FILE")"
  log "worker finished with status $STATUS"
  exit "$STATUS"
fi

cd "$REPO_DIR"

PREV_SHA="$(git rev-parse HEAD)"
git fetch origin main --quiet
NEW_SHA="$(git rev-parse origin/main)"

if [ "$PREV_SHA" = "$NEW_SHA" ]; then
  log "origin/main is already at $NEW_SHA — nothing to do"
  exit 0
fi

CHANGED_PATHS="$(git diff --name-only "$PREV_SHA" "$NEW_SHA")"
log "moving from $PREV_SHA to $NEW_SHA. Changed paths:"
echo "$CHANGED_PATHS"

# Everything from the checkout up to the health check is guarded: `set -e` on
# its own would abort with the tree already advanced, leaving node_modules and
# the build stale while the service still runs the old code — and, worse, the
# NEXT deploy would then see HEAD == origin/main, log "nothing to do" and exit
# green forever. Reset the tree so a retry actually retries.
abort_and_restore_tree() {
  log "FAILED before the health check — restoring the tree to $PREV_SHA so the next deploy retries"
  git reset --hard "$PREV_SHA" || log "WARNING: could not restore the tree; needs manual intervention"
  exit 1
}
trap abort_and_restore_tree ERR

git reset --hard "$NEW_SHA"

# The lockfile is generated by npm 11 (Dependabot's npm — matched in
# .github/workflows/ci.yml). npm 10 rejects it outright as out of sync,
# because it demands the `optional: true, peer: true` entries that npm 11
# prunes: "Missing: typescript@4.9.5 from lock file". Keep this host on the
# same major or `npm ci` fails on every dependency bump.
if [ "$(npm -v | cut -d. -f1)" -lt 11 ]; then
  log "npm $(npm -v) is too old for this lockfile — upgrading to npm 11"
  npm install -g npm@11
fi

npm ci --no-audit --no-fund

if echo "$CHANGED_PATHS" | grep -q '^runner/'; then
  log "rebuilding tusst-runner (runner/ changed)"
  npm run runner:build
fi

if echo "$CHANGED_PATHS" | grep -q '^runner-soroban/'; then
  log "rebuilding tusst-soroban-runner (runner-soroban/ changed — this is the expensive one)"
  npm run runner:soroban:build
fi

npm run build

read_runner_secret() {
  grep -E '^RUNNER_SHARED_SECRET=' "$REPO_DIR/.env" | cut -d= -f2- | tr -d '"'
}

restart_and_check() {
  systemctl restart tusst.service
  local secret waited=0
  secret="$(read_runner_secret)"
  while [ "$waited" -lt "$MAX_HEALTH_WAIT" ]; do
    if systemctl is-active --quiet tusst.service && \
       curl -sf -X POST "$HEALTH_URL" \
         -H "x-runner-secret: $secret" -H 'Content-Type: application/json' \
         --data '{"code":"fn main() { println!(\"ok\"); }"}' \
         | grep -q '"compiled":true'; then
      return 0
    fi
    sleep 3
    waited=$((waited + 3))
  done
  return 1
}

# From here on the rollback below is the recovery path — it restores the tree
# AND reinstalls and rebuilds, which the generic trap can't do. Hand over.
trap - ERR

if restart_and_check; then
  log "deploy OK — healthy at $NEW_SHA"
  exit 0
fi

log "HEALTH CHECK FAILED at $NEW_SHA — rolling back to $PREV_SHA"
git reset --hard "$PREV_SHA"
npm ci --no-audit --no-fund
npm run build
docker image inspect tusst-runner:latest >/dev/null 2>&1 || npm run runner:build

if restart_and_check; then
  log "ROLLBACK OK — back at $PREV_SHA. Deploy of $NEW_SHA FAILED and was reverted."
  exit 1 # keep the run red even though the rollback itself succeeded
else
  log "CRITICAL: rollback to $PREV_SHA also did not come back healthy. Needs manual intervention NOW."
  exit 2
fi
