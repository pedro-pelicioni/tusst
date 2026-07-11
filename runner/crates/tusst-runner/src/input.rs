//! Submission source + check spec intake.
//!
//! The spec arrives on STDIN (never on disk): /submission is readable by the
//! student's program, so a mounted checks.json would leak the hidden tests.
//! Stdin is fully consumed before anything executes, and the student process
//! is spawned with stdin(null) + env_clear — no path back to the spec.

use std::io::Read;

pub const DEFAULT_SRC_PATH: &str = "/submission/main.rs";
const MAX_SPEC_BYTES: u64 = 64 * 1024;
const MAX_SRC_BYTES: u64 = 256 * 1024;

pub fn src_path() -> String {
    // Env override exists for local `cargo test`/`cargo run` only; inside the
    // container the entrypoint has no env set and uses the default.
    std::env::var("TUSST_SRC_PATH").unwrap_or_else(|_| DEFAULT_SRC_PATH.to_string())
}

pub fn read_source() -> Result<String, String> {
    let path = src_path();
    let file = std::fs::File::open(&path).map_err(|e| format!("open {path}: {e}"))?;
    let mut source = String::new();
    file.take(MAX_SRC_BYTES)
        .read_to_string(&mut source)
        .map_err(|e| format!("read {path}: {e}"))?;
    Ok(source)
}

pub fn read_spec_json() -> Result<String, String> {
    let mut json = String::new();
    std::io::stdin()
        .take(MAX_SPEC_BYTES)
        .read_to_string(&mut json)
        .map_err(|e| format!("read spec from stdin: {e}"))?;
    Ok(json)
}
