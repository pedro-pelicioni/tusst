# Forge sandbox image — builds, tests and audits Soroban contracts offline.
#
# Build:  docker build -t tusst-soroban-runner:latest runner-soroban
# (slow on first build: it pre-compiles the entire curated dependency set and
# the Scout analyzer so runtime containers work with --network none)
#
# Security posture mirrors runner/Dockerfile: non-root user, no network at
# runtime, host-enforced wall timeout. Unlike the lesson runner, containers
# run WITHOUT --read-only: cargo builds in-place at /opt/warm inside the
# container's ephemeral layer, reusing the pre-compiled target/ with zero copy.

FROM rust:1-slim-bookworm

ARG STELLAR_CLI_VERSION=27.0.0
ARG SCOUT_AUDIT_VERSION=0.3.16

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates libdbus-1-3 libudev1 \
    && rm -rf /var/lib/apt/lists/*

# Pinned stellar-cli release binary (the CLI drives `stellar contract build`,
# which targets wasm32v1-none and applies Soroban-required build settings).
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
      amd64) triple=x86_64-unknown-linux-gnu ;; \
      arm64) triple=aarch64-unknown-linux-gnu ;; \
      *) echo "unsupported arch: $arch"; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/stellar/stellar-cli/releases/download/v${STELLAR_CLI_VERSION}/stellar-cli-${STELLAR_CLI_VERSION}-${triple}.tar.gz" \
      | tar -xz -C /usr/local/bin stellar; \
    stellar --version

RUN rustup target add wasm32v1-none

RUN useradd --create-home --uid 10001 runner
ENV CARGO_HOME=/opt/cargo
RUN mkdir -p "$CARGO_HOME" && chown -R runner:runner "$CARGO_HOME"

COPY --chown=runner:runner warm/ /opt/warm/
USER runner
WORKDIR /opt/warm

# Warm every cache at image build time: full registry in /opt/cargo, plus
# pre-compiled dependencies for BOTH the wasm release profile and the native
# test profile. The warm contract's own artifacts are removed so a runtime
# build's freshest .wasm is always the user's.
# ed25519-dalek 3.x breaks soroban-env-host's testutils (open ">=2.0.0" req
# upstream); pin 2.2.0 in the lockfile, which ships in the image and governs
# every offline user build.
RUN cargo generate-lockfile \
    && cargo update -p ed25519-dalek@3.0.0 --precise 2.2.0 \
    && cargo fetch
RUN stellar contract build
RUN cargo test --no-run && cargo test
RUN rm -rf /opt/warm/target/*/incremental /opt/warm/target/incremental \
    && rm -f /opt/warm/target/wasm32v1-none/release/*.wasm

# Scout static analyzer (audit mode). Installed and pre-run here so its
# detectors/toolchains are cached in the image and audits can run offline.
# Failures are tolerated: the entrypoint degrades audit gracefully if absent.
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential pkg-config libssl-dev git \
    && rm -rf /var/lib/apt/lists/*
# rustup insists on finding its shims at $CARGO_HOME/bin — satisfy it with
# symlinks since we relocated CARGO_HOME to /opt/cargo.
RUN mkdir -p /opt/cargo/bin && ln -sf /usr/local/cargo/bin/* /opt/cargo/bin/ \
    && chown -R runner:runner /opt/cargo/bin
# Scout's build script requires this exact nightly (with compiler internals)
# and can't install it itself as an unprivileged user.
RUN rustup toolchain install nightly-2025-08-07 --profile minimal \
      --component rustc-dev --component llvm-tools-preview --component rust-src \
    || echo "WARN: nightly toolchain install failed — audit mode will be unavailable"
USER runner
# Scout's build script shells out to install dylint-link itself and fails in
# this layout — pre-installing it satisfies the check.
RUN cargo +nightly-2025-08-07 install --locked dylint-link \
    || echo "WARN: dylint-link install failed — audit mode will be unavailable"
RUN cargo install --locked cargo-scout-audit@${SCOUT_AUDIT_VERSION} \
    || echo "WARN: scout install failed — audit mode will be unavailable"
# Audit is enabled ONLY if this offline-priming run succeeds end-to-end; the
# entrypoint checks the marker. As of scout 0.3.16 the warm run fails against
# soroban-sdk 26 (scout builds for wasm32-unknown-unknown, which sdk >= 26
# rejects on Rust >= 1.82) — audit stays gracefully disabled until a scout
# release supports it, at which point bumping SCOUT_AUDIT_VERSION re-enables.
RUN (cargo scout-audit && touch /opt/scout-ready) \
    || echo "WARN: scout warm run failed — audit mode will report unavailable"

USER root
COPY entrypoint.sh /entrypoint.sh
RUN chmod 0555 /entrypoint.sh

USER runner
WORKDIR /opt/warm
ENTRYPOINT ["/entrypoint.sh"]
