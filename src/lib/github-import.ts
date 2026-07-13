"use client";

import type { SorobanFileMap } from "@/lib/soroban/types";
import {
  isValidForgePath,
  MAX_FILE_BYTES,
  MAX_PROJECT_FILES,
  MAX_TOTAL_BYTES,
} from "@/lib/soroban/paths";
import { CURATED_CARGO_TOML } from "@/content/soroban-templates";

// Import a Soroban project straight from a public GitHub URL, entirely
// client-side (GitHub's API and raw host both allow cross-origin reads).
//
// One Git Trees API call (`?recursive=1`) lists the whole repo with per-entry
// sizes, so every limit is enforced BEFORE any file downloads — important
// under the anonymous rate limit of 60 API requests/hour. File contents come
// from raw.githubusercontent.com, which is not rate-limited the same way.

export class GithubImportError extends Error {}

export interface GithubSource {
  owner: string;
  repo: string;
  /** null → let GitHub resolve the default branch via HEAD */
  ref: string | null;
  path: string;
  kind: "repo" | "tree" | "blob";
}

export interface GithubImportPreview {
  name: string;
  files: SorobanFileMap;
  warnings: string[];
}

/** Accepts repo root, /tree/{ref}/{path} and /blob/{ref}/{file} URLs. */
export function parseGithubUrl(url: string): GithubSource {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    throw new GithubImportError("that doesn't look like a URL");
  }
  if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") {
    throw new GithubImportError("only github.com URLs are supported");
  }
  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new GithubImportError("expected github.com/{owner}/{repo}[…]");
  }
  const [owner, rawRepo, type, ref, ...rest] = parts;
  const repo = rawRepo.replace(/\.git$/, "");
  if (type === "tree" || type === "blob") {
    if (!ref) throw new GithubImportError("URL is missing the branch name");
    // A branch name containing "/" is indistinguishable from the path in a
    // plain URL; assume single-segment refs (true for main/master/v1.2.3).
    return { owner, repo, ref, path: rest.join("/"), kind: type };
  }
  return { owner, repo, ref: null, path: "", kind: "repo" };
}

interface TreeEntry {
  path: string;
  type: "blob" | "tree" | "commit";
  size?: number;
}

async function fetchTree(
  source: GithubSource,
  ref: string,
): Promise<{ entries: TreeEntry[]; truncated: boolean }> {
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) {
    throw new GithubImportError(
      "repo or branch not found — private repos aren't supported",
    );
  }
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    const when = reset
      ? ` — try again after ${new Date(Number(reset) * 1000).toLocaleTimeString()}`
      : "";
    throw new GithubImportError(`GitHub rate limit hit${when}`);
  }
  if (!res.ok) {
    throw new GithubImportError(`GitHub API error (${res.status})`);
  }
  const data = (await res.json()) as { tree?: TreeEntry[]; truncated?: boolean };
  return { entries: data.tree ?? [], truncated: data.truncated === true };
}

async function fetchRaw(source: GithubSource, ref: string, path: string): Promise<string> {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${encodeURIComponent(ref)}/${encoded}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new GithubImportError(`failed to download ${path} (${res.status})`);
  }
  return res.text();
}

function manifestWarnings(cargoToml: string): string[] {
  const warnings: string[] = [];
  const stripped = cargoToml
    .split("\n")
    .map((l) => l.replace(/#.*$/, ""))
    .join("\n");
  if (/^\s*\[workspace/m.test(stripped) || /\bworkspace\s*=\s*true/.test(stripped)) {
    warnings.push(
      "Cargo.toml relies on a workspace — the Forge builds single crates, so pin the dependency versions directly if the build fails",
    );
  }
  if (
    /^\s*\[patch/m.test(stripped) ||
    /^\s*[A-Za-z0-9_-]+\s*=\s*\{[^}]*\b(path|git)\s*=/m.test(stripped)
  ) {
    warnings.push(
      "Cargo.toml uses path/git/[patch] dependencies — only the curated crates.io set resolves in the sandbox, so builds may fail",
    );
  }
  return warnings;
}

function deriveName(source: GithubSource): string {
  const lastSegment = source.path.split("/").filter(Boolean).pop();
  return (lastSegment ?? source.repo).replace(/\.rs$/, "");
}

/** Fetch and shape a GitHub URL into Forge project files, with warnings. */
export async function importFromGithub(url: string): Promise<GithubImportPreview> {
  const source = parseGithubUrl(url);
  const ref = source.ref ?? "HEAD";
  const warnings: string[] = [];

  // Single file: wrap it as the lib of a curated-manifest project.
  if (source.kind === "blob") {
    if (!/\.rs$/.test(source.path)) {
      throw new GithubImportError("single-file imports must point at a .rs file");
    }
    const contents = await fetchRaw(source, ref, source.path);
    if (contents.length > MAX_FILE_BYTES) {
      throw new GithubImportError("that file is larger than the 128KB limit");
    }
    warnings.push("single file imported as src/lib.rs with the curated Cargo.toml");
    return {
      name: deriveName(source),
      files: { "Cargo.toml": CURATED_CARGO_TOML, "src/lib.rs": contents },
      warnings,
    };
  }

  const { entries, truncated } = await fetchTree(source, ref);
  if (truncated) {
    throw new GithubImportError(
      "this repo is too large for GitHub's tree listing — point the URL at the contract's subfolder (/tree/…)",
    );
  }

  // Scope to the subfolder (for /tree URLs) and keep only Forge-shaped paths.
  const prefix = source.path ? `${source.path}/` : "";
  const wanted: Array<{ repoPath: string; relPath: string; size: number }> = [];
  let skippedSrc = 0;
  for (const entry of entries) {
    if (entry.type !== "blob") continue;
    if (prefix && !entry.path.startsWith(prefix)) continue;
    const rel = entry.path.slice(prefix.length);
    if (isValidForgePath(rel)) {
      wanted.push({ repoPath: entry.path, relPath: rel, size: entry.size ?? 0 });
    } else if (rel.startsWith("src/")) {
      skippedSrc++;
    }
  }
  if (skippedSrc > 0) {
    warnings.push(
      `${skippedSrc} file(s) under src/ skipped (nested too deep or unusual characters)`,
    );
  }
  if (wanted.length === 0) {
    throw new GithubImportError(
      source.path
        ? "no Cargo.toml or src/ files found in that folder"
        : "no Cargo.toml or src/ files found at the repo root — for monorepos, point the URL at the contract's subfolder (/tree/…)",
    );
  }

  // Enforce every limit from the tree metadata before downloading anything.
  if (wanted.length > MAX_PROJECT_FILES) {
    throw new GithubImportError(
      `too many project files (${wanted.length}; the Forge allows ${MAX_PROJECT_FILES})`,
    );
  }
  const oversized = wanted.find((f) => f.size > MAX_FILE_BYTES);
  if (oversized) {
    throw new GithubImportError(`${oversized.relPath} is larger than the 128KB limit`);
  }
  const totalBytes = wanted.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    throw new GithubImportError("the project exceeds the 512KB total limit");
  }

  const files: SorobanFileMap = {};
  await Promise.all(
    wanted.map(async (f) => {
      files[f.relPath] = await fetchRaw(source, ref, f.repoPath);
    }),
  );

  if (!files["src/lib.rs"]) {
    throw new GithubImportError(
      "no src/lib.rs found — the Forge needs the contract's crate root",
    );
  }
  if (!files["Cargo.toml"]) {
    files["Cargo.toml"] = CURATED_CARGO_TOML;
    warnings.push("no Cargo.toml found — using the Forge's curated manifest");
  } else {
    warnings.push(...manifestWarnings(files["Cargo.toml"]));
  }

  return { name: deriveName(source), files, warnings };
}
