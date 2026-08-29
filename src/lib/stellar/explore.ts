"use client";

// The Scryer: a read-only window onto the two APIs the Forge already talks to.
//
// Every query is a descriptor whose parameters are `SpecField[]` — the same
// shape ops.ts and spec-form.ts use — so `SpecArgsFields` renders these forms
// too. And every one of them goes through an SDK call builder rather than a
// hand-rolled fetch, which is why this file adds no HTTP code and no
// dependency: `rpc.Server` and `Horizon.Server` already ship everything here.

import { Asset, Horizon, rpc } from "@stellar/stellar-sdk";
import { TESTNET } from "./network";
import { parseAssetValue } from "./ops";
import type { SpecField } from "./spec-form";

export type ExploreSource = "rpc" | "horizon";

/**
 * Spelled out rather than inferred so the message catalogs are checked against
 * it: `m.ide.explorer.list` is consumed as Record<ExploreQueryId, …>, which
 * makes a query without a label a compile error in all four locales.
 */
export type ExploreQueryId =
  | "rpc-health"
  | "rpc-network"
  | "rpc-latest-ledger"
  | "rpc-fee-stats"
  | "rpc-version"
  | "rpc-transaction"
  | "rpc-events"
  | "account"
  | "transactions"
  | "operations"
  | "payments"
  | "effects"
  | "offers"
  | "claimable-balances"
  | "orderbook"
  | "trades"
  | "liquidity-pools"
  | "assets"
  | "ledgers"
  | "strict-send-paths"
  | "strict-receive-paths";

export interface ExploreQuery {
  id: ExploreQueryId;
  source: ExploreSource;
  fields: SpecField[];
  run(values: Record<string, string>): Promise<unknown>;
}

// ── field helpers ─────────────────────────────────────────────────────
type Extra = { optional?: boolean; help?: string };
const address = (name: string, x: Extra = {}): SpecField => ({
  name, typeLabel: "address", kind: "address", placeholder: "G…", ...x,
});
const text = (name: string, placeholder: string, x: Extra = {}): SpecField => ({
  name, typeLabel: "string", kind: "text", placeholder, ...x,
});
const asset = (name: string, x: Extra = {}): SpecField => ({
  name, typeLabel: "asset", kind: "asset", placeholder: "native", ...x,
});
const amount = (name: string, x: Extra = {}): SpecField => ({
  name, typeLabel: "amount", kind: "amount", placeholder: "0.0000000", ...x,
});
const limit = (): SpecField => ({
  name: "limit", typeLabel: "u32", kind: "number", placeholder: "10",
  optional: true,
});

// ── value helpers ─────────────────────────────────────────────────────
const horizonServer = () => new Horizon.Server(TESTNET.horizonUrl);
const rpcServer = () => new rpc.Server(TESTNET.rpcUrl);

function req(v: Record<string, string>, name: string): string {
  const value = (v[name] ?? "").trim();
  if (value === "") throw new Error(`${name}: required`);
  return value;
}

function num(v: Record<string, string>, name: string, fallback: number): number {
  const raw = (v[name] ?? "").trim();
  const parsed = Number(raw);
  return raw !== "" && Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function toAsset(raw: string | undefined): Asset {
  const parsed = parseAssetValue(raw);
  return parsed ? new Asset(parsed.code, parsed.issuer) : Asset.native();
}

/** Horizon pages carry link/next plumbing that only clutters the tree. */
function records(page: { records: unknown[] }): unknown {
  return page.records;
}

export const EXPLORE_QUERIES: ExploreQuery[] = [
  // ── RPC ─────────────────────────────────────────────────────────────
  { id: "rpc-health", source: "rpc", fields: [], run: () => rpcServer().getHealth() },
  { id: "rpc-network", source: "rpc", fields: [], run: () => rpcServer().getNetwork() },
  {
    id: "rpc-latest-ledger",
    source: "rpc",
    fields: [],
    run: () => rpcServer().getLatestLedger(),
  },
  { id: "rpc-fee-stats", source: "rpc", fields: [], run: () => rpcServer().getFeeStats() },
  {
    id: "rpc-version",
    source: "rpc",
    fields: [],
    run: () => rpcServer().getVersionInfo(),
  },
  {
    id: "rpc-transaction",
    source: "rpc",
    fields: [text("hash", "64 hex characters")],
    run: (v) => rpcServer().getTransaction(req(v, "hash")),
  },
  {
    id: "rpc-events",
    source: "rpc",
    fields: [
      text("contractId", "C…", { optional: true }),
      { name: "ledgersBack", typeLabel: "u32", kind: "number", placeholder: "1000",
        optional: true, help: "how far back to start the window" },
      limit(),
    ],
    // The RPC only keeps a rolling window of events, so the start ledger has
    // to be derived from the head rather than assumed.
    run: async (v) => {
      const server = rpcServer();
      const { sequence } = await server.getLatestLedger();
      const back = num(v, "ledgersBack", 1000);
      const contractId = (v.contractId ?? "").trim();
      return server.getEvents({
        startLedger: Math.max(sequence - back, 1),
        filters: contractId ? [{ contractIds: [contractId] }] : [],
        limit: num(v, "limit", 10),
      });
    },
  },

  // ── Horizon ─────────────────────────────────────────────────────────
  {
    id: "account",
    source: "horizon",
    fields: [address("address")],
    run: (v) => horizonServer().loadAccount(req(v, "address")),
  },
  {
    id: "transactions",
    source: "horizon",
    fields: [address("address"), limit()],
    run: async (v) =>
      records(
        await horizonServer()
          .transactions()
          .forAccount(req(v, "address"))
          .order("desc")
          .limit(num(v, "limit", 10))
          .call(),
      ),
  },
  {
    id: "operations",
    source: "horizon",
    fields: [address("address"), limit()],
    run: async (v) =>
      records(
        await horizonServer()
          .operations()
          .forAccount(req(v, "address"))
          .order("desc")
          .limit(num(v, "limit", 10))
          .call(),
      ),
  },
  {
    id: "payments",
    source: "horizon",
    fields: [address("address"), limit()],
    run: async (v) =>
      records(
        await horizonServer()
          .payments()
          .forAccount(req(v, "address"))
          .order("desc")
          .limit(num(v, "limit", 10))
          .call(),
      ),
  },
  {
    id: "effects",
    source: "horizon",
    fields: [address("address"), limit()],
    run: async (v) =>
      records(
        await horizonServer()
          .effects()
          .forAccount(req(v, "address"))
          .order("desc")
          .limit(num(v, "limit", 10))
          .call(),
      ),
  },
  {
    id: "offers",
    source: "horizon",
    fields: [address("address"), limit()],
    run: async (v) =>
      records(
        await horizonServer()
          .offers()
          .forAccount(req(v, "address"))
          .limit(num(v, "limit", 10))
          .call(),
      ),
  },
  {
    id: "claimable-balances",
    source: "horizon",
    fields: [address("claimant"), limit()],
    run: async (v) =>
      records(
        await horizonServer()
          .claimableBalances()
          .claimant(req(v, "claimant"))
          .limit(num(v, "limit", 10))
          .call(),
      ),
  },
  {
    id: "orderbook",
    source: "horizon",
    fields: [asset("selling", { optional: true }), asset("buying")],
    run: (v) => horizonServer().orderbook(toAsset(v.selling), toAsset(v.buying)).call(),
  },
  {
    id: "trades",
    source: "horizon",
    fields: [limit()],
    run: async (v) =>
      records(
        await horizonServer().trades().order("desc").limit(num(v, "limit", 10)).call(),
      ),
  },
  {
    id: "liquidity-pools",
    source: "horizon",
    fields: [limit()],
    run: async (v) =>
      records(await horizonServer().liquidityPools().limit(num(v, "limit", 10)).call()),
  },
  {
    id: "assets",
    source: "horizon",
    fields: [text("code", "USDC", { optional: true }), limit()],
    run: async (v) => {
      const builder = horizonServer().assets();
      const code = (v.code ?? "").trim();
      if (code) builder.forCode(code);
      return records(await builder.limit(num(v, "limit", 10)).call());
    },
  },
  {
    id: "ledgers",
    source: "horizon",
    fields: [limit()],
    run: async (v) =>
      records(
        await horizonServer().ledgers().order("desc").limit(num(v, "limit", 5)).call(),
      ),
  },
  {
    id: "strict-send-paths",
    source: "horizon",
    fields: [
      asset("sourceAsset", { optional: true }),
      amount("sourceAmount"),
      address("destination"),
    ],
    run: async (v) =>
      records(
        await horizonServer()
          .strictSendPaths(
            toAsset(v.sourceAsset),
            req(v, "sourceAmount"),
            req(v, "destination"),
          )
          .call(),
      ),
  },
  {
    id: "strict-receive-paths",
    source: "horizon",
    fields: [
      address("source"),
      asset("destAsset"),
      amount("destAmount"),
    ],
    run: async (v) =>
      records(
        await horizonServer()
          .strictReceivePaths(
            req(v, "source"),
            toAsset(req(v, "destAsset")),
            req(v, "destAmount"),
          )
          .call(),
      ),
  },
];

export function exploreQueryById(id: ExploreQueryId): ExploreQuery | undefined {
  return EXPLORE_QUERIES.find((q) => q.id === id);
}
