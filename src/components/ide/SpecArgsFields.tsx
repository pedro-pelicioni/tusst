"use client";

import { useState } from "react";
import type { SpecField } from "@/lib/stellar/spec-form";

// Shared typed-argument fields — one input row per parameter. Serves three
// callers on the same shape: the deploy constructor form, the contract
// invocation form, and (since the Anvil) every classic operation form.
//
// The `asset` control edits ONE string: "native" or "CODE:ISSUER". Keeping
// assets in a single value is what lets a composite control live inside a
// plain Record<string, string> form without a second state layer.

function AssetField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [code, issuer] = value.includes(":") ? value.split(":") : ["", ""];
  // Mode is pure UI state: an in-progress custom asset has no parseable value
  // yet, so it cannot be derived from the string without snapping back.
  const [custom, setCustom] = useState(value.includes(":"));

  const emit = (nextCode: string, nextIssuer: string) =>
    onChange(nextCode || nextIssuer ? `${nextCode}:${nextIssuer}` : "");

  return (
    <div className="flex flex-col gap-1">
      <select
        value={custom ? "custom" : "native"}
        onChange={(e) => {
          const isCustom = e.target.value === "custom";
          setCustom(isCustom);
          if (!isCustom) onChange("");
        }}
        className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
      >
        <option value="native">native (XLM)</option>
        <option value="custom">issued asset</option>
      </select>
      {custom && (
        <div className="flex gap-1">
          <input
            value={code}
            onChange={(e) => emit(e.target.value.trim(), issuer)}
            placeholder="CODE"
            className="w-24 rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
          />
          <input
            value={issuer}
            onChange={(e) => emit(code, e.target.value.trim())}
            placeholder="G… issuer"
            className="min-w-0 flex-1 rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
          />
        </div>
      )}
    </div>
  );
}

export function SpecArgsFields({
  fields,
  values,
  onChange,
}: {
  fields: SpecField[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1">
          <span className="flex items-baseline justify-between font-mono text-[10px]">
            <span className="text-muted2">
              {field.name}
              {field.optional && <span className="text-muted"> ?</span>}
            </span>
            <span className="text-muted">{field.typeLabel}</span>
          </span>
          {field.kind === "asset" ? (
            <AssetField
              value={values[field.name] ?? ""}
              onChange={(v) => onChange(field.name, v)}
            />
          ) : field.kind === "bool" ? (
            <select
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
            >
              <option value="">—</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : field.kind === "json" ? (
            <textarea
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={2}
              className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
            />
          ) : (
            <input
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              inputMode={
                field.kind === "amount"
                  ? "decimal"
                  : field.kind === "number" || field.kind === "bigint"
                    ? "numeric"
                    : "text"
              }
              className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
            />
          )}
          {field.help && (
            <span className="font-mono text-[9.5px] leading-relaxed text-muted">
              {field.help}
            </span>
          )}
        </label>
      ))}
    </div>
  );
}
