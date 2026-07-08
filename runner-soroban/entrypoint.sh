#!/bin/sh
# Forge sandbox entrypoint — build | test | audit one mounted Soroban project.
#
# The user's project (Cargo.toml + src/**) is mounted read-only at /project.
# It is overlaid onto the warm workspace at /opt/warm, whose target/ already
# holds every curated dependency pre-compiled — so runs work fully offline.
# Writes land in the container's ephemeral layer and vanish with the container.
#
# Output protocol (parsed by tusst-web/src/lib/soroban/runner.ts), streamed:
#   __TUSST_FORGE__ phase prepare
#   __TUSST_FORGE__ phase compile|test|audit
#   (tool output, streamed line by line; the host caps + sanitizes it)
#   __TUSST_FORGE__ result ok|err|timeout <exit-code>
#   __TUSST_FORGE__ wasm-begin          (build success only)
#   (base64 of the produced .wasm, max 5MB raw)
#   __TUSST_FORGE__ wasm-end
#   __TUSST_FORGE__ end
#
# Always exits 0 — a non-zero exit means infra trouble (daemon down, image
# missing), same convention as the lesson runner.
set -u

MODE="${1:-build}"
WS=/opt/warm
MAX_WASM_BYTES=5242880

# Inner timeout guards the tool; the host holds a wall timeout as backstop.
case "$MODE" in
  build) INNER_TIMEOUT=150 ;;
  *) INNER_TIMEOUT=210 ;;
esac

export CARGO_NET_OFFLINE=true

finish() {
  echo "__TUSST_FORGE__ end"
  exit 0
}

echo "__TUSST_FORGE__ phase prepare"

if [ ! -f /project/Cargo.toml ] || [ ! -d /project/src ]; then
  echo "internal: no project mounted"
  echo "__TUSST_FORGE__ result err 1"
  finish
fi

cd "$WS" || { echo "internal: workspace missing"; echo "__TUSST_FORGE__ result err 1"; finish; }

# Swap the warm sources for the user's project; deps stay warm in target/.
rm -rf "$WS/src"
mkdir "$WS/src"
cp /project/Cargo.toml "$WS/Cargo.toml"
cp -R /project/src/. "$WS/src/"

case "$MODE" in
  build)
    echo "__TUSST_FORGE__ phase compile"
    timeout -k 5 "$INNER_TIMEOUT" stellar contract build 2>&1
    STATUS=$?
    ;;
  test)
    echo "__TUSST_FORGE__ phase test"
    timeout -k 5 "$INNER_TIMEOUT" cargo test --color never 2>&1
    STATUS=$?
    ;;
  audit)
    echo "__TUSST_FORGE__ phase audit"
    if [ -f /opt/scout-ready ] && [ -x "$CARGO_HOME/bin/cargo-scout-audit" ]; then
      timeout -k 5 "$INNER_TIMEOUT" cargo scout-audit 2>&1
      STATUS=$?
    else
      echo "static analysis is temporarily unavailable: the Scout analyzer"
      echo "does not support soroban-sdk 26 yet. build and test still work;"
      echo "audit re-enables automatically in a future runner image."
      STATUS=1
    fi
    ;;
  *)
    echo "internal: unknown mode '$MODE'"
    STATUS=1
    ;;
esac

if [ "$STATUS" -eq 124 ] || [ "$STATUS" -eq 137 ]; then
  echo "__TUSST_FORGE__ result timeout $STATUS"
  finish
fi

if [ "$STATUS" -ne 0 ]; then
  echo "__TUSST_FORGE__ result err $STATUS"
  finish
fi

if [ "$MODE" = "build" ]; then
  # The warm image ships with no leftover .wasm, so the newest one is ours.
  WASM=$(ls -t "$WS"/target/wasm32v1-none/release/*.wasm 2>/dev/null | head -n 1)
  if [ -z "$WASM" ] || [ ! -f "$WASM" ]; then
    echo "internal: build succeeded but no .wasm artifact was found"
    echo "__TUSST_FORGE__ result err 1"
    finish
  fi
  SIZE=$(wc -c < "$WASM")
  if [ "$SIZE" -gt "$MAX_WASM_BYTES" ]; then
    echo "internal: wasm artifact exceeds the 5MB limit"
    echo "__TUSST_FORGE__ result err 1"
    finish
  fi
  echo "__TUSST_FORGE__ result ok 0"
  echo "__TUSST_FORGE__ wasm-begin"
  base64 "$WASM"
  echo "__TUSST_FORGE__ wasm-end"
  finish
fi

echo "__TUSST_FORGE__ result ok 0"
finish
