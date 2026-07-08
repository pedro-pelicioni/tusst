# tusst-runner — hardened sandbox image for grading Rust submissions.
#
# The container is run by tusst-web with (non-negotiable):
#   --network none --read-only --tmpfs /tmp:rw,exec,size=256m
#   --cap-drop ALL --pids-limit 128 --memory 512m --cpus 1
# plus a host-side wall timeout. Nothing in this image is secret; all hidden
# test data stays in tusst-web (server-only) — the runner only ever sees the
# submitted code and returns marker-delimited results on stdout.

FROM rust:1-slim-bookworm

# Non-root execution user.
RUN useradd --create-home --uid 10001 runner

COPY entrypoint.sh /entrypoint.sh
RUN chmod 0555 /entrypoint.sh

USER runner
ENV HOME=/tmp
WORKDIR /tmp

ENTRYPOINT ["/entrypoint.sh"]
