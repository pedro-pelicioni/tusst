#!/bin/sh
# Grades one submission: compile /submission/main.rs, run it, emit results.
#
# Output protocol (parsed by tusst-web/src/lib/runner.ts) — marker lines,
# each section capped so a hostile program can't flood the pipe:
#   __TUSST_COMPILE__ ok|err
#   (on err: up to 4KB of compiler stderr)
#   __TUSST_RUN__ ok|timeout|crash <exit-code>
#   __TUSST_STDOUT__
#   (up to 16KB of program stdout)
#   __TUSST_END__
set -u

SRC=/submission/main.rs
if [ ! -f "$SRC" ]; then
  echo "__TUSST_COMPILE__ err"
  echo "internal: no submission mounted"
  echo "__TUSST_END__"
  exit 0
fi

cd /tmp

if ! rustc --edition 2021 --color never -o /tmp/prog "$SRC" 2>/tmp/cerr.txt; then
  echo "__TUSST_COMPILE__ err"
  head -c 4096 /tmp/cerr.txt
  echo ""
  echo "__TUSST_END__"
  exit 0
fi
echo "__TUSST_COMPILE__ ok"

# Inner timeout guards the run; the host holds a wall timeout over everything.
timeout -k 1 5 /tmp/prog >/tmp/out.txt 2>/dev/null
STATUS=$?
if [ "$STATUS" -eq 124 ] || [ "$STATUS" -eq 137 ]; then
  echo "__TUSST_RUN__ timeout $STATUS"
elif [ "$STATUS" -ne 0 ]; then
  echo "__TUSST_RUN__ crash $STATUS"
else
  echo "__TUSST_RUN__ ok 0"
fi

echo "__TUSST_STDOUT__"
head -c 16384 /tmp/out.txt
echo ""
echo "__TUSST_END__"
exit 0
