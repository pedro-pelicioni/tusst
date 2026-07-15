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
# Scout source checkout, pinned to the installed release. Running with
# --scout-source + --local-detectors makes scout use these detectors (built
# against the pinned nightly) instead of its default resolution path.
# Recipe adapted from Soroban-Playground (jamesbachini, MIT). Owned by
# runner: scout compiles inside this tree.
RUN git clone --depth 1 --branch release/${SCOUT_AUDIT_VERSION} \
      https://github.com/CoinFabrik/scout-audit.git /scout-audit \
    && test -d /scout-audit/nightly/2025-08-07/detectors/soroban \
    && chown -R runner:runner /scout-audit \
    || echo "WARN: scout source clone failed — audit mode will be unavailable"
USER runner
# Scout's build script shells out to install dylint-link itself and fails in
# this layout — pre-installing it satisfies the check.
RUN cargo +nightly-2025-08-07 install --locked dylint-link \
    || echo "WARN: dylint-link install failed — audit mode will be unavailable"
RUN cargo install --locked cargo-scout-audit@${SCOUT_AUDIT_VERSION} \
    || echo "WARN: scout install failed — audit mode will be unavailable"

USER root
# The wasm32v1-none target lets scout's cargo-check pass run against the real
# Soroban target (its default, wasm32-unknown-unknown, is rejected by
# soroban-sdk >= 26).
RUN rustup target add wasm32v1-none --toolchain nightly-2025-08-07 \
    || echo "WARN: nightly wasm target install failed — audit mode will be unavailable"
# soroban-sdk-macros calls str::floor_char_boundary, stable on the image's
# rustc but still feature-gated on scout's pinned nightly (E0658). Vendor the
# exact versions the curated set resolves and swap in a stable equivalent;
# audit runs redirect to these via [patch.crates-io] (audit-patch.toml is
# appended to the project manifest by the entrypoint in audit mode only —
# build/test always compile the pristine registry crates on stable).
RUN set -eux; \
    mkdir -p /opt/vendor; \
    for v in 25.3.1 26.1.0; do \
      short="soroban-sdk-macros-${v%%.*}"; \
      cp -R /opt/cargo/registry/src/index.crates.io-*/soroban-sdk-macros-${v} /opt/vendor/${short}; \
      rm -f /opt/vendor/${short}/.cargo-checksum.json; \
      grep -q 'docs.floor_char_boundary(max)' /opt/vendor/${short}/src/doc.rs; \
      sed -i 's|let safe_len = docs.floor_char_boundary(max);|let safe_len = { let mut i = max.min(docs.len()); while i > 0 \&\& !docs.is_char_boundary(i) { i -= 1; } i };|' \
        /opt/vendor/${short}/src/doc.rs; \
    done; \
    printf '\n[patch.crates-io]\nsoroban-sdk-macros = { path = "/opt/vendor/soroban-sdk-macros-26" }\nsdk-macros-25 = { package = "soroban-sdk-macros", path = "/opt/vendor/soroban-sdk-macros-25" }\n' \
      > /opt/audit-patch.toml; \
    chown -R runner:runner /opt/vendor
USER runner
# Warm run mirroring exactly what the entrypoint does in audit mode, so
# detectors, driver and dependency analysis artifacts are all pre-built and
# runtime audits (offline, memory-capped) only analyze the user's crate.
# Scout exits 0 even when the analyzed crate fails to compile, so success is
# detected from the report ("Analyzed" row), not the exit code. The marker
# lives under CARGO_HOME because runner cannot write /opt.
RUN cp Cargo.toml /tmp/Cargo.toml.orig && cp Cargo.lock /tmp/Cargo.lock.orig \
    && cat /opt/audit-patch.toml >> Cargo.toml \
    && (SOROBAN_SDK_BUILD_SYSTEM_SUPPORTS_SPEC_SHAKING_V2=1 CARGO_BUILD_JOBS=2 \
          cargo scout-audit --debug \
          --scout-source /scout-audit --local-detectors /scout-audit/nightly \
          -- --target=wasm32v1-none 2>&1 | tee /tmp/scout-warm.log; \
        grep -q "Analyzed" /tmp/scout-warm.log && touch /opt/cargo/scout-ready) \
    || echo "WARN: scout warm run failed — audit mode will report unavailable"; \
    mv /tmp/Cargo.toml.orig Cargo.toml && mv /tmp/Cargo.lock.orig Cargo.lock \
    && rm -f /tmp/scout-warm.log

USER root
COPY entrypoint.sh /entrypoint.sh
RUN chmod 0555 /entrypoint.sh

USER runner
WORKDIR /opt/warm
ENTRYPOINT ["/entrypoint.sh"]
