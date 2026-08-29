// Forge Labs scenario DSL. A lab is DATA (this shape) interpreted by one
// engine (src/lib/labs/engine.ts) and one player (src/components/labs/) —
// adding a lab to the catalog is a new content module plus a registry entry.
//
// Content modules must stay dependency-free: type-only imports, plain data,
// and pure functions over LabRunCtx. The server (api/labs/complete) imports
// the registry to read `verify`, which is data-only by construction.

import type { WidgetComponent } from "@/content/visuals/types";
import type { ClassicOpSpec } from "@/lib/stellar/classic";
import type { SorobanFileMap } from "@/lib/soroban/types";

export type LabDifficulty = "novice" | "adept" | "master";

export interface LabMeta {
  slug: string;
  /** EN-first; locale overlays arrive with the content i18n phase */
  title: string;
  tagline: string;
  difficulty: LabDifficulty;
  estMinutes: number;
  status: "live" | "soon";
  /** public/ path; the card falls back to a glyph when the art is missing */
  emblem: string;
  /** glyph stand-in shown until the emblem art lands */
  glyph: string;
}

export interface LabArtifacts {
  address?: string;
  /** on-chain evidence per action step id */
  txHashes: Record<string, string>;
  contractId?: string;
  /** compiled wasm from a contract-build step (base64) */
  wasmB64?: string;
}

export interface LabRunCtx {
  walletAddress: string | null;
  /** answers + generated values (e.g. the companion address) */
  state: Record<string, string>;
  artifacts: LabArtifacts;
}

export type LabAction =
  | { type: "generate-keypair"; target: "wallet" | "state"; stateKey?: string }
  | { type: "friendbot" }
  | { type: "classic-op"; ops: (ctx: LabRunCtx) => ClassicOpSpec[] }
  | { type: "contract-build"; files: (ctx: LabRunCtx) => SorobanFileMap }
  | {
      type: "contract-deploy";
      /** constructor arg values by name; the engine converts via the wasm spec */
      argsFrom: (ctx: LabRunCtx) => Record<string, string>;
    }
  | {
      type: "contract-invoke";
      func: string;
      argsFrom: (ctx: LabRunCtx) => Record<string, string>;
    }
  | {
      type: "passkey-create";
      appName: string;
      accountWasmHash: string;
      webauthnVerifierAddress: string;
      nativeTokenContract: string;
    }
  | {
      type: "passkey-connect";
      accountWasmHash: string;
      webauthnVerifierAddress: string;
      nativeTokenContract: string;
    };

export type LabStep =
  | { kind: "narrate"; id: string; body: string; art?: string }
  | {
      kind: "quiz";
      id: string;
      question: string;
      /** correct answer first — the player shuffles with a seeded order */
      options: string[];
      answer: number;
      explain?: string;
    }
  | {
      kind: "choice";
      id: string;
      prompt: string;
      stateKey: string;
      options: { label: string; value: string; blurb?: string }[];
    }
  | {
      kind: "input";
      id: string;
      prompt: string;
      stateKey: string;
      placeholder: string;
      /** regex source the value must fully match before Continue enables */
      pattern?: string;
      maxLength?: number;
      hint?: string;
    }
  | {
      kind: "action";
      id: string;
      title: string;
      body: string;
      /** big-button label */
      cta: string;
      action: LabAction;
      /** may interpolate {address}, {companion}, {balance}, {tx} */
      successBody: string;
      explorer?: "tx" | "account" | "contract";
    }
  | { kind: "sim"; id: string; component: WidgetComponent; body?: string }
  | { kind: "checkpoint"; id: string; body: string };

// Data-only — interpreted server-side against Horizon/RPC, never executed
// from the client's claims.
export type VerifySpec =
  | { check: "account-exists" }
  | { check: "trustline"; assetCode: string; assetIssuer: string }
  | { check: "payment-sent" }
  /** simulate `func(address)` on artifacts.contractId; passes when > 0 */
  | { check: "token-balance-positive"; func: string }
  /** fetch the deployed contract Wasm and bind it to a known code identity */
  | { check: "smart-account-code"; wasmHash: string }
  /** query the native SAC balance of artifacts.contractId; passes when > 0 */
  | { check: "smart-account-native-balance"; nativeTokenContract: string }
  /**
   * Scans the account's operation history for a create_claimable_balance it
   * signed. Deliberately NOT a lookup of the balance itself: a lab that ends
   * by claiming the chest would have destroyed that entry, and the deed we
   * are verifying is the creation.
   */
  | { check: "claimable-balance-created" }
  /** the account carries at least this many signers, at this med threshold */
  | { check: "account-thresholds"; minSigners: number; minMedThreshold: number };

export interface LabScenario {
  meta: LabMeta;
  steps: LabStep[];
  verify: VerifySpec[];
}
