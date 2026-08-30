"use client";

import {
  Account,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  contract,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";
import { TESTNET } from "./network";
import { submitAndConfirm } from "./deploy";
import type { ForgeWallet } from "./wallet";

// Point-and-click invocation of deployed contracts. Read vs write is decided
// by SIMULATION, not a UI toggle: every call is simulated first; when the
// simulation needs no auth and touches no write footprint, the decoded result
// returns immediately without signing. Otherwise the transaction is
// assembled, signed by the wallet and submitted.
//
// A simulation needs a source account to hang the transaction on, but for a
// read it never spends, never signs and is never submitted — so the account
// does not have to exist. Passing no wallet substitutes the all-zero account
// below, which makes reading a public contract genuinely anonymous: no
// connection, no funding, no extension prompt. Writes still require a real
// wallet, and simulation is what decides which of the two you attempted.

export interface InvokeOutcome {
  readOnly: boolean;
  result: unknown;
  txHash?: string;
}

/**
 * The all-zero ed25519 account. It has never been funded and never will be;
 * it exists so an unauthenticated read has a syntactically valid source.
 */
const ANONYMOUS_SOURCE =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

/** Thrown when a call turns out to change state and no wallet is connected. */
export class WalletRequiredError extends Error {
  constructor() {
    super("this call changes state — connect a wallet to sign it");
    this.name = "WalletRequiredError";
  }
}

/**
 * Fetch a deployed contract's spec from the chain (works for any contract).
 * No account needed — the SDK falls back to a null account for spec loading,
 * so anonymous exploration works; a publicKey only matters for invocations.
 */
export async function fetchContractSpec(
  contractId: string,
  publicKey?: string,
): Promise<contract.Spec> {
  const client = await contract.Client.from({
    contractId,
    rpcUrl: TESTNET.rpcUrl,
    networkPassphrase: TESTNET.passphrase,
    publicKey,
  });
  return client.spec;
}

export async function invokeFunction({
  contractId,
  spec,
  fnName,
  args,
  wallet,
}: {
  contractId: string;
  spec: contract.Spec;
  fnName: string;
  args: xdr.ScVal[];
  wallet: ForgeWallet | null;
}): Promise<InvokeOutcome> {
  const server = new rpc.Server(TESTNET.rpcUrl);
  // Only a real wallet needs its account loaded; the anonymous source is
  // synthesised locally, which also means a read costs one RPC round trip
  // instead of two.
  const account = wallet
    ? await server.getAccount(wallet.address)
    : new Account(ANONYMOUS_SOURCE, "0");
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET.passphrase,
  })
    .addOperation(new Contract(contractId).call(fnName, ...args))
    .setTimeout(120)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error.slice(0, 400));
  }
  const success = sim as rpc.Api.SimulateTransactionSuccessResponse;

  const authCount = success.result?.auth?.length ?? 0;
  const writes = success.transactionData.build().resources.footprint.readWrite
    .length;

  if (authCount === 0 && writes === 0) {
    const retval = success.result?.retval;
    return {
      readOnly: true,
      result: retval ? spec.funcResToNative(fnName, retval) : null,
    };
  }

  // Simulation says this one writes. Without a wallet there is nothing to
  // sign with, and the caller gets a specific error rather than a crash.
  if (!wallet) throw new WalletRequiredError();

  const prepared = rpc.assembleTransaction(tx, success).build();
  const signed = await wallet.signTransaction(prepared.toXDR());
  const confirmed = await submitAndConfirm(server, signed);
  return {
    readOnly: false,
    txHash: confirmed.txHash,
    result: confirmed.returnValue
      ? spec.funcResToNative(fnName, confirmed.returnValue)
      : null,
  };
}

/**
 * A contract returning Rust's `Result<T, E>` decodes to an Ok/Err wrapper
 * rather than to the value, so a function answering `2` renders as
 * `{"value": 2}` and a Merkle root renders as an object around a string.
 * Unwrap first, or every read of such a contract reads as a bug.
 */
function unwrapResult(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  const wrapper = value as { unwrap?: unknown };
  if (typeof wrapper.unwrap !== "function") return value;
  try {
    return (wrapper.unwrap as () => unknown)();
  } catch (e) {
    // Err throws on unwrap; the thrown value is the contract's own error.
    return e instanceof Error ? `contract error: ${e.message}` : value;
  }
}

/** JSON.stringify that survives BigInt/Buffer values in decoded results. */
export function displayResult(raw: unknown): string {
  const value = unwrapResult(raw);
  if (value === null || value === undefined) return "ok (void)";
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "string") return value;
  return JSON.stringify(
    value,
    (_k, v) => {
      if (typeof v === "bigint") return v.toString();
      if (v instanceof Uint8Array) return Buffer.from(v).toString("hex");
      return v;
    },
    1,
  );
}
