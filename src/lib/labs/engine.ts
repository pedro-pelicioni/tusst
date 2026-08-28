"use client";

// The lab action interpreter: maps a LabAction (data) to real testnet work.
// Each executor reports coarse phases so the big button can render a live
// stepper (the DeployPanel pattern, generalized). Errors are typed with a
// `retryable` flag; one automatic retry is attempted for known-flaky cases
// (friendbot congestion, tx_bad_seq — rebuilt from a fresh sequence).

import { Keypair } from "@stellar/stellar-sdk";
import {
  fetchXlmBalance,
  fundWithFriendbot,
  generateLocalWallet,
  loadLocalWallet,
  exportLocalSecret,
  type ForgeWallet,
} from "@/lib/stellar/wallet";
import { ClassicSubmitError, runClassicOps } from "@/lib/stellar/classic";
import { runForgeStream } from "@/lib/soroban/run-stream";
import { constructorSpecFromWasm, deployContract } from "@/lib/stellar/deploy";
import { fetchContractSpec, invokeFunction } from "@/lib/stellar/invoke";
import {
  describeFunction,
  describeFunctions,
  formValuesToScVals,
} from "@/lib/stellar/spec-form";
import { addDeployment } from "@/lib/forge-store";
import type { LabAction, LabRunCtx } from "@/content/labs/types";

export type LabPhase =
  | "prepare"
  | "passkey"
  | "queued"
  | "building"
  | "sign"
  | "submit"
  | "confirm";

/** Phase sequence to display for a given action type. */
export function phasesFor(action: LabAction): LabPhase[] {
  switch (action.type) {
    case "contract-build":
      return ["prepare", "queued", "building"];
    case "contract-deploy":
    case "contract-invoke":
      return ["prepare", "sign", "submit", "confirm"];
    case "passkey-create":
    case "passkey-connect":
      return ["prepare", "passkey", "confirm"];
    case "friendbot":
      return ["submit", "confirm"];
    case "generate-keypair":
      return ["prepare"];
    case "classic-op":
      return ["prepare", "sign", "submit"];
  }
}

export class LabActionError extends Error {
  readonly retryable: boolean;
  constructor(message: string, retryable: boolean) {
    super(message);
    this.name = "LabActionError";
    this.retryable = retryable;
  }
}

export interface LabActionResult {
  /** present when the action produced/loaded a wallet */
  wallet?: ForgeWallet;
  /** present when the action wrote a generated value into lab state */
  stateDelta?: Record<string, string>;
  /** present when the action landed a transaction */
  txHash?: string;
  /** present after funding (post-confirmation XLM balance) */
  balance?: string;
  /** present after a successful contract-build */
  wasmB64?: string;
  /** present after a successful contract-deploy */
  contractId?: string;
}

export type LabPhaseReporter = (phase: LabPhase, detail?: string) => void;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runFriendbot(
  wallet: ForgeWallet,
  onPhase: (p: LabPhase) => void,
): Promise<LabActionResult> {
  onPhase("submit");
  await fundWithFriendbot(wallet.address);
  // Horizon lags friendbot; poll briefly so the success copy can show a
  // real balance (same cadence as the IDE's WalletMenu).
  onPhase("confirm");
  for (let i = 0; i < 5; i++) {
    await sleep(1_200);
    const balance = await fetchXlmBalance(wallet.address).catch(() => null);
    if (balance !== null) return { balance };
  }
  return { balance: "10000" };
}

function decodeB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function runLabAction(
  action: LabAction,
  wallet: ForgeWallet | null,
  ctx: LabRunCtx,
  onPhase: LabPhaseReporter,
): Promise<LabActionResult> {
  switch (action.type) {
    case "generate-keypair": {
      onPhase("prepare");
      if (action.target === "wallet") {
        return { wallet: loadLocalWallet() ?? generateLocalWallet() };
      }
      const key = action.stateKey ?? "generated";
      // Secret intentionally discarded — labs only ever need the address.
      return { stateDelta: { [key]: Keypair.random().publicKey() } };
    }

    case "friendbot": {
      if (!wallet) throw new LabActionError("wallet-required", false);
      try {
        return await runFriendbot(wallet, onPhase);
      } catch {
        // Friendbot rate-limits under load — one quiet retry, then surface.
        await sleep(2_000);
        try {
          return await runFriendbot(wallet, onPhase);
        } catch {
          throw new LabActionError("friendbot-failed", true);
        }
      }
    }

    case "contract-build": {
      onPhase("prepare");
      const files = action.files(ctx);
      const result = await runForgeStream("build", files, {
        onQueued: () => onPhase("queued"),
        onPhase: (name) => {
          if (name !== "prepare") onPhase("building");
        },
        onLog: (line) => onPhase("building", line.slice(0, 120)),
      });
      if (result.preStreamError) {
        throw new LabActionError(result.preStreamError, false);
      }
      if (!result.ok || !result.wasmB64) {
        throw new LabActionError(
          result.timedOut
            ? "build-timeout"
            : result.infraError || result.networkError
              ? "forge-cold"
              : "build-failed",
          true,
        );
      }
      return { wasmB64: result.wasmB64 };
    }

    case "contract-deploy": {
      if (!wallet) throw new LabActionError("wallet-required", false);
      if (!ctx.artifacts.wasmB64) throw new LabActionError("missing-state", false);
      onPhase("prepare");
      const wasm = decodeB64(ctx.artifacts.wasmB64);
      const { spec, func } = constructorSpecFromWasm(wasm);
      let constructorArgs: ReturnType<typeof formValuesToScVals> = [];
      if (func) {
        const descriptor = describeFunction(func);
        const values = action.argsFrom(ctx);
        constructorArgs = formValuesToScVals(spec, descriptor, values);
      }
      try {
        const result = await deployContract({
          wasm,
          wallet,
          constructorArgs,
          onStep: (step) => {
            if (step === "upload-sign" || step === "create-sign") onPhase("sign");
            else onPhase("confirm");
          },
        });
        // Share the deployment with the IDE's Interact panel — one Forge.
        addDeployment({
          contractId: result.contractId,
          wasmHash: result.wasmHash,
          network: "testnet",
          label: ctx.state.tokenSymbol
            ? `lab: ${ctx.state.tokenSymbol}`
            : "lab deploy",
          createdAt: Date.now(),
        });
        return { contractId: result.contractId, txHash: result.createTx };
      } catch (e) {
        throw new LabActionError(
          e instanceof Error ? e.message.slice(0, 200) : "deploy failed",
          true,
        );
      }
    }

    case "contract-invoke": {
      if (!wallet) throw new LabActionError("wallet-required", false);
      if (!ctx.artifacts.contractId) throw new LabActionError("missing-state", false);
      onPhase("prepare");
      try {
        const spec = await fetchContractSpec(ctx.artifacts.contractId, wallet.address);
        const descriptor = describeFunctions(spec).find((f) => f.name === action.func);
        if (!descriptor) throw new Error(`function ${action.func} not in spec`);
        const args = formValuesToScVals(spec, descriptor, action.argsFrom(ctx));
        onPhase("sign");
        const outcome = await invokeFunction({
          contractId: ctx.artifacts.contractId,
          spec,
          fnName: action.func,
          args,
          wallet,
        });
        onPhase("confirm");
        return { txHash: outcome.txHash };
      } catch (e) {
        throw new LabActionError(
          e instanceof Error ? e.message.slice(0, 200) : "invoke failed",
          true,
        );
      }
    }

    case "passkey-create": {
      if (!wallet) throw new LabActionError("wallet-required", false);
      if (wallet.kind !== "local") {
        throw new LabActionError("local-wallet-required", false);
      }
      const deployerSecret = exportLocalSecret();
      if (!deployerSecret) {
        throw new LabActionError("local-wallet-required", false);
      }
      onPhase("prepare");
      try {
        const { createPasskeyWallet } = await import(
          "@/lib/stellar/smart-account"
        );
        onPhase("passkey");
        const result = await createPasskeyWallet({
          deployerSecret,
          appName: action.appName,
          userName: wallet.address,
          config: {
            accountWasmHash: action.accountWasmHash,
            webauthnVerifierAddress: action.webauthnVerifierAddress,
            nativeTokenContract: action.nativeTokenContract,
          },
        });
        onPhase("confirm");
        return {
          contractId: result.contractId,
          txHash: result.txHash,
          stateDelta: {
            passkeyCredentialId: result.credentialId,
            passkeyAuthenticated: "no",
          },
        };
      } catch (e) {
        const message = e instanceof Error ? e.message : "passkey-failed";
        const known = new Set([
          "passkey-unavailable",
          "passkey-mismatch",
          "smart-wallet-deploy-failed",
        ]);
        throw new LabActionError(
          known.has(message) ? message : "passkey-failed",
          true,
        );
      }
    }

    case "passkey-connect": {
      if (!wallet) throw new LabActionError("wallet-required", false);
      if (wallet.kind !== "local") {
        throw new LabActionError("local-wallet-required", false);
      }
      const deployerSecret = exportLocalSecret();
      const credentialId = ctx.state.passkeyCredentialId;
      const contractId = ctx.artifacts.contractId;
      if (!deployerSecret) {
        throw new LabActionError("local-wallet-required", false);
      }
      if (!credentialId || !contractId) {
        throw new LabActionError("missing-state", false);
      }
      onPhase("prepare");
      try {
        const { provePasskeyWallet } = await import(
          "@/lib/stellar/smart-account"
        );
        onPhase("passkey");
        const txHash = await provePasskeyWallet({
          deployerSecret,
          credentialId,
          contractId,
          recipient: wallet.address,
          config: {
            accountWasmHash: action.accountWasmHash,
            webauthnVerifierAddress: action.webauthnVerifierAddress,
            nativeTokenContract: action.nativeTokenContract,
          },
        });
        onPhase("confirm");
        return {
          txHash,
          stateDelta: { passkeyAuthenticated: "yes" },
        };
      } catch (e) {
        const message = e instanceof Error ? e.message : "passkey-failed";
        const known = new Set([
          "passkey-unavailable",
          "passkey-mismatch",
          "smart-wallet-fund-failed",
          "passkey-transaction-failed",
        ]);
        throw new LabActionError(
          known.has(message) ? message : "passkey-failed",
          true,
        );
      }
    }

    case "classic-op": {
      if (!wallet) throw new LabActionError("wallet-required", false);
      onPhase("prepare");
      const ops = action.ops(ctx);
      if (ops.some((op) => Object.values(op).some((v) => v === undefined))) {
        throw new LabActionError("missing-state", false);
      }
      const submit = async () => {
        onPhase("sign");
        // runClassicOps rebuilds from a fresh sequence each call, so a
        // tx_bad_seq retry is safe by construction.
        return runClassicOps(wallet, ops);
      };
      try {
        onPhase("submit");
        const { hash } = await submit();
        return { txHash: hash };
      } catch (e) {
        if (e instanceof ClassicSubmitError && e.retryable) {
          await sleep(1_500);
          try {
            const { hash } = await submit();
            return { txHash: hash };
          } catch (e2) {
            throw new LabActionError(
              e2 instanceof Error ? e2.message : "transaction failed",
              true,
            );
          }
        }
        throw new LabActionError(
          e instanceof Error ? e.message : "transaction failed",
          e instanceof ClassicSubmitError ? e.retryable : true,
        );
      }
    }
  }
}
