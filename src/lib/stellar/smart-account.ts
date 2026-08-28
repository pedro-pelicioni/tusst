"use client";

// Browser-only seam around smart-account-kit. The Forge's funded local G
// account is a dedicated deployer: it pays the testnet deployment fee but is
// never installed as a signer on the resulting smart account. Passkey
// credentials and sessions stay in IndexedDB; neither crosses our server.

import { Buffer } from "buffer";
import { rpc } from "@stellar/stellar-sdk";
import { TESTNET } from "./network";

const STORAGE_NAME = "tusst-smart-accounts-v1";

export interface PasskeyNetworkConfig {
  accountWasmHash: string;
  webauthnVerifierAddress: string;
  nativeTokenContract: string;
}

function assertWebAuthn(): void {
  if (!window.isSecureContext || !("PublicKeyCredential" in window)) {
    throw new Error("passkey-unavailable");
  }
}

let kitModule: Promise<typeof import("smart-account-kit")> | null = null;

async function loadSmartAccountKit() {
  // smart-account-kit@0.6.2 is browser-first but still reads the Node Buffer
  // global during module initialization. Install the browser polyfill before
  // the dynamic import evaluates any of its top-level constants.
  const globals = globalThis as typeof globalThis & {
    Buffer?: typeof Buffer;
  };
  globals.Buffer ??= Buffer;
  kitModule ??= import("smart-account-kit");
  return kitModule;
}

async function createKit(config: PasskeyNetworkConfig, deployerSecret: string) {
  const { IndexedDBStorage, SmartAccountKit } = await loadSmartAccountKit();
  return new SmartAccountKit({
    rpcUrl: TESTNET.rpcUrl,
    networkPassphrase: TESTNET.passphrase,
    accountWasmHash: config.accountWasmHash,
    acceptedWasmHashes: [config.accountWasmHash],
    webauthnVerifierAddress: config.webauthnVerifierAddress,
    deployerSecret,
    storage: new IndexedDBStorage(STORAGE_NAME),
    // The lab reconnects from its own stored credential and contract id. It
    // needs no third-party reverse indexer in the critical path.
    indexerUrl: false,
    rpName: "TUSST Forge",
  });
}

export async function createPasskeyWallet(input: {
  deployerSecret: string;
  appName: string;
  userName: string;
  config: PasskeyNetworkConfig;
}): Promise<{ contractId: string; credentialId: string; txHash: string }> {
  assertWebAuthn();
  const kit = await createKit(input.config, input.deployerSecret);
  const result = await kit.createWallet(input.appName, input.userName, {
    autoSubmit: true,
    autoFund: true,
    nativeTokenContract: input.config.nativeTokenContract,
    forceMethod: "rpc",
    nickname: "TUSST Forge passkey",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
  });

  if (!result.submitResult?.success) {
    throw new Error("smart-wallet-deploy-failed");
  }

  return {
    contractId: result.contractId,
    credentialId: result.credentialId,
    txHash: result.submitResult.hash,
  };
}

export async function provePasskeyWallet(input: {
  deployerSecret: string;
  credentialId: string;
  contractId: string;
  recipient: string;
  config: PasskeyNetworkConfig;
}): Promise<string> {
  assertWebAuthn();
  const kit = await createKit(input.config, input.deployerSecret);

  // Reconnect binds the locally stored credential to this exact contract and
  // checks acceptedWasmHashes before any signature is requested.
  const connected = await kit.connectWallet({
    credentialId: input.credentialId,
    contractId: input.contractId,
  });
  if (!connected || connected.contractId !== input.contractId) {
    throw new Error("passkey-mismatch");
  }

  // createWallet normally funds on testnet. If Friendbot lagged or failed,
  // repair the balance here so the same deployed credential remains usable.
  const server = new rpc.Server(TESTNET.rpcUrl);
  const balance = await server
    .queryContract<bigint>(
      input.config.nativeTokenContract,
      "balance",
      { id: input.contractId },
      TESTNET.passphrase,
    )
    .then(({ result }) => BigInt(result))
    .catch(() => BigInt(0));
  if (balance <= BigInt(0)) {
    const funded = await kit.fundWallet(input.config.nativeTokenContract, {
      forceMethod: "rpc",
    });
    if (!funded.success) throw new Error("smart-wallet-fund-failed");
  }

  // This opens the real WebAuthn prompt and submits the signed auth entry.
  // Success means the on-chain verifier and __check_auth accepted the passkey.
  const sent = await kit.transfer(
    input.config.nativeTokenContract,
    input.recipient,
    1,
    { credentialId: input.credentialId, forceMethod: "rpc" },
  );
  if (!sent.success) throw new Error("passkey-transaction-failed");
  return sent.hash;
}
