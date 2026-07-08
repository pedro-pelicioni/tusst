"use client";

import { useState } from "react";
import type { ForgeProjectMeta } from "@/lib/forge-store";
import { forgeTemplates } from "@/content/soroban-templates";

// Project switcher + template picker, rendered as a left overlay drawer.
// Projects live in localStorage (v1) — this is pure presentation.

export function ProjectDrawer({
  open,
  projects,
  activeId,
  onClose,
  onOpenProject,
  onCreate,
  onRename,
  onDelete,
}: {
  open: boolean;
  projects: ForgeProjectMeta[];
  activeId: string | null;
  onClose: () => void;
  onOpenProject: (id: string) => void;
  onCreate: (name: string, templateId: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState(forgeTemplates[0].id);

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim() || "untitled contract";
    onCreate(trimmed, templateId);
    setCreating(false);
    setName("");
  };

  return (
    <div className="absolute inset-0 z-20 flex">
      <div className="flex w-80 flex-col border-r border-line bg-bg-elev shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            projects
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-1.5 font-mono text-[12px] text-muted2 transition hover:text-fg"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {projects.length === 0 && (
            <p className="px-2 py-3 font-mono text-[11px] text-muted">
              {"// no projects yet — create one below"}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {projects.map((p) => (
              <li key={p.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOpenProject(p.id)}
                  className={`flex-1 truncate rounded px-2 py-1.5 text-left font-mono text-[12px] transition ${
                    p.id === activeId
                      ? "bg-accent/10 text-accent"
                      : "text-muted2 hover:text-fg"
                  }`}
                >
                  {p.name}
                  <span className="ml-2 text-[10px] text-muted">{p.template}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = window.prompt("rename project", p.name);
                    if (next?.trim()) onRename(p.id, next.trim());
                  }}
                  className="hidden rounded px-1 font-mono text-[11px] text-muted2 hover:text-fg group-hover:block"
                  title="rename"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`delete "${p.name}"? this can't be undone.`))
                      onDelete(p.id);
                  }}
                  className="hidden rounded px-1 font-mono text-[11px] text-muted2 hover:text-red-400 group-hover:block"
                  title="delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line p-3">
          {creating ? (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="project name"
                className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[12px] text-fg outline-none focus:border-accent/60"
              />
              <div className="flex flex-col gap-1">
                {forgeTemplates.map((t) => (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-start gap-2 rounded border px-2 py-1.5 transition ${
                      templateId === t.id
                        ? "border-accent/40 bg-accent/5"
                        : "border-line hover:border-line-strong"
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      checked={templateId === t.id}
                      onChange={() => setTemplateId(t.id)}
                      className="mt-0.5 accent-[#8f7bff]"
                    />
                    <span>
                      <span className="block font-mono text-[12px] text-fg">{t.name}</span>
                      <span className="block text-[11px] text-muted">{t.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submit}
                  className="flex-1 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20"
                >
                  create
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:text-fg"
                >
                  cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20"
            >
              + new project
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="close project drawer"
        onClick={onClose}
        className="flex-1 bg-black/40"
      />
    </div>
  );
}
