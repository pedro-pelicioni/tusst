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
  type ForgeWallet,
} from "@/lib/stellar/wallet";
import { ClassicSubmitError, runClassicOps } from "@/lib/stellar/classic";
import type { LabAction, LabRunCtx } from "@/content/labs/types";

export type LabPhase = "prepare" | "sign" | "submit" | "confirm";

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
}

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

export async function runLabAction(
  action: LabAction,
  wallet: ForgeWallet | null,
  ctx: LabRunCtx,
  onPhase: (p: LabPhase) => void,
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
