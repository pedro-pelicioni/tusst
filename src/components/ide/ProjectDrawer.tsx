"use client";

import { useState } from "react";
import { useMessages } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import type { ForgeProjectMeta } from "@/lib/forge-store";
import type { SorobanFileMap } from "@/lib/soroban/types";
import { forgeTemplates } from "@/content/soroban-templates";
import {
  GithubImportError,
  importFromGithub,
  type GithubImportPreview,
} from "@/lib/github-import";

// Project switcher + template picker + GitHub import, rendered as a left
// overlay drawer. Projects live in localStorage (v1) — this is pure
// presentation except for the import fetch itself.

export function ProjectDrawer({
  open,
  projects,
  activeId,
  onClose,
  onOpenProject,
  onCreate,
  onImport,
  onRename,
  onDelete,
}: {
  open: boolean;
  projects: ForgeProjectMeta[];
  activeId: string | null;
  onClose: () => void;
  onOpenProject: (id: string) => void;
  onCreate: (name: string, templateId: string) => void;
  onImport: (name: string, files: SorobanFileMap) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const m = useMessages();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState(forgeTemplates[0].id);
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState("");
  const [preview, setPreview] = useState<GithubImportPreview | null>(null);
  const [importName, setImportName] = useState("");

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim() || m.ide.drawer.untitledName;
    onCreate(trimmed, templateId);
    setCreating(false);
    setName("");
  };

  const resetImport = () => {
    setImporting(false);
    setImportUrl("");
    setImportError("");
    setPreview(null);
    setImportName("");
  };

  const runImport = async () => {
    if (importBusy || importUrl.trim() === "") return;
    setImportBusy(true);
    setImportError("");
    setPreview(null);
    try {
      const result = await importFromGithub(importUrl);
      setPreview(result);
      setImportName(result.name);
    } catch (e) {
      setImportError(
        e instanceof GithubImportError ? e.message : m.ide.drawer.importFailed,
      );
    } finally {
      setImportBusy(false);
    }
  };

  const previewKb = preview
    ? Math.max(
        1,
        Math.round(
          Object.values(preview.files).reduce((sum, c) => sum + c.length, 0) / 1024,
        ),
      )
    : 0;

  return (
    <div className="absolute inset-0 z-20 flex">
      <div className="flex w-80 flex-col border-r border-line bg-bg-elev shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {m.ide.drawer.title}
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
              {m.ide.drawer.empty}
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
                    const next = window.prompt(m.ide.drawer.renamePrompt, p.name);
                    if (next?.trim()) onRename(p.id, next.trim());
                  }}
                  className="hidden rounded px-1 font-mono text-[11px] text-muted2 hover:text-fg group-hover:block"
                  title={m.ide.drawer.renameTitle}
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(fmt(m.ide.drawer.deleteConfirm, { name: p.name })))
                      onDelete(p.id);
                  }}
                  className="hidden rounded px-1 font-mono text-[11px] text-muted2 hover:text-red-400 group-hover:block"
                  title={m.ide.drawer.deleteTitle}
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
                placeholder={m.ide.drawer.namePlaceholder}
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
                  {m.ide.drawer.create}
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:text-fg"
                >
                  {m.ide.drawer.cancel}
                </button>
              </div>
            </div>
          ) : importing ? (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runImport()}
                placeholder="github.com/owner/repo[/tree/branch/folder]"
                className="rounded border border-line bg-bg px-2 py-1.5 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
              />
              {importError && (
                <p className="font-mono text-[10px] text-red-400">{importError}</p>
              )}
              {preview && (
                <div className="flex flex-col gap-1.5 rounded border border-line bg-bg px-2 py-2">
                  <input
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="rounded border border-line bg-bg-elev px-2 py-1 font-mono text-[12px] text-fg outline-none focus:border-accent/60"
                  />
                  <p className="font-mono text-[10px] text-muted">
                    {fmt(m.ide.drawer.importSummary, {
                      count: Object.keys(preview.files).length,
                      kb: previewKb,
                    })}
                  </p>
                  {preview.warnings.map((w, i) => (
                    <p key={i} className="font-mono text-[10px] text-amber-400/90">
                      ⚠ {w}
                    </p>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                {preview ? (
                  <button
                    type="button"
                    onClick={() => {
                      onImport(importName.trim() || preview.name, preview.files);
                      resetImport();
                    }}
                    className="flex-1 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20"
                  >
                    {m.ide.drawer.createProject}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={runImport}
                    disabled={importBusy || importUrl.trim() === ""}
                    className="flex-1 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
                  >
                    {importBusy ? m.ide.drawer.fetching : m.ide.drawer.fetch}
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetImport}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:text-fg"
                >
                  {m.ide.drawer.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-accent transition hover:bg-accent/20"
              >
                {m.ide.drawer.newProject}
              </button>
              <button
                type="button"
                onClick={() => setImporting(true)}
                className="w-full rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:border-accent/40 hover:text-accent"
              >
                {m.ide.drawer.importFromGithub}
              </button>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label={m.ide.drawer.closeDrawer}
        onClick={onClose}
        className="flex-1 bg-black/40"
      />
    </div>
  );
}
