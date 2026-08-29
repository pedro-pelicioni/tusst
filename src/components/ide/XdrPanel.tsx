"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";
import { getLastEnvelope } from "@/lib/forge-store";
import {
  decodeXdr,
  XdrDecodeError,
  type XdrFlavor,
} from "@/lib/stellar/xdr-tools";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { JsonTree } from "./JsonTree";

// The Rune Reader. Paste base64, see the transaction — and, because the Anvil
// stashes the envelope it just assembled, "load the last one" turns the whole
// thing into a before-you-sign inspection: this is the object your key is
// about to endorse, operation by operation.

const FLAVORS: XdrFlavor[] = ["envelope", "scval", "result"];

export function XdrPanel({ wallet }: { wallet: ForgeWallet | null }) {
  const m = useMessages();
  const [raw, setRaw] = useState("");
  const [flavor, setFlavor] = useState<XdrFlavor>("envelope");
  const [decoded, setDecoded] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const decode = (input: string, kind: XdrFlavor) => {
    setSigned(false);
    if (input.trim() === "") {
      setDecoded(null);
      setError("");
      return;
    }
    try {
      setDecoded(decodeXdr(input, kind));
      setError("");
    } catch (e) {
      setDecoded(null);
      setError(
        e instanceof XdrDecodeError
          ? `${m.ide.xdr.error} — ${e.message}`
          : m.ide.xdr.error,
      );
    }
  };

  const loadLast = () => {
    const last = getLastEnvelope();
    if (!last) return;
    setRaw(last);
    setFlavor("envelope");
    decode(last, "envelope");
  };

  const sign = async () => {
    if (!wallet || raw.trim() === "") return;
    setSigning(true);
    setError("");
    try {
      const signedXdr = await wallet.signTransaction(raw.trim());
      setRaw(signedXdr);
      decode(signedXdr, "envelope");
      setSigned(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : m.ide.xdr.error);
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <label className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {m.ide.xdr.paste}
        </span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={m.ide.xdr.placeholder}
          rows={4}
          spellCheck={false}
          className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[10.5px] break-all text-fg outline-none focus:border-accent/60"
        />
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          value={flavor}
          onChange={(e) => {
            const next = e.target.value as XdrFlavor;
            setFlavor(next);
            decode(raw, next);
          }}
          className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
        >
          {FLAVORS.map((f) => (
            <option key={f} value={f}>
              {m.ide.xdr.flavor[f]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => decode(raw, flavor)}
          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20"
        >
          {m.ide.xdr.decode}
        </button>
        <button
          type="button"
          onClick={() => {
            setRaw("");
            setDecoded(null);
            setError("");
            setSigned(false);
          }}
          className="font-mono text-[10.5px] text-muted transition hover:text-fg"
        >
          {m.ide.xdr.clear}
        </button>
      </div>

      <button
        type="button"
        onClick={loadLast}
        className="mt-2 block font-mono text-[10.5px] text-accent2 underline-offset-2 transition hover:underline"
      >
        {m.ide.xdr.loadLast}
      </button>

      {wallet && flavor === "envelope" && raw.trim() !== "" && (
        <button
          type="button"
          onClick={() => void sign()}
          disabled={signing}
          className="mt-3 w-full rounded-md border border-accent2/40 bg-accent2/10 px-3 py-1.5 font-mono text-[11px] text-accent2 transition hover:bg-accent2/20 disabled:opacity-50"
        >
          {signing ? m.ide.xdr.signing : m.ide.xdr.sign}
        </button>
      )}

      {signed && (
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-pop">
          {m.ide.xdr.signed}
        </p>
      )}

      {error && (
        <p className="mt-3 text-[11.5px] leading-relaxed text-ember">{error}</p>
      )}

      <div className="mt-4">
        {decoded === null && !error ? (
          <p className="font-mono text-[10.5px] leading-relaxed text-muted">
            {m.ide.xdr.empty}
          </p>
        ) : decoded !== null ? (
          <JsonTree value={decoded} defaultDepth={3} />
        ) : null}
      </div>
    </div>
  );
}
