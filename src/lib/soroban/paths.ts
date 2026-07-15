// Path rules for Forge project files — shared by the server-side validator
// and the client-side file tree (so the UI rejects what the API would).

const SEGMENT_RE = /^[A-Za-z0-9_.-]{1,64}$/;

export const MAX_PROJECT_FILES = 32;
export const MAX_FILE_BYTES = 128 * 1024;
export const MAX_TOTAL_BYTES = 512 * 1024;

export function isValidForgePath(path: string): boolean {
  if (path === "Cargo.toml") return true;
  if (!path.startsWith("src/")) return false;
  const segments = path.split("/");
  if (segments.length < 2 || segments.length > 3) return false;
  return segments.every((s) => SEGMENT_RE.test(s) && s !== "." && s !== "..");
}
