"use client";

import { useMemo, useState } from "react";
import { useMessages } from "@/i18n/client";
import {
  EXPLORE_QUERIES,
  type ExploreQueryId,
  type ExploreSource,
} from "@/lib/stellar/explore";
import { JsonTree } from "./JsonTree";
import { SpecArgsFields } from "./SpecArgsFields";

// The Scryer: read-only questions for the network, no wallet involved. Grouped
// by which API answers, because knowing WHICH of the two you are talking to —
// Soroban RPC or Horizon — is half of learning the stack.

export function LedgerPanel() {
  const m = useMessages();
  const [id, setId] = useState<ExploreQueryId>(EXPLORE_QUERIES[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  // Typing the catalog against ExploreQueryId is what makes a missing label a
  // build failure rather than "undefined" in the dropdown.
  const list: Record<ExploreQueryId, { label: string; doc: string }> =
    m.ide.explorer.list;

  const query = useMemo(
    () => EXPLORE_QUERIES.find((q) => q.id === id) ?? EXPLORE_QUERIES[0],
    [id],
  );

  const grouped = useMemo(() => {
    const out: Record<ExploreSource, typeof EXPLORE_QUERIES> = {
      rpc: [],
      horizon: [],
    };
    for (const q of EXPLORE_QUERIES) out[q.source].push(q);
    return out;
  }, []);

  const run = async () => {
    setRunning(true);
    setError("");
    try {
      setResult(await query.run(values));
    } catch (e) {
      setResult(null);
      setError(
        e instanceof Error ? `${m.ide.explorer.error} — ${e.message}` : m.ide.explorer.error,
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <label className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {m.ide.explorer.pick}
        </span>
        <select
          value={id}
          onChange={(e) => {
            setId(e.target.value as ExploreQueryId);
            setValues({});
            setResult(null);
            setError("");
          }}
          className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
        >
          {(["rpc", "horizon"] as const).map((source) => (
            <optgroup key={source} label={m.ide.explorer.sources[source]}>
              {grouped[source].map((q) => (
                <option key={q.id} value={q.id}>
                  {list[q.id].label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <p className="mt-2 text-[11.5px] leading-relaxed text-muted2">
        {list[query.id].doc}
      </p>

      {query.fields.length > 0 && (
        <div className="mt-3">
          <SpecArgsFields
            fields={query.fields}
            values={values}
            onChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => void run()}
        disabled={running}
        className="mt-3 w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
      >
        {running ? m.ide.explorer.running : m.ide.explorer.run}
      </button>

      {error && (
        <p className="mt-3 break-words text-[11.5px] leading-relaxed text-ember">
          {error}
        </p>
      )}

      <div className="mt-4">
        {result === null && !error ? (
          <p className="font-mono text-[10.5px] leading-relaxed text-muted">
            {m.ide.explorer.empty}
          </p>
        ) : result !== null ? (
          <JsonTree value={result} defaultDepth={2} />
        ) : null}
      </div>
    </div>
  );
}
