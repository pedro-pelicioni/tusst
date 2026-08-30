"use client";

// The Rune Reader: base64 XDR in, a readable tree out.
//
// No new dependency — `TransactionBuilder.fromXDR` and the `xdr` namespace are
// already how deploy.ts and wallet.ts round-trip envelopes. The parsed
// Operation objects the SDK hands back are far better teaching material than
// the raw XDR union, so we normalize those rather than walking the union: the
// point is for a student to recognise the transaction they just signed.

import {
  Asset,
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { TESTNET } from "./network";

export class XdrDecodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XdrDecodeError";
  }
}

export interface DecodedOperation {
  index: number;
  type: string;
  /** per-operation source, when it overrides the transaction's */
  source?: string;
  fields: Record<string, unknown>;
}

export interface DecodedEnvelope {
  kind: "transaction" | "fee-bump";
  hash: string;
  source: string;
  fee: string;
  sequence?: string;
  memo?: string;
  timeBounds?: { minTime: string; maxTime: string };
  operations: DecodedOperation[];
  signatures: { hint: string; signature: string }[];
}

function assetToString(asset: Asset): string {
  return asset.isNative() ? "native" : `${asset.getCode()}:${asset.getIssuer()}`;
}

/**
 * Make an SDK operation object safe to render: Assets collapse to their canonical
 * string, Buffers to hex, BigInts to decimal. Anything else recurses.
 */
function plain(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (depth > 6) return "…";
  if (value instanceof Asset) return assetToString(value);
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Uint8Array) return Buffer.from(value).toString("hex");
  if (Array.isArray(value)) return value.map((v) => plain(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = plain(v, depth + 1);
    }
    return out;
  }
  return value;
}

function describeMemo(tx: Transaction): string | undefined {
  const memo = tx.memo;
  if (!memo || memo.type === "none") return undefined;
  const value = memo.value;
  const rendered =
    value instanceof Uint8Array
      ? Buffer.from(value).toString("hex")
      : String(value ?? "");
  return `${memo.type}: ${rendered}`;
}

function decodeOperations(tx: Transaction): DecodedOperation[] {
  return tx.operations.map((op, index) => {
    const { type, source, ...rest } = op as Record<string, unknown> & {
      type: string;
      source?: string;
    };
    return {
      index,
      type,
      source,
      fields: plain(rest) as Record<string, unknown>,
    };
  });
}

/** Decode a signed or unsigned transaction envelope. Throws on malformed input. */
export function decodeEnvelope(base64: string): DecodedEnvelope {
  const trimmed = base64.trim();
  if (trimmed === "") throw new XdrDecodeError("empty input");

  let parsed: Transaction | FeeBumpTransaction;
  try {
    parsed = TransactionBuilder.fromXDR(trimmed, TESTNET.passphrase);
  } catch (e) {
    throw new XdrDecodeError(
      e instanceof Error ? e.message : "not a transaction envelope",
    );
  }

  const signatures = parsed.signatures.map((s) => ({
    // sdk 17 wraps these in BytesValue, whose toString() honours a per-type
    // declared encoding — go through toBytes() so both stay hex regardless.
    hint: Buffer.from(s.hint.toBytes()).toString("hex"),
    signature: Buffer.from(s.signature.toBytes()).toString("hex"),
  }));

  if (parsed instanceof FeeBumpTransaction) {
    return {
      kind: "fee-bump",
      hash: Buffer.from(parsed.hash()).toString("hex"),
      source: parsed.feeSource,
      fee: parsed.fee,
      operations: decodeOperations(parsed.innerTransaction),
      signatures,
    };
  }

  return {
    kind: "transaction",
    hash: Buffer.from(parsed.hash()).toString("hex"),
    source: parsed.source,
    fee: parsed.fee,
    sequence: parsed.sequence,
    memo: describeMemo(parsed),
    timeBounds: parsed.timeBounds
      ? {
          minTime: String(parsed.timeBounds.minTime),
          maxTime: String(parsed.timeBounds.maxTime),
        }
      : undefined,
    operations: decodeOperations(parsed),
    signatures,
  };
}

/** Decode a standalone ScVal (contract return values, ledger entry values). */
export function decodeScVal(base64: string): unknown {
  try {
    const value = xdr.ScVal.fromXDR(base64.trim(), "base64");
    return plain(value.value);
  } catch (e) {
    throw new XdrDecodeError(
      e instanceof Error ? e.message : "not a valid ScVal",
    );
  }
}

/** Decode a transaction result (the `result_xdr` Horizon returns on failure). */
export function decodeTransactionResult(base64: string): unknown {
  try {
    const result = xdr.TransactionResult.fromXDR(base64.trim(), "base64");
    return {
      feeCharged: result.feeCharged.toString(),
      result: result.result.type,
    };
  } catch (e) {
    throw new XdrDecodeError(
      e instanceof Error ? e.message : "not a transaction result",
    );
  }
}

export type XdrFlavor = "envelope" | "scval" | "result";

/** Try the requested flavor; "envelope" is what a builder pastes 95% of the time. */
export function decodeXdr(base64: string, flavor: XdrFlavor): unknown {
  switch (flavor) {
    case "envelope":
      return decodeEnvelope(base64);
    case "scval":
      return decodeScVal(base64);
    case "result":
      return decodeTransactionResult(base64);
  }
}
