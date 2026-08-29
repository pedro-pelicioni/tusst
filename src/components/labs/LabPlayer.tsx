/* eslint-disable @next/next/no-img-element */
"use client";

// The guided-lab player: LessonSteps' skeleton (index/maxIndex, progress bar,
// feedback sheet, mascot) with new step kinds — big action buttons that do
// real testnet work through src/lib/labs/engine.ts, and a checkpoint that
// claims XP only after the server has read the chain. Content is resolved
// client-side by slug (scenario modules carry functions, so they can't cross
// the server→client prop boundary).

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { WidgetSlot } from "@/components/visuals/WidgetSlot";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { labBySlug } from "@/content/labs";
import {
  localizeLab,
  type LabTextOverlay,
} from "@/content/labs/localize";
import type { LabStep } from "@/content/labs/types";
import {
  LabActionError,
  phasesFor,
  runLabAction,
  type LabPhase,
} from "@/lib/labs/engine";
import { emptyRun, loadRun, saveRun, type LabRun } from "@/lib/labs/store";
import { loadLocalWallet, type ForgeWallet } from "@/lib/stellar/wallet";
import {
  explorerAccountUrl,
  explorerContractUrl,
  explorerTxUrl,
} from "@/lib/stellar/network";

const MASCOT_CELEBRATE = "/mascot/mascot-celebrate.png";
const MASCOT_ENCOURAGE = "/mascot/mascot-encourage.png";
const RUNE_ARROW = "/rune-arrow.png";

type Feedback = { correct: boolean; text: string } | null;
type ActionStatus =
  | { s: "idle" }
  | { s: "running"; phase: LabPhase; detail?: string }
  | { s: "error"; message: string; retryable: boolean };
type ClaimStatus =
  | { s: "idle" }
  | { s: "verifying" }
  | { s: "failed"; checks: string[] }
  | { s: "done"; earned: number; total: number; level: number; leveledUp: boolean; already: boolean };

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededOrder(length: number, seed: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  let s = seed || 1;
  for (let i = length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "back" | "forward";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bg-elev transition hover:border-accent/40 hover:bg-accent/[0.07] disabled:invisible"
    >
      <img
        src={RUNE_ARROW}
        alt=""
        className={`h-[22px] w-[22px] object-contain ${direction === "forward" ? "-scale-x-100" : ""}`}
        style={{ filter: "drop-shadow(0 0 6px rgba(143,123,255,0.45))" }}
      />
    </button>
  );
}


export function LabPlayer({
  labSlug,
  signedIn,
}: {
  labSlug: string;
  signedIn: boolean;
}) {
  const m = useMessages();
  const baseLab = labBySlug(labSlug);
  const contentBySlug = m.labs.content as Record<
    string,
    LabTextOverlay | undefined
  >;
  const labOverlay = contentBySlug[labSlug];
  const lab = useMemo(
    () => (baseLab ? localizeLab(baseLab, labOverlay) : undefined),
    [baseLab, labOverlay],
  );

  const [run, setRun] = useState<LabRun>(emptyRun);
  const [wallet, setWallet] = useState<ForgeWallet | null>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [action, setAction] = useState<ActionStatus>({ s: "idle" });
  const [claim, setClaim] = useState<ClaimStatus>({ s: "idle" });
  const [copied, setCopied] = useState(false);
  const claimedOnce = useRef(false);

  const total = lab?.steps.length ?? 0;

  // Hydrate the saved run + the shared Forge wallet, and resume at the
  // furthest cleared step. Sync-from-localStorage on mount, same pattern
  // (and lint carve-out) as WalletMenu's wallet restore.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!lab) return;
    const stored = loadRun(lab.meta.slug);
    setRun(stored);
    setWallet(loadLocalWallet());
    const resume = Math.min(stored.stepsDone, lab.steps.length - 1);
    setIndex(resume);
    setMaxIndex(resume);
  }, [lab]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback(
    (next: LabRun) => {
      setRun(next);
      if (lab) saveRun(lab.meta.slug, next);
    },
    [lab],
  );

  const step: LabStep | undefined = lab?.steps[Math.min(index, total - 1)];
  const stepCleared = step ? index < run.stepsDone : false;

  const optionOrder = useMemo(() => {
    if (step?.kind === "quiz")
      return seededOrder(step.options.length, hashString(labSlug + step.question));
    return [];
  }, [step, labSlug]);

  const vars = useMemo(
    () => ({
      address: wallet?.address ?? run.artifacts.address ?? "…",
      companion: run.state.companion ?? "…",
      balance: run.state.balance ?? "10000",
      tx: step ? (run.artifacts.txHashes[step.id] ?? "…") : "…",
      contract: run.artifacts.contractId ?? "…",
      name: run.state.tokenName ?? "…",
      symbol: run.state.tokenSymbol ?? "…",
      supply: run.state.tokenSupply ?? "…",
    }),
    [wallet, run, step],
  );

  const advance = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    setAction({ s: "idle" });
    const cleared = Math.max(run.stepsDone, index + 1);
    if (cleared !== run.stepsDone) persist({ ...run, stepsDone: cleared });
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setMaxIndex((mx) => Math.max(mx, index + 1));
    }
  }, [index, total, run, persist]);

  const goBack = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    setAction({ s: "idle" });
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goForward = useCallback(() => {
    setSelected(null);
    setFeedback(null);
    setAction({ s: "idle" });
    setIndex((i) => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  if (!lab || !step) return null;

  const runAction = async () => {
    if (step.kind !== "action") return;
    setAction({ s: "running", phase: "prepare" });
    try {
      const ctx = {
        walletAddress: wallet?.address ?? null,
        state: run.state,
        artifacts: run.artifacts,
      };
      const result = await runLabAction(step.action, wallet, ctx, (phase, detail) =>
        setAction({ s: "running", phase, detail }),
      );

      const next: LabRun = {
        ...run,
        stepsDone: Math.max(run.stepsDone, index + 1),
        state: { ...run.state, ...(result.stateDelta ?? {}) },
        artifacts: { ...run.artifacts, txHashes: { ...run.artifacts.txHashes } },
      };
      if (result.wallet) {
        setWallet(result.wallet);
        next.artifacts.address = result.wallet.address;
      }
      if (result.balance) next.state.balance = result.balance;
      if (result.txHash) next.artifacts.txHashes[step.id] = result.txHash;
      if (result.wasmB64) next.artifacts.wasmB64 = result.wasmB64;
      if (result.contractId) next.artifacts.contractId = result.contractId;
      persist(next);
      setMaxIndex((mx) => Math.max(mx, index + 1));
      setAction({ s: "idle" });
    } catch (e) {
      if (e instanceof LabActionError) {
        const known: Record<string, string> = {
          "wallet-required": m.labs.player.errors.walletRequired,
          "missing-state": m.labs.player.errors.missingState,
          "friendbot-failed": m.labs.player.errors.testnetBusy,
          "forge-cold": m.labs.player.errors.forgeCold,
          "build-failed": m.labs.player.errors.buildFailed,
          "build-timeout": m.labs.player.errors.buildTimeout,
          "local-wallet-required": m.labs.player.errors.localWalletRequired,
          "passkey-unavailable": m.labs.player.errors.passkeyUnavailable,
          "passkey-mismatch": m.labs.player.errors.passkeyMismatch,
          "passkey-failed": m.labs.player.errors.passkeyFailed,
          "smart-wallet-deploy-failed":
            m.labs.player.errors.smartWalletDeployFailed,
          "smart-wallet-fund-failed":
            m.labs.player.errors.smartWalletFundFailed,
          "passkey-transaction-failed":
            m.labs.player.errors.passkeyTransactionFailed,
        };
        setAction({
          s: "error",
          message: known[e.message] ?? e.message,
          retryable: e.retryable,
        });
      } else {
        setAction({
          s: "error",
          message: m.labs.player.errors.testnetBusy,
          retryable: true,
        });
      }
    }
  };

  const claimXp = async () => {
    const address = wallet?.address ?? run.artifacts.address;
    // Sim-only labs (empty verify[]) have no wallet — the claim is
    // honor-based, like sealing a journey chapter.
    if (!address && lab.verify.length > 0) {
      setClaim({ s: "failed", checks: ["account-exists"] });
      return;
    }
    setClaim({ s: "verifying" });
    try {
      const res = await fetch("/api/labs/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labSlug: lab.meta.slug,
          address,
          artifacts: run.artifacts,
        }),
      });
      if (res.status === 422) {
        const body = (await res.json()) as { failed?: string[] };
        setClaim({ s: "failed", checks: body.failed ?? [] });
        return;
      }
      if (!res.ok) {
        setClaim({ s: "idle" });
        setAction({
          s: "error",
          message: m.labs.player.errors.testnetBusy,
          retryable: true,
        });
        return;
      }
      const body = (await res.json()) as {
        already: boolean;
        xp: { earned: number; total: number; level: number; leveledUp: boolean };
      };
      claimedOnce.current = true;
      persist({ ...run, stepsDone: total, completedAt: Date.now() });
      setClaim({
        s: "done",
        earned: body.xp.earned,
        total: body.xp.total,
        level: body.xp.level,
        leveledUp: body.xp.leveledUp,
        already: body.already,
      });
    } catch {
      setClaim({ s: "idle" });
      setAction({
        s: "error",
        message: m.labs.player.errors.testnetBusy,
        retryable: true,
      });
    }
  };

  const percent = claim.s === "done" ? 100 : Math.round((index / total) * 100);

  /* ─── completion screen ─── */
  if (claim.s === "done") {
    const p = m.labs.player.done;
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <img
          src={MASCOT_CELEBRATE}
          alt=""
          className="h-44 w-44 object-contain"
          style={{ filter: "drop-shadow(0 0 40px rgba(69,214,196,0.35))" }}
        />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent2">
          {p.kicker}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-fg">
          {lab.meta.title}
        </h1>
        {claim.already ? (
          <p className="mt-4 text-sm text-muted2">{p.already}</p>
        ) : (
          <>
            <p className="mt-5 font-display text-4xl font-extrabold text-gold">
              {fmt(p.xpEarned, { xp: claim.earned })}
            </p>
            {claim.leveledUp && (
              <p className="mt-2 font-display text-lg font-bold text-accent-soft">
                {fmt(p.levelUp, { level: claim.level })}
              </p>
            )}
          </>
        )}
        <p className="mt-2 font-mono text-[11px] text-muted">
          {fmt(p.xpTotal, { xp: claim.total })}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/labs"
            className="rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[2px]"
            style={{
              background: "linear-gradient(180deg, #9ef0e4, #45d6c4)",
              boxShadow: "0 0 34px rgba(69,214,196,0.4)",
            }}
          >
            {p.backToForge}
          </Link>
          <Link
            href="/ide"
            className="rounded-full border border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:border-line-strong hover:text-fg"
          >
            {p.openIde}
          </Link>
        </div>
      </div>
    );
  }

  const walletShort = wallet
    ? `${wallet.address.slice(0, 5)}…${wallet.address.slice(-5)}`
    : null;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-140px)] max-w-3xl flex-col px-5 py-6">
      {/* ─── top bar ─── */}
      <div className="flex items-center gap-3">
        <Link
          href="/labs"
          aria-label={m.labs.player.exit}
          className="shrink-0 text-lg leading-none text-muted transition hover:text-fg"
        >
          ✕
        </Link>
        <ArrowButton
          direction="back"
          label={m.lesson.previousStep}
          disabled={index === 0}
          onClick={goBack}
        />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${Math.max(percent, 4)}%`,
              background: "linear-gradient(90deg, #45d6c4, #9ef0e4)",
              boxShadow: "0 0 12px rgba(69,214,196,0.6)",
            }}
          />
        </div>
        <ArrowButton
          direction="forward"
          label={m.lesson.nextStep}
          disabled={index >= maxIndex}
          onClick={goForward}
        />
        <span className="shrink-0 font-mono text-[11px] text-muted">
          {fmt(m.lesson.stepProgress, {
            current: Math.min(index + 1, total),
            total,
          })}
        </span>
      </div>

      {/* ─── wallet badge ─── */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={!wallet}
          onClick={() => {
            if (!wallet) return;
            navigator.clipboard?.writeText(wallet.address).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          title={wallet ? m.labs.player.wallet.copy : undefined}
          className="flex items-center gap-2 rounded-full border border-line bg-bg-elev px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted2 transition enabled:hover:border-accent2/40 enabled:hover:text-fg"
        >
          <span aria-hidden>🗝</span>
          {wallet
            ? copied
              ? m.labs.player.wallet.copied
              : `${m.labs.player.wallet.yours} · ${walletShort}`
            : m.labs.player.wallet.none}
        </button>
      </div>

      {/* ─── step body ─── */}
      <div className="flex flex-1 flex-col justify-start pt-8">
        {step.kind === "narrate" && (
          <div className="mx-auto w-full max-w-xl">
            <Markdown>{step.body}</Markdown>
          </div>
        )}

        {step.kind === "quiz" && (
          <div className="mx-auto w-full max-w-xl">
            <Markdown>{step.question}</Markdown>
            <div className="mt-6 flex flex-col gap-3">
              {optionOrder.map((i) => {
                const opt = step.options[i];
                const isSel = selected === i;
                const wrong = feedback && !feedback.correct && isSel;
                const right = feedback?.correct && isSel;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!!feedback?.correct}
                    onClick={() => {
                      if (feedback) setFeedback(null);
                      setSelected(i);
                    }}
                    className={`rounded-xl border px-5 py-4 text-left text-sm transition ${
                      right
                        ? "border-pop/60 bg-pop/10 text-pop"
                        : wrong
                          ? "border-red-400/60 bg-red-400/10 text-red-300"
                          : isSel
                            ? "border-accent/70 bg-accent/15 text-fg"
                            : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    <span className="text-[13.5px] leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step.kind === "choice" && (
          <div className="mx-auto w-full max-w-xl">
            <Markdown>{step.prompt}</Markdown>
            <div className="mt-6 flex flex-col gap-3">
              {step.options.map((opt) => {
                const isSel = run.state[step.stateKey] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      persist({
                        ...run,
                        state: { ...run.state, [step.stateKey]: opt.value },
                      })
                    }
                    className={`rounded-xl border px-5 py-4 text-left transition ${
                      isSel
                        ? "border-accent/70 bg-accent/15 text-fg"
                        : "border-line bg-bg-elev text-muted2 hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    <span className="text-sm font-semibold">{opt.label}</span>
                    {opt.blurb && (
                      <span className="mt-1 block text-[12px] text-muted">
                        {opt.blurb}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step.kind === "input" && (
          <div className="mx-auto w-full max-w-xl">
            <Markdown>{step.prompt}</Markdown>
            <input
              type="text"
              value={run.state[step.stateKey] ?? ""}
              maxLength={step.maxLength}
              placeholder={step.placeholder}
              onChange={(e) =>
                persist({
                  ...run,
                  state: { ...run.state, [step.stateKey]: e.target.value },
                })
              }
              className="mt-6 w-full rounded-xl border border-line bg-bg-elev px-5 py-4 font-mono text-[15px] text-fg outline-none transition placeholder:text-muted/60 focus:border-accent2/60"
            />
            {step.hint && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {step.hint}
              </p>
            )}
          </div>
        )}

        {step.kind === "sim" && (
          <div className="mx-auto w-full max-w-2xl">
            {step.body && (
              <div className="mx-auto max-w-xl">
                <Markdown>{step.body}</Markdown>
              </div>
            )}
            <div className="mt-6">
              <WidgetSlot component={step.component} />
            </div>
          </div>
        )}

        {step.kind === "action" && (
          <div className="mx-auto w-full max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent2/80">
              {lab.meta.title}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-wide text-fg">
              {step.title}
            </h2>
            <div className="mt-4">
              <Markdown>{fmt(step.body, vars)}</Markdown>
            </div>

            {stepCleared || action.s === "idle" ? null : null}

            {stepCleared ? (
              /* already done — show the aftermath + explorer link */
              <div className="mt-6 rounded-xl border border-pop/40 bg-pop/[0.06] px-5 py-4">
                <Markdown>{fmt(step.successBody, vars)}</Markdown>
                {step.explorer && (
                  <a
                    href={
                      step.explorer === "tx"
                        ? explorerTxUrl(run.artifacts.txHashes[step.id] ?? "")
                        : step.explorer === "contract"
                          ? explorerContractUrl(run.artifacts.contractId ?? "")
                          : explorerAccountUrl(vars.address)
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-accent2 hover:underline"
                  >
                    {step.explorer === "tx"
                      ? m.labs.player.viewTx
                      : step.explorer === "contract"
                        ? m.labs.player.viewContract
                        : m.labs.player.viewAccount}{" "}
                    ↗
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <button
                  type="button"
                  disabled={action.s === "running"}
                  onClick={runAction}
                  className="w-full rounded-2xl px-8 py-5 font-display text-[15px] font-bold uppercase tracking-[0.16em] text-[#062421] transition-transform enabled:hover:-translate-y-[2px] disabled:opacity-70"
                  style={{
                    background: "linear-gradient(180deg, #9ef0e4, #45d6c4)",
                    boxShadow:
                      "0 0 40px rgba(69,214,196,0.35), 0 10px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  {action.s === "running" ? (
                    <span className="sc-flicker">⚒ …</span>
                  ) : (
                    fmt(step.cta, vars)
                  )}
                </button>

                {/* phase stepper (sequence depends on the action type) */}
                {action.s === "running" && (
                  <>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                      {phasesFor(step.action).map((p, pi, order) => (
                        <span
                          key={p}
                          className={
                            p === action.phase
                              ? "text-accent2"
                              : pi < order.indexOf(action.phase)
                                ? "text-muted2"
                                : "text-muted/50"
                          }
                        >
                          {p === action.phase ? "» " : ""}
                          {m.labs.player.phases[p]}
                        </span>
                      ))}
                    </div>
                    {action.detail && (
                      <p className="mt-2 truncate text-center font-mono text-[10px] text-muted/70">
                        {action.detail}
                      </p>
                    )}
                  </>
                )}

                {action.s === "error" && (
                  <div className="mt-4 rounded-xl border border-red-400/40 bg-red-400/[0.07] px-5 py-4">
                    <p className="text-sm text-red-300">{action.message}</p>
                    <button
                      type="button"
                      onClick={runAction}
                      className="mt-3 rounded-full border border-red-400/50 px-5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-400/10"
                    >
                      {m.labs.player.retry}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step.kind === "checkpoint" && (
          <div className="mx-auto w-full max-w-xl text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">
              {m.labs.player.checkpoint.title}
            </p>
            <div className="mt-4 text-left">
              <Markdown>{step.body}</Markdown>
            </div>

            {signedIn ? (
              <button
                type="button"
                disabled={claim.s === "verifying"}
                onClick={claimXp}
                className="mt-8 w-full rounded-2xl px-8 py-5 font-display text-[15px] font-bold uppercase tracking-[0.16em] text-[#241d06] transition-transform enabled:hover:-translate-y-[2px] disabled:opacity-70"
                style={{
                  background: "linear-gradient(180deg, #ecd9a6, #d9b96a)",
                  boxShadow:
                    "0 0 40px rgba(217,185,106,0.35), 0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {claim.s === "verifying"
                  ? m.labs.player.checkpoint.verifying
                  : m.labs.player.checkpoint.cta}
              </button>
            ) : (
              <div className="mt-8 rounded-xl border border-line bg-bg-elev px-5 py-5">
                <p className="text-sm leading-relaxed text-muted2">
                  {m.labs.player.checkpoint.anonymous}
                </p>
                <Link
                  href="/login"
                  className="mt-4 inline-block rounded-full px-7 py-3 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-[#0b0817]"
                  style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                >
                  {m.labs.player.checkpoint.signIn}
                </Link>
              </div>
            )}

            {claim.s === "failed" && (
              <div className="mt-4 rounded-xl border border-red-400/40 bg-red-400/[0.07] px-5 py-4 text-left">
                <p className="text-sm text-red-300">
                  {fmt(m.labs.player.checkpoint.failed, {
                    checks: claim.checks
                      .map(
                        (c) =>
                          (
                            m.labs.player.checkpoint.checkNames as Record<
                              string,
                              string
                            >
                          )[c] ?? c,
                      )
                      .join(" · "),
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── bottom action / feedback sheet ─── */}
      {(step.kind === "narrate" ||
        step.kind === "quiz" ||
        step.kind === "choice" ||
        step.kind === "input" ||
        step.kind === "sim" ||
        (step.kind === "action" && stepCleared)) && (
        // The sheet used to be a flat `bg-bg/90` block the width of the
        // reading column. That was invisible while the player had no backdrop
        // — now that it sits on art, it read as a black rectangle floating
        // mid-screen with hard left and right edges. The band is now
        // full-bleed (clipped by `.sc-scene`'s overflow, so no scrollbar) and
        // fades upward into the art instead of butting against it.
        <div className="sticky bottom-0 z-10 -mx-5 mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-100vmax] bottom-0 top-0 -z-10 border-t border-line/60 bg-bg/80 backdrop-blur"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-100vmax] bottom-full -z-10 h-16 bg-gradient-to-t from-bg/80 to-transparent"
          />
          <div className="px-5 py-4">
          {feedback ? (
            <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-4 sm:flex-1">
                <img
                  src={feedback.correct ? MASCOT_CELEBRATE : MASCOT_ENCOURAGE}
                  alt=""
                  className="h-14 w-14 shrink-0 object-contain"
                />
                <p
                  className={`flex-1 text-sm font-medium ${
                    feedback.correct ? "text-pop" : "text-red-300"
                  }`}
                >
                  {feedback.text}
                </p>
              </div>
              {feedback.correct ? (
                <button
                  type="button"
                  onClick={advance}
                  className="w-full rounded-full px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] sm:w-auto"
                  style={{ background: "linear-gradient(180deg, #cfc3ff, #8f7bff)" }}
                >
                  {m.lesson.continueLabel}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setFeedback(null);
                  }}
                  className="w-full rounded-full border border-red-400/50 px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-red-300 transition hover:bg-red-400/10 sm:w-auto"
                >
                  {m.lesson.retry}
                </button>
              )}
            </div>
          ) : (
            <div className="mx-auto flex max-w-xl justify-end">
              {step.kind === "quiz" ? (
                <button
                  type="button"
                  disabled={selected === null}
                  onClick={() => {
                    if (selected === null) return;
                    if (selected === step.answer) {
                      setFeedback({
                        correct: true,
                        text:
                          step.explain ??
                          m.lesson.praise[index % m.lesson.praise.length],
                      });
                    } else {
                      setFeedback({ correct: false, text: m.lesson.incorrect });
                    }
                  }}
                  className="w-full rounded-full px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px] disabled:opacity-40 sm:w-auto"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.35)",
                  }}
                >
                  {m.lesson.check}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={
                    (step.kind === "choice" && !run.state[step.stateKey]) ||
                    (step.kind === "input" &&
                      !new RegExp(step.pattern ?? "^.+$").test(
                        run.state[step.stateKey] ?? "",
                      ))
                  }
                  onClick={advance}
                  className="w-full rounded-full px-7 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0b0817] transition-transform hover:-translate-y-[1px] disabled:opacity-40 sm:w-auto"
                  style={{
                    background: "linear-gradient(180deg, #cfc3ff, #8f7bff)",
                    boxShadow: "0 0 24px rgba(143,123,255,0.35)",
                  }}
                >
                  {m.lesson.continueLabel}
                </button>
              )}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
