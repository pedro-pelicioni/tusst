"use client";

// The Anvil's operation catalog: one descriptor per classic Stellar operation,
// each describing its form as `SpecField[]` — the SAME shape `spec-form.ts`
// already produces for contract functions. That is the whole trick: the
// workbench needs no second form layer, because `SpecArgsFields` renders these
// unchanged.
//
// Order here is display order, and it is didactic rather than alphabetical:
// move value, then open trust, then trade it, then lock it, then govern the
// account, then the plumbing.

import type { ClassicAsset, ClassicOpSpec } from "./classic";
import type { SpecField } from "./spec-form";

export interface ClassicOpDescriptor {
  /** doubles as the i18n key under m.ide.ops.list */
  type: ClassicOpSpec["type"];
  fields: SpecField[];
  build(values: Record<string, string>): ClassicOpSpec;
}

// ── field constructors ────────────────────────────────────────────────
type Extra = { optional?: boolean; help?: string };

const address = (name: string, x: Extra = {}): SpecField => ({
  name,
  typeLabel: "address",
  kind: "address",
  placeholder: "G…",
  ...x,
});
const amount = (name: string, x: Extra = {}): SpecField => ({
  name,
  typeLabel: "amount",
  kind: "amount",
  placeholder: "0.0000000",
  ...x,
});
const asset = (name: string, x: Extra = {}): SpecField => ({
  name,
  typeLabel: "asset",
  kind: "asset",
  placeholder: "native",
  ...x,
});
const text = (name: string, placeholder: string, x: Extra = {}): SpecField => ({
  name,
  typeLabel: "string",
  kind: "text",
  placeholder,
  ...x,
});
const count = (name: string, placeholder: string, x: Extra = {}): SpecField => ({
  name,
  typeLabel: "u32",
  kind: "number",
  placeholder,
  ...x,
});

// ── value coercion ────────────────────────────────────────────────────

/** An asset field carries one string: "native" (or empty) or "CODE:ISSUER". */
export function parseAssetValue(raw: string | undefined): ClassicAsset | undefined {
  const value = (raw ?? "").trim();
  if (value === "" || value === "native") return undefined;
  const [code, issuer] = value.split(":");
  if (!code || !issuer) {
    throw new Error(`asset must be "native" or "CODE:ISSUER" (got "${value}")`);
  }
  return { code: code.trim(), issuer: issuer.trim() };
}

/** Empty means "leave it out" for every optional classic field. */
function opt(values: Record<string, string>, name: string): string | undefined {
  const value = (values[name] ?? "").trim();
  return value === "" ? undefined : value;
}

function req(values: Record<string, string>, name: string): string {
  const value = (values[name] ?? "").trim();
  if (value === "") throw new Error(`${name}: required`);
  return value;
}

// ── the catalog ───────────────────────────────────────────────────────

export const CLASSIC_OPS: ClassicOpDescriptor[] = [
  {
    type: "payment",
    fields: [
      address("destination"),
      amount("amount"),
      asset("asset", { optional: true }),
    ],
    build: (v) => ({
      type: "payment",
      destination: req(v, "destination"),
      amount: req(v, "amount"),
      asset: parseAssetValue(v.asset),
    }),
  },
  {
    type: "create-account",
    fields: [
      address("destination"),
      amount("startingBalance", { help: "at least the base reserve" }),
    ],
    build: (v) => ({
      type: "create-account",
      destination: req(v, "destination"),
      startingBalance: req(v, "startingBalance"),
    }),
  },
  {
    type: "change-trust",
    fields: [
      asset("asset"),
      amount("limit", { optional: true, help: '"0" removes the trustline' }),
    ],
    build: (v) => {
      const parsed = parseAssetValue(req(v, "asset"));
      if (!parsed) throw new Error("asset: a trustline needs an issued asset");
      return { type: "change-trust", asset: parsed, limit: opt(v, "limit") };
    },
  },
  {
    type: "path-payment-strict-send",
    fields: [
      address("destination"),
      asset("sendAsset", { optional: true }),
      amount("sendAmount"),
      asset("destAsset", { optional: true }),
      amount("destMin", { help: "the least the destination will accept" }),
    ],
    build: (v) => ({
      type: "path-payment-strict-send",
      destination: req(v, "destination"),
      sendAsset: parseAssetValue(v.sendAsset),
      sendAmount: req(v, "sendAmount"),
      destAsset: parseAssetValue(v.destAsset),
      destMin: req(v, "destMin"),
    }),
  },
  {
    type: "path-payment-strict-receive",
    fields: [
      address("destination"),
      asset("sendAsset", { optional: true }),
      amount("sendMax", { help: "the most you will part with" }),
      asset("destAsset", { optional: true }),
      amount("destAmount"),
    ],
    build: (v) => ({
      type: "path-payment-strict-receive",
      destination: req(v, "destination"),
      sendAsset: parseAssetValue(v.sendAsset),
      sendMax: req(v, "sendMax"),
      destAsset: parseAssetValue(v.destAsset),
      destAmount: req(v, "destAmount"),
    }),
  },
  {
    type: "manage-sell-offer",
    fields: [
      asset("selling", { optional: true }),
      asset("buying", { optional: true }),
      amount("amount", { help: '"0" cancels an existing offer' }),
      text("price", "1.0", { help: "buying units per selling unit" }),
      text("offerId", "0", { optional: true, help: '"0" creates a new offer' }),
    ],
    build: (v) => ({
      type: "manage-sell-offer",
      selling: parseAssetValue(v.selling),
      buying: parseAssetValue(v.buying),
      amount: req(v, "amount"),
      price: req(v, "price"),
      offerId: opt(v, "offerId"),
    }),
  },
  {
    type: "create-claimable-balance",
    fields: [
      asset("asset", { optional: true }),
      amount("amount"),
      address("claimant"),
      count("unlockAfterSeconds", "0", {
        optional: true,
        help: "seconds before the claimant may take it",
      }),
    ],
    build: (v) => ({
      type: "create-claimable-balance",
      asset: parseAssetValue(v.asset),
      amount: req(v, "amount"),
      claimant: req(v, "claimant"),
      unlockAfterSeconds: opt(v, "unlockAfterSeconds"),
    }),
  },
  {
    type: "claim-claimable-balance",
    fields: [text("balanceId", "00000000…", { help: "the 72-hex balance id" })],
    build: (v) => ({
      type: "claim-claimable-balance",
      balanceId: req(v, "balanceId"),
    }),
  },
  {
    type: "set-options",
    fields: [
      address("signer", { optional: true, help: "add or re-weight a signer" }),
      count("signerWeight", "1", { optional: true, help: '"0" removes the signer' }),
      count("masterWeight", "1", { optional: true }),
      count("lowThreshold", "0", { optional: true }),
      count("medThreshold", "0", { optional: true }),
      count("highThreshold", "0", { optional: true }),
      text("homeDomain", "example.com", { optional: true }),
    ],
    build: (v) => ({
      type: "set-options",
      signer: opt(v, "signer"),
      signerWeight: opt(v, "signerWeight"),
      masterWeight: opt(v, "masterWeight"),
      lowThreshold: opt(v, "lowThreshold"),
      medThreshold: opt(v, "medThreshold"),
      highThreshold: opt(v, "highThreshold"),
      homeDomain: opt(v, "homeDomain"),
    }),
  },
  {
    type: "manage-data",
    fields: [
      text("name", "my-key"),
      text("value", "my-value", { optional: true, help: "empty deletes the entry" }),
    ],
    build: (v) => ({
      type: "manage-data",
      name: req(v, "name"),
      value: opt(v, "value"),
    }),
  },
  {
    type: "begin-sponsoring-future-reserves",
    fields: [
      address("sponsoredId", {
        help: "queue the sponsored op next, then end-sponsoring",
      }),
    ],
    build: (v) => ({
      type: "begin-sponsoring-future-reserves",
      sponsoredId: req(v, "sponsoredId"),
    }),
  },
  {
    type: "end-sponsoring-future-reserves",
    fields: [],
    build: () => ({ type: "end-sponsoring-future-reserves" }),
  },
  {
    type: "bump-sequence",
    fields: [text("bumpTo", "0", { help: "the sequence number to jump to" })],
    build: (v) => ({ type: "bump-sequence", bumpTo: req(v, "bumpTo") }),
  },
  {
    type: "account-merge",
    fields: [
      address("destination", { help: "closes this account and sweeps its XLM" }),
    ],
    build: (v) => ({ type: "account-merge", destination: req(v, "destination") }),
  },
];

export function descriptorFor(
  type: ClassicOpSpec["type"],
): ClassicOpDescriptor | undefined {
  return CLASSIC_OPS.find((op) => op.type === type);
}
