"use client";

import type { SpecField } from "@/lib/stellar/spec-form";

// Shared typed-argument fields for the deploy (constructor) and interact
// (function invocation) forms — one input row per spec parameter.

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
            <span className="text-muted2">{field.name}</span>
            <span className="text-muted">{field.typeLabel}</span>
          </span>
          {field.kind === "bool" ? (
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
              inputMode={field.kind === "number" || field.kind === "bigint" ? "numeric" : "text"}
              className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
            />
          )}
        </label>
      ))}
    </div>
  );
}
