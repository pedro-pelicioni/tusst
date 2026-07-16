"use client";

import { useCallback, useEffect, useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import {
  connectKitWallet,
  exportLocalSecret,
  fetchXlmBalance,
  fundWithFriendbot,
  generateLocalWallet,
  importLocalWallet,
  loadLocalWallet,
  type ForgeWallet,
} from "@/lib/stellar/wallet";

// Wallet chip + dropdown for the Forge toolbar. Two connection modes:
// a browser-local keypair (testnet only) or a real wallet via the Stellar
// Wallets Kit. All signing stays client-side.

function short(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletMenu({
  wallet,
  onWalletChange,
}: {
  wallet: ForgeWallet | null;
  onWalletChange: (wallet: ForgeWallet | null) => void;
}) {
  const m = useMessages();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [secretDraft, setSecretDraft] = useState("");

  // Restore a saved local wallet on mount.
  useEffect(() => {
    if (!wallet) {
      const saved = loadLocalWallet();
      if (saved) onWalletChange(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet) return;
    try {
      setBalance(await fetchXlmBalance(wallet.address));
    } catch {
      setBalance(null);
    }
  }, [wallet]);

  // Sync from an external system (Horizon) whenever the wallet changes.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setBalance(null);
    refreshBalance();
  }, [wallet, refreshBalance]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const guard = async (label: string, action: () => Promise<void>) => {
    setBusy(label);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : m.ide.wallet.genericError);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`rounded-md border px-3 py-1.5 font-mono text-[11px] transition ${
          wallet
            ? "border-accent2/40 bg-accent2/10 text-accent2 hover:bg-accent2/20"
            : "border-line text-muted2 hover:border-line-strong hover:text-fg"
        }`}
      >
        {wallet ? `${wallet.kind === "local" ? "⚿" : "◈"} ${short(wallet.address)}` : m.ide.wallet.connect}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-line bg-bg-elev p-4 shadow-2xl">
          {wallet ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {wallet.kind === "local" ? m.ide.wallet.localWallet : m.ide.wallet.connectedWallet}
                </p>
                <p className="mt-1 break-all font-mono text-[11px] text-fg">{wallet.address}</p>
                <p className="mt-1 font-mono text-[11px] text-muted2">
                  {balance === null
                    ? m.ide.wallet.notFunded
                    : fmt(m.ide.wallet.balanceXlm, { balance })}
                </p>
              </div>
              {wallet.kind === "local" && (
                <p className="rounded border border-yellow-500/30 bg-yellow-500/5 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-yellow-200/80">
                  {m.ide.wallet.localKeyWarning}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() =>
                    guard("fund", async () => {
                      await fundWithFriendbot(wallet.address);
                      // Horizon can lag a moment behind friendbot — poll a few
                      // times so the balance doesn't flash "not funded yet".
                      for (let i = 0; i < 5; i++) {
                        const value = await fetchXlmBalance(wallet.address);
                        if (value !== null) {
                          setBalance(value);
                          return;
                        }
                        await new Promise((r) => setTimeout(r, 1_200));
                      }
                      await refreshBalance();
                    })
                  }
                  className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
                >
                  {busy === "fund" ? m.ide.wallet.funding : m.ide.wallet.fund}
                </button>
                <button
                  type="button"
                  onClick={refreshBalance}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:text-fg"
                >
                  {m.ide.wallet.refresh}
                </button>
                {wallet.kind === "local" && (
                  <button
                    type="button"
                    onClick={() => {
                      const secret = exportLocalSecret();
                      if (secret) navigator.clipboard?.writeText(secret).catch(() => {});
                    }}
                    className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:text-fg"
                    title={m.ide.wallet.copySecretTitle}
                  >
                    {m.ide.wallet.copySecret}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    wallet.disconnect();
                    onWalletChange(null);
                  }}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:text-red-400"
                >
                  {m.ide.wallet.disconnect}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {m.ide.wallet.chooseMode}
              </p>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() =>
                  guard("kit", async () => {
                    onWalletChange(await connectKitWallet());
                    setOpen(true);
                  })
                }
                className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-left font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
              >
                {busy === "kit" ? m.ide.wallet.connectKitOpening : m.ide.wallet.connectKit}
                <span className="mt-0.5 block text-[10px] text-muted">
                  {m.ide.wallet.connectKitHint}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onWalletChange(generateLocalWallet())}
                className="rounded-md border border-line px-3 py-2 text-left font-mono text-[11px] text-fg transition hover:border-line-strong"
              >
                {m.ide.wallet.generateLocal}
                <span className="mt-0.5 block text-[10px] text-muted">
                  {m.ide.wallet.generateLocalHint}
                </span>
              </button>
              {importing ? (
                <div className="flex flex-col gap-2">
                  <input
                    autoFocus
                    value={secretDraft}
                    onChange={(e) => setSecretDraft(e.target.value)}
                    placeholder={m.ide.wallet.secretPlaceholder}
                    className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        guard("import", async () => {
                          onWalletChange(importLocalWallet(secretDraft));
                          setImporting(false);
                          setSecretDraft("");
                        })
                      }
                      className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent"
                    >
                      {m.ide.wallet.import}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImporting(false)}
                      className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2"
                    >
                      {m.ide.wallet.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setImporting(true)}
                  className="rounded-md border border-line px-3 py-2 text-left font-mono text-[11px] text-muted2 transition hover:text-fg"
                >
                  {m.ide.wallet.importSecret}
                </button>
              )}
            </div>
          )}
          {error && (
            <p className="mt-2 font-mono text-[10px] text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
