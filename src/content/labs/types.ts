// Forge Labs scenario DSL. A lab is DATA (this shape) interpreted by one
// engine (src/lib/labs/engine.ts) and one player (src/components/labs/) —
// adding a lab to the catalog is a new content module plus a registry entry.
//
// Content modules must stay dependency-free: type-only imports, plain data,
// and pure functions over LabRunCtx. The server (api/labs/complete) imports
// the registry to read `verify`, which is data-only by construction.

import type { ClassicOpSpec } from "@/lib/stellar/classic";

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
  | { type: "classic-op"; ops: (ctx: LabRunCtx) => ClassicOpSpec[] };
// Phase C adds: contract-build | contract-deploy | contract-invoke | passkey-*

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
      kind: "action";
      id: string;
      title: string;
      body: string;
      /** big-button label */
      cta: string;
      action: LabAction;
      /** may interpolate {address}, {companion}, {balance}, {tx} */
      successBody: string;
      explorer?: "tx" | "account";
    }
  | { kind: "sim"; id: string; component: "scp-sim"; body?: string }
  | { kind: "checkpoint"; id: string; body: string };

// Data-only — interpreted server-side against Horizon/RPC, never executed
// from the client's claims.
export type VerifySpec =
  | { check: "account-exists" }
  | { check: "trustline"; assetCode: string; assetIssuer: string }
  | { check: "payment-sent" };

export interface LabScenario {
  meta: LabMeta;
  steps: LabStep[];
  verify: VerifySpec[];
}
