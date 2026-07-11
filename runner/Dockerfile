# tusst-runner — hardened sandbox that grades one Rust submission.
#
# The grader is a Rust binary (crates/tusst-runner) built in stage 1; the
# runtime stage still needs the full rust image because submissions are
# compiled with rustc inside the container.
#
# Contract with tusst-web/src/lib/runner.ts:
#   stdin:  checks.json (hidden AST check spec — never touches disk)
#   mount:  /submission/main.rs (ro)
#   stdout: one line `__TUSST_REPORT__ {json}` (schema v1)
#   exit:   always 0; non-zero = infra trouble
#
# Security posture (enforced by the host's docker run flags — non-negotiable):
#   --network none            no network, ever
#   --read-only               immutable rootfs; /tmp is the only writable spot
#   --tmpfs /tmp (exec)       build + run scratch, capped at 256MB
#   --cap-drop ALL            no capabilities
#   --pids-limit / --memory / --cpus   fork/alloc/cpu bombs contained
#   non-root user             baked in below
#   host wall timeout         the container is killed even if the runner hangs
#
# Build: npm run runner:build   (docker build -t tusst-runner:latest runner)

# ---- stage 1: build the grader binary ------------------------------------
FROM rust:1-slim-bookworm AS build
WORKDIR /build

# Dependency layer: manifests + dummy sources so `cargo build` caches all
# external crates; invalidated only when Cargo.{toml,lock} change.
COPY Cargo.toml Cargo.lock ./
COPY crates/tusst-runner/Cargo.toml crates/tusst-runner/
COPY crates/tusst-syntest/Cargo.toml crates/tusst-syntest/
RUN mkdir -p crates/tusst-runner/src crates/tusst-syntest/src \
    && echo 'fn main() {}' > crates/tusst-runner/src/main.rs \
    && touch crates/tusst-syntest/src/lib.rs \
    && cargo build --release --locked \
    && rm -rf crates/*/src

COPY crates/ crates/
# touch: the dummy build left fingerprints newer than the real sources
RUN touch crates/tusst-syntest/src/lib.rs crates/tusst-runner/src/main.rs \
    && cargo build --release --locked

# ---- stage 2: runtime ------------------------------------------------------
FROM rust:1-slim-bookworm

RUN useradd --create-home --uid 10001 runner

COPY --from=build /build/target/release/tusst-runner /usr/local/bin/tusst-runner

USER runner
ENV HOME=/tmp
WORKDIR /tmp

ENTRYPOINT ["/usr/local/bin/tusst-runner"]
