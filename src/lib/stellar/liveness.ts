"use client";

import { Contract, rpc, xdr } from "@stellar/stellar-sdk";
import { TESTNET } from "./network";

// How long a deployed contract has left before it is archived — read from
// the chain, never written down. A hard-coded archive date goes stale the
// moment anyone extends the TTL, which is exactly what happened to the SPP
// preview: its date passed while the contracts stayed live.
//
// A contract is two ledger entries with two TTLs: the instance (which also
// holds instance storage) and its Wasm code. The earlier one is what matters.
// Persistent entries keep their own TTLs and are not covered here.
//
// Since Protocol 23 an archived entry is still returned by getLedgerEntries
// (liveUntilLedgerSeq 0), and a transaction that needs it restores it first
// when simulation puts it on the restore list. Archived is a fee, not a dead
// end — see the restore-only branch in invoke.ts.

/** ~5 s per ledger: the docs' 3,110,400 ledgers ≈ 180 days. */
export const SECONDS_PER_LEDGER = 5;

/**
 * Warn this far ahead: 3 days. It has to sit well under testnet's minimum
 * persistent TTL (~7 days), or every freshly deployed contract — which gets
 * exactly that minimum — would carry the warning from its first second.
 */
const WARN_WITHIN_LEDGERS = (3 * 24 * 60 * 60) / SECONDS_PER_LEDGER;

export interface ContractLiveness {
  latestLedger: number;
  /** earlier of the instance's and its Wasm code's liveUntilLedgerSeq */
  liveUntilLedger: number;
  archived: boolean;
  /**
   * Rough moment liveUntilLedger closes, from the latest ledger's close time.
   * Meaningless once archived: the RPC then reports liveUntilLedger as 0.
   */
  approxArchiveAt: Date;
}

/** null when the instance entry does not exist (wrong id, other network). */
export async function fetchContractLiveness(
  contractId: string,
): Promise<ContractLiveness | null> {
  const server = new rpc.Server(TESTNET.rpcUrl);
  const [latest, found] = await Promise.all([
    server.getLatestLedger(),
    server.getLedgerEntries(new Contract(contractId).getFootprint()),
  ]);
  const instance = found.entries[0];
  if (!instance) return null;

  const lives = [instance.liveUntilLedgerSeq ?? 0];
  const wasmHash = await instanceWasmHash(server, instance.val);
  if (wasmHash) {
    const code = await server.getLedgerEntries(
      xdr.LedgerKey.contractCode(new xdr.LedgerKeyContractCode({ hash: wasmHash })),
    );
    const codeLive = code.entries[0]?.liveUntilLedgerSeq;
    if (codeLive !== undefined) lives.push(codeLive);
  }

  // Measure against the snapshot the entries came from, not a second call
  // that a load-balanced RPC may answer a ledger later.
  const at = found.latestLedger;
  const liveUntilLedger = Math.min(...lives);
  const closedAt = Number(latest.closeTime) * 1000 || Date.now();
  return {
    latestLedger: at,
    liveUntilLedger,
    // Live THROUGH liveUntilLedger, and the next transaction lands at
    // at + 1 at the earliest — so equal already means "needs a restore".
    // The RPC reports 0 once the entry has been archived.
    archived: liveUntilLedger <= at,
    approxArchiveAt: new Date(
      closedAt + (liveUntilLedger - at) * SECONDS_PER_LEDGER * 1000,
    ),
  };
}

/** Archived, archiving within 3 days, or nothing worth saying. */
export function archiveStatus(
  liveness: ContractLiveness,
): "archived" | "soon" | "live" {
  if (liveness.archived) return "archived";
  return liveness.liveUntilLedger - liveness.latestLedger <= WARN_WITHIN_LEDGERS
    ? "soon"
    : "live";
}

/** The Wasm a contract instance runs, or null for a Stellar Asset Contract. */
async function instanceWasmHash(
  server: rpc.Server,
  data: xdr.LedgerEntryData,
): Promise<xdr.Hash | Uint8Array | null> {
  const val = data.type === "contractData" ? data.contractData.val : null;
  if (val?.type !== "scvContractInstance") return null;
  const exe = val.instance.executable;
  if (exe.type === "contractExecutableWasm") return exe.wasmHash;
  if (exe.type === "contractExecutableExternalRef") {
    // The Wasm lives behind another contract's entry; if that lookup fails
    // the instance TTL alone still tells most of the story.
    return server.getExternalRefWasmHash(exe.externalRef).catch(() => null);
  }
  return null;
}
