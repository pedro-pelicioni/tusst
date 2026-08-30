// Reading errors that the Stellar SDK does not throw as Errors.
//
// js-stellar-sdk rejects several RPC calls with a PLAIN OBJECT — the shape is
// `{ code: 404, message: "Could not obtain contract instance from server" }`,
// not an Error instance. Any `e instanceof Error ? e.message : fallback`
// therefore silently discards a perfectly good explanation and shows a generic
// one instead, which is how "load a contract id that does not exist" ended up
// reporting "could not load the contract" and nothing else.
//
// The `code` matters as much as the text: a 404 means the ledger entry is not
// there, which for a contract id we curated ourselves means its state was
// archived rather than that the id is wrong.

export interface StellarErrorInfo {
  message: string;
  /** HTTP-ish status the RPC reported, when it reported one */
  code?: number;
}

export function errorInfo(e: unknown, fallback: string): StellarErrorInfo {
  if (e instanceof Error) return { message: e.message };
  if (typeof e === "object" && e !== null) {
    const bag = e as { message?: unknown; code?: unknown };
    const message = typeof bag.message === "string" ? bag.message : fallback;
    const code = typeof bag.code === "number" ? bag.code : undefined;
    return { message, code };
  }
  if (typeof e === "string" && e.trim() !== "") return { message: e };
  return { message: fallback };
}

/** Convenience for call sites that only want text. */
export function errorText(e: unknown, fallback: string): string {
  return errorInfo(e, fallback).message;
}
