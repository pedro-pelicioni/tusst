// Shared types for the Forge (Soroban IDE) pipeline. Isomorphic — types only.

export type ForgeMode = "build" | "test" | "audit";

/** Repo-relative path → file contents. Only `Cargo.toml` and `src/**`. */
export type SorobanFileMap = Record<string, string>;

/** One NDJSON line of a /api/soroban/{compile,test,audit} response stream. */
export type ForgeEvent =
  | { t: "queued"; position: number }
  | { t: "phase"; name: "prepare" | "compile" | "test" | "audit" }
  | { t: "log"; line: string }
  | { t: "wasm"; b64: string }
  | { t: "ping" }
  | { t: "done"; ok: boolean; timedOut: boolean; infraError: boolean };
