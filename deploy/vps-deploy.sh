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
HEALTH_URL=http://localhost:3000/api/internal/run
MAX_HEALTH_WAIT=60

log() {
  echo "[tusst-deploy] $(date -u +%FT%TZ) $*"
}

# Whatever the SSH client asked for is logged for audit only — never eval'd
# or executed. The forced command already guarantees this script is the only
# thing that runs; this is defense-in-depth against a future edit mistake.
log "client requested (ignored by design): ${SSH_ORIGINAL_COMMAND:-<empty>}"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "another deploy is already running — exiting"
  exit 1
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

git reset --hard "$NEW_SHA"
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
