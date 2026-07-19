"use client";

import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useMessages } from "@/i18n/client";

// Multi-file Monaco pane. The `path` prop keys one Monaco model per file, so
// switching files preserves undo history and view state per model. Theme and
// options match the lesson player's editor for a consistent look.

function languageFor(path: string): string {
  if (path.endsWith(".rs")) return "rust";
  if (path.endsWith(".toml")) return "toml";
  return "plaintext";
}

export function EditorPane({
  path,
  value,
  onChange,
  onRun,
  onSave,
  fontSize = 13,
}: {
  path: string;
  value: string;
  onChange: (value: string) => void;
  /** ⌘⏎ — build the project. */
  onRun: () => void;
  /** ⌘S — flush the draft to storage. */
  onSave: () => void;
  /** The compact (mobile) shell passes 16 — anything smaller makes iOS Safari zoom in when the editor focuses. */
  fontSize?: number;
}) {
  const m = useMessages();
  // Refs keep the Monaco commands pointed at fresh callbacks (commands are
  // registered once in onMount; state inside them would go stale).
  const runRef = useRef(onRun);
  const saveRef = useRef(onSave);
  useEffect(() => {
    runRef.current = onRun;
    saveRef.current = onSave;
  }, [onRun, onSave]);

  const onMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("tusst", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d0d14",
        "editorGutter.background": "#0d0d14",
      },
    });
    monaco.editor.setTheme("tusst");
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () =>
      runRef.current(),
    );
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
      saveRef.current(),
    );
  };

  return (
    <Editor
      height="100%"
      path={path}
      language={languageFor(path)}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={onMount}
      theme="vs-dark"
      loading={
        <div className="grid h-full w-full place-items-center font-mono text-xs text-muted">
          {m.ide.editor.loading}
        </div>
      }
      options={{
        minimap: { enabled: false },
        fontSize,
        lineHeight: Math.round(fontSize * 1.7),
        scrollBeyondLastLine: false,
        tabSize: 4,
        padding: { top: 14 },
        automaticLayout: true,
        renderLineHighlight: "none",
        overviewRulerLanes: 0,
      }}
    />
  );
}
