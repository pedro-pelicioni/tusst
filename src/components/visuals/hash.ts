"use client";

// Real SHA-256 through the Web Crypto API — the fingerprints in the ledger sim
// are the actual thing the chapter describes, not a stand-in.
//
// The fallback exists because `crypto.subtle` is only available in a secure
// context; on plain http (a LAN preview, say) the sim would otherwise be dead.
// It is clearly not a cryptographic hash and never claims to be — it just
// keeps the teaching interaction alive.

function fnv1aHex(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0").repeat(8).slice(0, 64);
}

export async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) return fnv1aHex(input);
  try {
    // .slice() pins the view to a plain ArrayBuffer — TS 5.9 narrowed
    // Uint8Array's buffer type and BufferSource no longer accepts the union.
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", bytes.slice().buffer);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return fnv1aHex(input);
  }
}

/** The chain: every page's fingerprint folds in the one before it. */
export async function chainFingerprints(texts: string[]): Promise<string[]> {
  const out: string[] = [];
  let prev = "";
  for (const text of texts) {
    prev = await sha256Hex(`${prev}${text}`);
    out.push(prev);
  }
  return out;
}
