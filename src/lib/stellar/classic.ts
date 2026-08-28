"use client";

// Classic (non-Soroban) Stellar operations for the Forge Labs: payments,
// trustlines, account creation — the first classic ops in the codebase.
// Same non-custodial shape as deploy.ts: build here, sign via ForgeWallet,
// submit straight to Horizon. Declarative specs (not sdk Operation objects)
// keep lab content serializable and the sdk import surface in one place.

import {
  Asset,
  BASE_FEE,
  Horizon,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { TESTNET } from "./network";
import type { ForgeWallet } from "./wallet";

export type ClassicOpSpec =
  | { type: "create-account"; destination: string; startingBalance: string }
  | {
      type: "payment";
      destination: string;
      amount: string;
      /** omit for native XLM */
      asset?: { code: string; issuer: string };
    }
  | {
      type: "change-trust";
      asset: { code: string; issuer: string };
      /** omit for the default max limit; "0" removes the trustline */
      limit?: string;
    };

function toAsset(asset?: { code: string; issuer: string }): Asset {
  return asset ? new Asset(asset.code, asset.issuer) : Asset.native();
}

function toOperation(spec: ClassicOpSpec): ReturnType<typeof Operation.payment> {
  switch (spec.type) {
    case "create-account":
      return Operation.createAccount({
        destination: spec.destination,
        startingBalance: spec.startingBalance,
      });
    case "payment":
      return Operation.payment({
        destination: spec.destination,
        amount: spec.amount,
        asset: toAsset(spec.asset),
      });
    case "change-trust":
      return Operation.changeTrust({
        asset: toAsset(spec.asset),
        limit: spec.limit,
      });
  }
}

/** Build an unsigned classic transaction XDR for the wallet to sign. */
export async function buildClassicTx(
  source: string,
  ops: ClassicOpSpec[],
): Promise<string> {
  const horizon = new Horizon.Server(TESTNET.horizonUrl);
  const account = await horizon.loadAccount(source);
  const builder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET.passphrase,
  });
  for (const spec of ops) builder.addOperation(toOperation(spec));
  return builder.setTimeout(120).build().toXDR();
}

export interface ClassicSubmitResult {
  hash: string;
}

// Horizon's classic result codes are precise teaching material — surface the
// common ones as short, human phrases the lab UI can translate/decorate.
const RESULT_CODE_HINTS: Record<string, string> = {
  op_underfunded: "not enough XLM to send that amount",
  op_no_destination: "the destination account does not exist yet",
  op_no_trust: "the destination has no trustline for this asset",
  op_low_reserve: "balance would drop below the base reserve",
  op_line_full: "the destination's trustline limit is full",
  tx_bad_seq: "sequence number out of date — rebuild and retry",
  tx_insufficient_fee: "network fee too low right now — retry",
};

export class ClassicSubmitError extends Error {
  readonly codes: string[];
  readonly retryable: boolean;
  constructor(message: string, codes: string[], retryable: boolean) {
    super(message);
    this.name = "ClassicSubmitError";
    this.codes = codes;
    this.retryable = retryable;
  }
}

export async function submitClassicTx(
  signedXdr: string,
): Promise<ClassicSubmitResult> {
  const res = await fetch(`${TESTNET.horizonUrl}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `tx=${encodeURIComponent(signedXdr)}`,
  });
  const body = (await res.json().catch(() => ({}))) as {
    hash?: string;
    extras?: {
      result_codes?: { transaction?: string; operations?: string[] };
    };
  };
  if (res.ok && body.hash) return { hash: body.hash };

  const txCode = body.extras?.result_codes?.transaction;
  const opCodes = body.extras?.result_codes?.operations ?? [];
  const codes = [txCode, ...opCodes].filter(
    (c): c is string => !!c && c !== "op_success" && c !== "tx_failed",
  );
  const hint = codes.map((c) => RESULT_CODE_HINTS[c]).find(Boolean);
  const retryable =
    res.status === 504 ||
    res.status === 429 ||
    codes.includes("tx_bad_seq") ||
    codes.includes("tx_insufficient_fee");
  throw new ClassicSubmitError(
    hint ?? `transaction failed (${codes.join(", ") || res.status})`,
    codes,
    retryable,
  );
}

/** One round trip: build → wallet sign → submit. */
export async function runClassicOps(
  wallet: ForgeWallet,
  ops: ClassicOpSpec[],
): Promise<ClassicSubmitResult> {
  const xdr = await buildClassicTx(wallet.address, ops);
  const signed = await wallet.signTransaction(xdr);
  return submitClassicTx(signed);
}

/** Trustline lookup used by lab UI (server verification has its own copy). */
export async function hasTrustline(
  address: string,
  asset: { code: string; issuer: string },
): Promise<boolean> {
  const res = await fetch(
    `${TESTNET.horizonUrl}/accounts/${encodeURIComponent(address)}`,
  );
  if (!res.ok) return false;
  const data = (await res.json()) as {
    balances?: Array<{
      asset_code?: string;
      asset_issuer?: string;
    }>;
  };
  return (
    data.balances?.some(
      (b) => b.asset_code === asset.code && b.asset_issuer === asset.issuer,
    ) ?? false
  );
}
