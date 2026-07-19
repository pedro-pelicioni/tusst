"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import type { SorobanFileMap } from "@/lib/soroban/types";
import {
  createProject,
  deleteProject,
  getTutorialSeen,
  listProjects,
  loadProject,
  renameProject,
  saveProject,
  setTutorialSeen,
  type ForgeProjectMeta,
} from "@/lib/forge-store";
import { forgeTemplates, templateById } from "@/content/soroban-templates";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { BuildToolbar } from "./BuildToolbar";
import { ConsolePane } from "./ConsolePane";
import { DeployPanel } from "./DeployPanel";
import { EditorPane } from "./EditorPane";
import { ExplorePanel } from "./ExplorePanel";
import { FileTree } from "./FileTree";
import { IdeTutorial } from "./IdeTutorial";
import { InteractPanel } from "./InteractPanel";
import { ProjectDrawer } from "./ProjectDrawer";
import { WalletMenu } from "./WalletMenu";
import { useForgeRun } from "./use-forge-run";

// Top-level client state for the Forge IDE: active project + files (from
// localStorage), the sandbox run pipeline, and the pane layout.
//
//   ┌ toolbar ────────────────────────────────────────────┐
//   │ files │ editor                        │ deploy /    │
//   │       ├────────────────────────────────  interact   │
//   │       │ console                       │  (panel)    │
//   └───────┴────────────────────────────────┴────────────┘

export function IdeShell() {
  const m = useMessages();
  const [projects, setProjects] = useState<ForgeProjectMeta[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [files, setFiles] = useState<SorobanFileMap>({});
  const [activeFile, setActiveFile] = useState("src/lib.rs");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [wallet, setWallet] = useState<ForgeWallet | null>(null);
  const [panelTab, setPanelTab] = useState<"deploy" | "interact" | "explore">("deploy");
  const [lastContractId, setLastContractId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const { status, mode, lines, wasm, running, run, cancel } = useForgeRun();

  function openProject(id: string, metas?: ForgeProjectMeta[]) {
    const data = loadProject(id);
    if (!data) return;
    setProjectId(id);
    setFiles(data.files);
    setActiveFile(data.files[data.activeFile] !== undefined ? data.activeFile : "src/lib.rs");
    setDrawerOpen(false);
    if (metas) setProjects(metas);
  }

  // First mount: hydrate from localStorage (browser-only external store, so
  // this must be an effect); seed a starter project when empty.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let metas = listProjects();
    if (metas.length === 0) {
      const template = templateById("hello-world");
      createProject(m.ide.shell.defaultProjectName, template.id, template.files);
      metas = listProjects();
    }
    setProjects(metas);
    openProject(metas[0].id, metas);
    setLoaded(true);
    if (!getTutorialSeen()) setShowTutorial(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const dismissTutorial = useCallback(() => {
    setTutorialSeen();
    setShowTutorial(false);
  }, []);

  // Debounced autosave of the working copy.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persist = useCallback(
    (id: string | null, nextFiles: SorobanFileMap, nextActive: string) => {
      if (!id) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveProject(id, { files: nextFiles, activeFile: nextActive });
        setProjects(listProjects());
      }, 500);
    },
    [],
  );

  const updateFile = (path: string, contents: string) => {
    const next = { ...files, [path]: contents };
    setFiles(next);
    persist(projectId, next, activeFile);
  };

  const addFile = (path: string) => {
    const next = { ...files, [path]: "" };
    setFiles(next);
    setActiveFile(path);
    persist(projectId, next, path);
  };

  const removeFile = (path: string) => {
    const next = { ...files };
    delete next[path];
    const nextActive = activeFile === path ? "src/lib.rs" : activeFile;
    setFiles(next);
    setActiveFile(nextActive);
    persist(projectId, next, nextActive);
  };

  const saveNow = useCallback(() => {
    if (!projectId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveProject(projectId, { files, activeFile });
    setProjects(listProjects());
  }, [projectId, files, activeFile]);

  const downloadWasm = () => {
    if (!wasm) return;
    const blob = new Blob([wasm.buffer as ArrayBuffer], { type: "application/wasm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract.wasm";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeProject = projects.find((p) => p.id === projectId);

  if (!loaded) {
    return (
      <div className="grid h-full place-items-center font-mono text-xs text-muted">
        {m.ide.shell.loading}
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-bg">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-line bg-bg-elev px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            data-tutorial-id="projects"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
          >
            ☰ {m.ide.shell.projects}
          </button>
          <span className="truncate font-mono text-[12px] text-fg">
            {activeProject?.name ?? "…"}
          </span>
          <span className="rounded-full border border-accent2/40 bg-accent2/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent2">
            testnet
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div data-tutorial-id="build" className="flex items-center gap-2">
            <BuildToolbar
              status={status}
              running={running}
              hasWasm={wasm !== null}
              onBuild={() => run("build", files)}
              onTest={() => run("test", files)}
              onAudit={() => run("audit", files)}
              onCancel={cancel}
              onDownload={downloadWasm}
            />
          </div>
          <div className="h-5 w-px bg-line" />
          <div data-tutorial-id="wallet">
            <WalletMenu wallet={wallet} onWalletChange={setWallet} />
          </div>
          <button
            type="button"
            title={m.ide.tutorial.reopenTitle}
            aria-label={m.ide.tutorial.reopenTitle}
            onClick={() => setShowTutorial(true)}
            className="grid h-7 w-7 place-items-center rounded-full border border-line font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
          >
            ?
          </button>
        </div>
      </div>

      {/* panes */}
      <div className="flex min-h-0 flex-1">
        <aside data-tutorial-id="fileTree" className="w-52 shrink-0 border-r border-line bg-bg-elev">
          <FileTree
            files={Object.keys(files)}
            activeFile={activeFile}
            onSelect={(path) => {
              setActiveFile(path);
              persist(projectId, files, path);
            }}
            onAdd={addFile}
            onDelete={removeFile}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div data-tutorial-id="editor" className="min-h-0 flex-1">
            <EditorPane
              path={activeFile}
              value={files[activeFile] ?? ""}
              onChange={(v) => updateFile(activeFile, v)}
              onRun={() => run("build", files)}
              onSave={saveNow}
            />
          </div>
          <div data-tutorial-id="console" className="h-56 shrink-0 border-t border-line">
            <ConsolePane lines={lines} status={status} mode={mode} files={files} />
          </div>
        </div>

        <aside data-tutorial-id="panels" className="flex w-[360px] shrink-0 flex-col border-l border-line bg-bg-elev">
          <div className="flex border-b border-line">
            {(["deploy", "interact", "explore"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPanelTab(tab)}
                className={`flex-1 px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
                  panelTab === tab
                    ? "border-b border-accent text-accent"
                    : "text-muted hover:text-fg"
                }`}
              >
                {m.ide.shell.tabs[tab]}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {panelTab === "deploy" ? (
              <DeployPanel
                wasm={wasm}
                wallet={wallet}
                onDeployed={(contractId) => {
                  setLastContractId(contractId);
                  setPanelTab("interact");
                }}
              />
            ) : panelTab === "interact" ? (
              <InteractPanel wallet={wallet} prefillContractId={lastContractId} />
            ) : (
              <ExplorePanel wallet={wallet} />
            )}
          </div>
        </aside>
      </div>

      {/* in memoriam — James Bachini, creator of the Soroban Playground */}
      <div className="flex shrink-0 items-center justify-center gap-1.5 border-t border-line bg-bg-elev px-4 py-1.5">
        <span className="font-mono text-[10px] text-muted">
          ✦ {m.ide.shell.memorialInMemoryOf}{" "}
          <span className="text-muted2">James Bachini</span>{" "}
          {m.ide.shell.memorialLegacy}{" "}
          <a
            href="https://github.com/jamesbachini/Soroban-Playground"
            target="_blank"
            rel="noreferrer"
            className="text-accent/80 underline-offset-2 transition hover:text-accent hover:underline"
          >
            {m.ide.shell.memorialLink}
          </a>
        </span>
      </div>

      <ProjectDrawer
        open={drawerOpen}
        projects={projects}
        activeId={projectId}
        onClose={() => setDrawerOpen(false)}
        onOpenProject={(id) => openProject(id)}
        onCreate={(name, tid) => {
          const meta = createProject(name, tid, templateById(tid).files);
          openProject(meta.id, listProjects());
        }}
        onImport={(name, importedFiles) => {
          const meta = createProject(name, "github-import", importedFiles);
          openProject(meta.id, listProjects());
        }}
        onRename={(id, name) => {
          renameProject(id, name);
          setProjects(listProjects());
        }}
        onDelete={(id) => {
          deleteProject(id);
          const metas = listProjects();
          setProjects(metas);
          if (id === projectId) {
            if (metas.length > 0) openProject(metas[0].id);
            else {
              const template = forgeTemplates[0];
              const meta = createProject(m.ide.shell.defaultProjectName, template.id, template.files);
              openProject(meta.id, listProjects());
            }
          }
        }}
      />

      {showTutorial && <IdeTutorial onDone={dismissTutorial} />}
    </div>
  );
}
