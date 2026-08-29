"use client";

// Classic (non-Soroban) Stellar operations for the Forge Labs: payments,
// trustlines, account creation — the first classic ops in the codebase.
// Same non-custodial shape as deploy.ts: build here, sign via ForgeWallet,
// submit straight to Horizon. Declarative specs (not sdk Operation objects)
// keep lab content serializable and the sdk import surface in one place.

import {
  Asset,
  BASE_FEE,
  Claimant,
  Horizon,
  Operation,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { TESTNET } from "./network";
import type { ForgeWallet } from "./wallet";

export interface ClassicAsset {
  code: string;
  issuer: string;
}

export type ClassicOpSpec =
  | { type: "create-account"; destination: string; startingBalance: string }
  | {
      type: "payment";
      destination: string;
      amount: string;
      /** omit for native XLM */
      asset?: ClassicAsset;
    }
  | {
      type: "change-trust";
      asset: ClassicAsset;
      /** omit for the default max limit; "0" removes the trustline */
      limit?: string;
    }
  | {
      type: "path-payment-strict-send";
      destination: string;
      sendAsset?: ClassicAsset;
      sendAmount: string;
      destAsset?: ClassicAsset;
      /** the least the destination will accept — slippage floor */
      destMin: string;
    }
  | {
      type: "path-payment-strict-receive";
      destination: string;
      sendAsset?: ClassicAsset;
      /** the most the sender will part with — slippage ceiling */
      sendMax: string;
      destAsset?: ClassicAsset;
      destAmount: string;
    }
  | {
      type: "manage-sell-offer";
      selling?: ClassicAsset;
      buying?: ClassicAsset;
      amount: string;
      /** buying units per selling unit; "0" with an offerId deletes */
      price: string;
      /** "0" creates a new offer */
      offerId?: string;
    }
  | {
      type: "create-claimable-balance";
      asset?: ClassicAsset;
      amount: string;
      claimant: string;
      /** seconds from now before the claimant may take it; omit = immediately */
      unlockAfterSeconds?: string;
    }
  | { type: "claim-claimable-balance"; balanceId: string }
  | {
      type: "set-options";
      /** add or re-weight a signer; weight "0" removes it */
      signer?: string;
      signerWeight?: string;
      masterWeight?: string;
      lowThreshold?: string;
      medThreshold?: string;
      highThreshold?: string;
      homeDomain?: string;
    }
  | {
      type: "manage-data";
      name: string;
      /** omit to delete the entry */
      value?: string;
    }
  | { type: "bump-sequence"; bumpTo: string }
  | { type: "account-merge"; destination: string }
  | { type: "begin-sponsoring-future-reserves"; sponsoredId: string }
  | { type: "end-sponsoring-future-reserves" };

function toAsset(asset?: { code: string; issuer: string }): Asset {
  return asset ? new Asset(asset.code, asset.issuer) : Asset.native();
}

/**
 * Claimable-balance predicate. Unconditional unless a delay is given, in which
 * case it becomes "not before N seconds from now" — the shape a timed vault
 * needs, and the only predicate the workbench exposes.
 */
function toClaimants(claimant: string, unlockAfterSeconds?: string): Claimant[] {
  const delay = Number(unlockAfterSeconds ?? "");
  const predicate =
    Number.isFinite(delay) && delay > 0
      ? Claimant.predicateNot(Claimant.predicateBeforeRelativeTime(String(Math.trunc(delay))))
      : Claimant.predicateUnconditional();
  return [new Claimant(claimant, predicate)];
}

function toOperation(spec: ClassicOpSpec): xdr.Operation {
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
    case "path-payment-strict-send":
      return Operation.pathPaymentStrictSend({
        sendAsset: toAsset(spec.sendAsset),
        sendAmount: spec.sendAmount,
        destination: spec.destination,
        destAsset: toAsset(spec.destAsset),
        destMin: spec.destMin,
        path: [],
      });
    case "path-payment-strict-receive":
      return Operation.pathPaymentStrictReceive({
        sendAsset: toAsset(spec.sendAsset),
        sendMax: spec.sendMax,
        destination: spec.destination,
        destAsset: toAsset(spec.destAsset),
        destAmount: spec.destAmount,
        path: [],
      });
    case "manage-sell-offer":
      return Operation.manageSellOffer({
        selling: toAsset(spec.selling),
        buying: toAsset(spec.buying),
        amount: spec.amount,
        price: spec.price,
        offerId: spec.offerId ?? "0",
      });
    case "create-claimable-balance":
      return Operation.createClaimableBalance({
        asset: toAsset(spec.asset),
        amount: spec.amount,
        claimants: toClaimants(spec.claimant, spec.unlockAfterSeconds),
      });
    case "claim-claimable-balance":
      return Operation.claimClaimableBalance({ balanceId: spec.balanceId });
    case "set-options":
      return Operation.setOptions({
        ...(spec.signer
          ? {
              signer: {
                ed25519PublicKey: spec.signer,
                weight: Number(spec.signerWeight ?? "1"),
              },
            }
          : {}),
        ...(spec.masterWeight ? { masterWeight: Number(spec.masterWeight) } : {}),
        ...(spec.lowThreshold ? { lowThreshold: Number(spec.lowThreshold) } : {}),
        ...(spec.medThreshold ? { medThreshold: Number(spec.medThreshold) } : {}),
        ...(spec.highThreshold ? { highThreshold: Number(spec.highThreshold) } : {}),
        ...(spec.homeDomain ? { homeDomain: spec.homeDomain } : {}),
      });
    case "manage-data":
      return Operation.manageData({
        name: spec.name,
        value: spec.value === undefined || spec.value === "" ? null : spec.value,
      });
    case "bump-sequence":
      return Operation.bumpSequence({ bumpTo: spec.bumpTo });
    case "account-merge":
      return Operation.accountMerge({ destination: spec.destination });
    case "begin-sponsoring-future-reserves":
      return Operation.beginSponsoringFutureReserves({
        sponsoredId: spec.sponsoredId,
      });
    case "end-sponsoring-future-reserves":
      return Operation.endSponsoringFutureReserves();
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
export const RESULT_CODE_HINTS: Record<string, string> = {
  op_underfunded: "not enough XLM to send that amount",
  op_no_destination: "the destination account does not exist yet",
  op_no_trust: "the destination has no trustline for this asset",
  op_low_reserve: "balance would drop below the base reserve",
  op_line_full: "the destination's trustline limit is full",
  tx_bad_seq: "sequence number out of date — rebuild and retry",
  tx_insufficient_fee: "network fee too low right now — retry",
  op_already_exists: "that account already exists",
  op_malformed: "one of the operation's fields is malformed",
  op_bad_auth: "the transaction is missing a required signature",
  op_no_issuer: "the asset's issuer account does not exist",
  op_cross_self: "that offer would trade against your own offer",
  op_does_not_exist: "no claimable balance with that id",
  op_not_authorized: "the claimant is not authorized for this balance",
  op_bad_signer: "invalid signer for set_options",
  op_threshold_out_of_range: "a threshold must be between 0 and 255",
  op_has_sub_entries: "the account still owns trustlines or offers",
  op_immutable_set: "the account is flagged immutable",
  tx_too_late: "the transaction time bounds expired — rebuild and retry",
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
