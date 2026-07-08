"use client";

import { Buffer } from "buffer";
import {
  Address,
  BASE_FEE,
  Operation,
  TransactionBuilder,
  contract,
  hash,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { TESTNET } from "./network";
import type { ForgeWallet } from "./wallet";

// Non-custodial testnet deploy: two sequential transactions built with the
// js-stellar-sdk, each simulated (prepareTransaction), signed by the user's
// wallet in the browser, submitted via RPC and polled to completion.
//   1. upload the wasm blob            → wasm hash
//   2. create the contract instance    → contract id (C…)

export type DeployStep =
  | "upload-sign"
  | "upload-confirm"
  | "create-sign"
  | "create-confirm";

export interface DeployResult {
  contractId: string;
  wasmHash: string;
  uploadTx: string;
  createTx: string;
}

const POLL_INTERVAL_MS = 1_500;
const POLL_ATTEMPTS = 40;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitAndConfirm(
  server: rpc.Server,
  signedXdr: string,
): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  const tx = TransactionBuilder.fromXDR(signedXdr, TESTNET.passphrase);
  const sent = await server.sendTransaction(tx);
  if (sent.status === "ERROR" || sent.status === "DUPLICATE") {
    throw new Error(`transaction rejected by the network (${sent.status})`);
  }
  for (let i = 0; i < POLL_ATTEMPTS; i++) {
    await sleep(POLL_INTERVAL_MS);
    const got = await server.getTransaction(sent.hash);
    if (got.status === rpc.Api.GetTransactionStatus.SUCCESS) return got;
    if (got.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error("transaction failed on-chain");
    }
  }
  throw new Error("timed out waiting for confirmation");
}

/** Parse the constructor spec (if any) from the compiled wasm, pre-deploy. */
export function constructorSpecFromWasm(
  wasm: Uint8Array,
): { spec: contract.Spec; func: xdr.ScSpecFunctionV0 | null } {
  const spec = contract.Spec.fromWasm(Buffer.from(wasm));
  let func: xdr.ScSpecFunctionV0 | null = null;
  try {
    func = spec.getFunc("__constructor");
  } catch {
    func = null;
  }
  return { spec, func };
}

export async function deployContract({
  wasm,
  wallet,
  constructorArgs,
  onStep,
}: {
  wasm: Uint8Array;
  wallet: ForgeWallet;
  /** ScVals in declaration order (already converted via the contract spec). */
  constructorArgs: xdr.ScVal[];
  onStep: (step: DeployStep) => void;
}): Promise<DeployResult> {
  const server = new rpc.Server(TESTNET.rpcUrl);
  const wasmBuffer = Buffer.from(wasm);

  // 1 — upload the code blob.
  onStep("upload-sign");
  const account = await server.getAccount(wallet.address);
  const uploadTx = await server.prepareTransaction(
    new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: TESTNET.passphrase,
    })
      .addOperation(Operation.uploadContractWasm({ wasm: wasmBuffer }))
      .setTimeout(120)
      .build(),
  );
  const uploadSigned = await wallet.signTransaction(uploadTx.toXDR());
  onStep("upload-confirm");
  const uploadRes = await submitAndConfirm(server, uploadSigned);
  const wasmHash: Buffer = uploadRes.returnValue
    ? (scValToNative(uploadRes.returnValue) as Buffer)
    : hash(wasmBuffer);

  // 2 — instantiate the contract from the uploaded code.
  onStep("create-sign");
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const account2 = await server.getAccount(wallet.address);
  const createTx = await server.prepareTransaction(
    new TransactionBuilder(account2, {
      fee: BASE_FEE,
      networkPassphrase: TESTNET.passphrase,
    })
      .addOperation(
        Operation.createCustomContract({
          address: new Address(wallet.address),
          wasmHash,
          salt: Buffer.from(salt),
          constructorArgs,
        }),
      )
      .setTimeout(120)
      .build(),
  );
  const createSigned = await wallet.signTransaction(createTx.toXDR());
  onStep("create-confirm");
  const createRes = await submitAndConfirm(server, createSigned);
  if (!createRes.returnValue) {
    throw new Error("deploy confirmed but no contract address was returned");
  }
  const contractId = Address.fromScVal(createRes.returnValue).toString();

  return {
    contractId,
    wasmHash: wasmHash.toString("hex"),
    uploadTx: uploadRes.txHash,
    createTx: createRes.txHash,
  };
}
