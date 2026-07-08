"use client";

import { useState } from "react";
import { isValidForgePath, MAX_PROJECT_FILES } from "@/lib/soroban/paths";

// Flat file list (Cargo.toml + src/**) with add/delete. Client-side rules
// mirror the server validator so the API never rejects what the tree allowed.

const PROTECTED_FILES = new Set(["Cargo.toml", "src/lib.rs"]);

function sortPaths(paths: string[]): string[] {
  return [...paths].sort((a, b) => {
    if (a === "Cargo.toml") return -1;
    if (b === "Cargo.toml") return 1;
    return a.localeCompare(b);
  });
}

export function FileTree({
  files,
  activeFile,
  onSelect,
  onAdd,
  onDelete,
}: {
  files: string[];
  activeFile: string;
  onSelect: (path: string) => void;
  onAdd: (path: string) => void;
  onDelete: (path: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("src/");
  const [error, setError] = useState("");

  const submitAdd = () => {
    const path = draft.trim();
    if (!isValidForgePath(path)) {
      setError("only Cargo.toml and src/** paths");
      return;
    }
    if (files.includes(path)) {
      setError("file already exists");
      return;
    }
    if (files.length >= MAX_PROJECT_FILES) {
      setError(`max ${MAX_PROJECT_FILES} files`);
      return;
    }
    onAdd(path);
    setAdding(false);
    setDraft("src/");
    setError("");
  };

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto p-2">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          files
        </span>
        <button
          type="button"
          onClick={() => {
            setAdding((v) => !v);
            setError("");
          }}
          className="rounded border border-line px-1.5 font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
          title="new file"
        >
          +
        </button>
      </div>

      {adding && (
        <div className="px-2 pb-1">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="src/module.rs"
            className="w-full rounded border border-line bg-bg px-2 py-1 font-mono text-[11px] text-fg outline-none focus:border-accent/60"
          />
          {error && (
            <p className="mt-1 font-mono text-[10px] text-red-400">{error}</p>
          )}
        </div>
      )}

      <ul className="flex flex-col">
        {sortPaths(files).map((path) => (
          <li key={path} className="group flex items-center">
            <button
              type="button"
              onClick={() => onSelect(path)}
              className={`flex-1 truncate rounded px-2 py-1 text-left font-mono text-[12px] transition ${
                path === activeFile
                  ? "bg-accent/10 text-accent"
                  : "text-muted2 hover:text-fg"
              }`}
              title={path}
            >
              {path}
            </button>
            {!PROTECTED_FILES.has(path) && (
              <button
                type="button"
                onClick={() => onDelete(path)}
                className="hidden rounded px-1 font-mono text-[11px] text-muted2 transition hover:text-red-400 group-hover:block"
                title={`delete ${path}`}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
