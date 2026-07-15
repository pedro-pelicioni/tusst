import "server-only";

import {
  isValidForgePath,
  MAX_FILE_BYTES,
  MAX_PROJECT_FILES,
  MAX_TOTAL_BYTES,
} from "./paths";
import type { SorobanFileMap } from "./types";

// Validation of the user-supplied file map before anything touches disk.
// The Docker sandbox is the real security boundary — these rules exist to
// keep the host filesystem writes trivially safe and the errors friendly.

const MAX_FILES = MAX_PROJECT_FILES;

export type ValidationResult =
  | { ok: true; files: SorobanFileMap }
  | { ok: false; error: string };

/**
 * Cheap UX guard, not security: dependencies outside the curated crates.io
 * set can't resolve offline, so fail fast with a clear message instead of a
 * confusing cargo error from inside the sandbox.
 */
function manifestComplaint(cargoToml: string): string | null {
  const stripped = cargoToml
    .split("\n")
    .map((l) => l.replace(/#.*$/, ""))
    .join("\n");
  if (/^\s*\[patch/m.test(stripped)) {
    return "[patch] sections aren't supported — only the curated crates.io set is available offline.";
  }
  if (/^\s*[A-Za-z0-9_-]+\s*=\s*\{[^}]*\b(path|git)\s*=/m.test(stripped) || /^\s*(path|git)\s*=/m.test(stripped)) {
    return "path/git dependencies aren't supported — only the curated crates.io set is available offline.";
  }
  return null;
}

export function validateFiles(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "Expected { files: Record<string, string> }." };
  }
  const entries = Object.entries(input as Record<string, unknown>);
  if (entries.length === 0) {
    return { ok: false, error: "The project has no files." };
  }
  if (entries.length > MAX_FILES) {
    return { ok: false, error: `Too many files (max ${MAX_FILES}).` };
  }

  const files: SorobanFileMap = {};
  let total = 0;
  for (const [path, contents] of entries) {
    if (typeof contents !== "string") {
      return { ok: false, error: `File "${path}" must be a string.` };
    }
    if (!isValidForgePath(path)) {
      return {
        ok: false,
        error: `Invalid path "${path}" — only Cargo.toml and src/** are allowed.`,
      };
    }
    const bytes = Buffer.byteLength(contents, "utf8");
    if (bytes > MAX_FILE_BYTES) {
      return { ok: false, error: `File "${path}" is too large (128KB max).` };
    }
    total += bytes;
    files[path] = contents;
  }
  if (total > MAX_TOTAL_BYTES) {
    return { ok: false, error: "Project too large (512KB max)." };
  }
  if (!files["Cargo.toml"]) {
    return { ok: false, error: "The project needs a Cargo.toml." };
  }
  if (!files["src/lib.rs"]) {
    return { ok: false, error: "The project needs a src/lib.rs." };
  }

  const complaint = manifestComplaint(files["Cargo.toml"]);
  if (complaint) return { ok: false, error: complaint };

  return { ok: true, files };
}
