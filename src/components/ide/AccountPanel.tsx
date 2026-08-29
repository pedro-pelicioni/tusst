"use client";

import { useCallback, useEffect, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { fetchAccountSummary, type AccountSummary } from "@/lib/stellar/account";
import { explorerAccountUrl } from "@/lib/stellar/network";
import { fundWithFriendbot, type ForgeWallet } from "@/lib/stellar/wallet";

// The Ledger Sheet. Everything the Anvil's operations act on, in one place:
// what you hold, what is locked behind the reserve, who may sign, and at what
// weight. Without it, op_low_reserve and op_bad_auth are riddles.

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="min-w-0 truncate text-right font-mono text-[11px] text-fg">
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 border-t border-line pt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {title}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function AccountPanel({ wallet }: { wallet: ForgeWallet | null }) {
  const m = useMessages();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [funding, setFunding] = useState(false);
  const [error, setError] = useState("");

  const address = wallet?.address ?? null;

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      setSummary(await fetchAccountSummary(address));
    } catch {
      setError(m.ide.account.error);
    } finally {
      setLoading(false);
    }
  }, [address, m.ide.account.error]);

  // Fetching from Horizon on mount / address change — a genuine data effect,
  // not derived state (same carve-out the other panels use).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const fund = async () => {
    if (!address) return;
    setFunding(true);
    setError("");
    try {
      await fundWithFriendbot(address);
      // Horizon lags the ledger by a moment after funding.
      await new Promise((r) => setTimeout(r, 1200));
      await load();
    } catch {
      setError(m.ide.account.error);
    } finally {
      setFunding(false);
    }
  };

  if (!wallet || !address) {
    return (
      <p className="px-4 py-4 font-mono text-[11px] leading-relaxed text-muted">
        {m.ide.account.connectFirst}
      </p>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <a
          href={explorerAccountUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 truncate font-mono text-[11px] text-accent2 underline-offset-2 hover:underline"
          title={address}
        >
          {address.slice(0, 8)}…{address.slice(-6)}
        </a>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="shrink-0 rounded border border-line px-2 py-1 font-mono text-[10px] text-muted2 transition hover:border-line-strong hover:text-fg disabled:opacity-50"
        >
          {m.ide.account.refresh}
        </button>
      </div>

      {error && (
        <p className="mt-3 font-mono text-[11px] text-ember">{error}</p>
      )}

      {summary === null && !loading && (
        <div className="mt-4">
          <p className="text-[12px] leading-relaxed text-muted2">
            {m.ide.account.notFunded}
          </p>
          <button
            type="button"
            onClick={() => void fund()}
            disabled={funding}
            className="mt-3 rounded-md border border-accent2/40 bg-accent2/10 px-3 py-1.5 font-mono text-[11px] text-accent2 transition hover:bg-accent2/20 disabled:opacity-50"
          >
            {funding ? m.ide.account.funding : m.ide.account.fund}
          </button>
        </div>
      )}

      {summary && (
        <>
          <div className="mt-3">
            <Row label={m.ide.account.balance} value={`${summary.nativeBalance} XLM`} />
            <Row label={m.ide.account.spendable} value={`${summary.spendable} XLM`} />
            <Row
              label={m.ide.account.reserve}
              value={`${summary.minimumReserve} XLM`}
            />
            <p className="pb-1 font-mono text-[9.5px] leading-relaxed text-muted">
              {fmt(m.ide.account.reserveHelp, {
                entries: Number(summary.minimumReserve) / 0.5,
              })}
            </p>
            <Row label={m.ide.account.sequence} value={summary.sequence} />
            {summary.homeDomain && (
              <Row label={m.ide.account.homeDomain} value={summary.homeDomain} />
            )}
          </div>

          <Section title={m.ide.account.trustlines}>
            {summary.balances.filter((b) => !b.isNative).length === 0 ? (
              <p className="font-mono text-[10.5px] text-muted">
                {m.ide.account.noTrustlines}
              </p>
            ) : (
              summary.balances
                .filter((b) => !b.isNative)
                .map((b) => (
                  <Row
                    key={`${b.assetCode}:${b.issuer}`}
                    label={b.assetCode}
                    value={`${b.balance}${b.limit ? ` / ${b.limit}` : ""}`}
                  />
                ))
            )}
          </Section>

          <Section title={m.ide.account.signers}>
            {summary.signers.map((s) => (
              <Row
                key={s.key}
                label={`${s.key.slice(0, 6)}…${s.key.slice(-4)}`}
                value={`w ${s.weight}`}
              />
            ))}
          </Section>

          <Section title={m.ide.account.thresholds}>
            <Row
              label="low / med / high"
              value={`${summary.thresholds.low} / ${summary.thresholds.med} / ${summary.thresholds.high}`}
            />
          </Section>

          <a
            href={explorerAccountUrl(address)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block font-mono text-[10.5px] text-accent underline-offset-2 hover:underline"
          >
            {m.ide.account.explorer}
          </a>
        </>
      )}
    </div>
  );
}
