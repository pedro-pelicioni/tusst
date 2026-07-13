"use client";

import {
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

export interface InvokeOutcome {
  readOnly: boolean;
  result: unknown;
  txHash?: string;
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
  wallet: ForgeWallet;
}): Promise<InvokeOutcome> {
  const server = new rpc.Server(TESTNET.rpcUrl);
  const account = await server.getAccount(wallet.address);
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
  const writes = success.transactionData
    .build()
    .resources()
    .footprint()
    .readWrite().length;

  if (authCount === 0 && writes === 0) {
    const retval = success.result?.retval;
    return {
      readOnly: true,
      result: retval ? spec.funcResToNative(fnName, retval) : null,
    };
  }

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

/** JSON.stringify that survives BigInt/Buffer values in decoded results. */
export function displayResult(value: unknown): string {
  if (value === null || value === undefined) return "ok (void)";
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
