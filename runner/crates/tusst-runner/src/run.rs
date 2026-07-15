//! Execute the compiled submission with a hard 5s timeout.

use std::io::Read;
use std::process::{Command, Stdio};
use std::time::Duration;

use wait_timeout::ChildExt;

use crate::report::{cap, RunStatus, MAX_STDOUT};

const RUN_TIMEOUT: Duration = Duration::from_secs(5);

pub struct RunOutcome {
    pub status: RunStatus,
    pub exit_code: Option<i32>,
    pub stdout: String,
}

pub fn execute(prog_path: &str) -> RunOutcome {
    let infra = |msg: String| RunOutcome {
        status: RunStatus::Crash,
        exit_code: None,
        stdout: msg,
    };

    // stdin(null) + env_clear: the student process must not be able to reach
    // back to the check spec (which arrived on OUR stdin) or observe anything
    // about the grading environment.
    let mut child = match Command::new(prog_path)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .env_clear()
        .current_dir("/tmp")
        .spawn()
    {
        Ok(c) => c,
        Err(e) => return infra(format!("internal: failed to run program: {e}")),
    };

    // Drain stdout on a thread, continuously, keeping only the first 16KB.
    // Never stop reading: a fast, verbose program would otherwise fill the
    // pipe, block on write, and masquerade as a timeout.
    let mut pipe = child.stdout.take().expect("stdout was piped");
    let reader = std::thread::spawn(move || {
        let mut kept = Vec::with_capacity(MAX_STDOUT);
        let mut buf = [0u8; 8192];
        loop {
            match pipe.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => {
                    let room = MAX_STDOUT.saturating_sub(kept.len());
                    kept.extend_from_slice(&buf[..n.min(room)]);
                    // room == 0 → keep looping, discarding
                }
            }
        }
        kept
    });

    let status = match child.wait_timeout(RUN_TIMEOUT) {
        Ok(Some(status)) => status,
        Ok(None) => {
            // Timed out: SIGKILL (same net effect as coreutils `timeout -k`).
            let _ = child.kill();
            let _ = child.wait();
            let stdout_bytes = reader.join().unwrap_or_default();
            return RunOutcome {
                status: RunStatus::Timeout,
                exit_code: None,
                stdout: capped_lossy(&stdout_bytes),
            };
        }
        Err(e) => {
            let _ = child.kill();
            let _ = child.wait();
            let _ = reader.join();
            return infra(format!("internal: wait failed: {e}"));
        }
    };

    let stdout_bytes = reader.join().unwrap_or_default();
    RunOutcome {
        status: if status.success() {
            RunStatus::Ok
        } else {
            RunStatus::Crash
        },
        exit_code: status.code(),
        stdout: capped_lossy(&stdout_bytes),
    }
}

fn capped_lossy(bytes: &[u8]) -> String {
    cap(&String::from_utf8_lossy(bytes), MAX_STDOUT)
}
