"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMessages } from "@/i18n/client";
import type { SorobanFileMap } from "@/lib/soroban/types";
import {
  createProject,
  deleteProject,
  getMobileNoticeSeen,
  getMobileTutorialSeen,
  getTutorialSeen,
  listProjects,
  loadProject,
  renameProject,
  saveProject,
  setMobileNoticeSeen,
  setMobileTutorialSeen,
  setTutorialSeen,
  type ForgeProjectMeta,
  IDE_LAYOUT_DEFAULTS,
} from "@/lib/forge-store";
import { forgeTemplates, templateById } from "@/content/soroban-templates";
import { forgeCompactOverride } from "@/lib/device";
import type { ForgeWallet } from "@/lib/stellar/wallet";
import { BuildToolbar } from "./BuildToolbar";
import { ConsolePane } from "./ConsolePane";
import { RavenPanel } from "./RavenPanel";
import { DeployPanel } from "./DeployPanel";
import { EditorPane, type ForgeEditor } from "./EditorPane";
import { ExplorePanel } from "./ExplorePanel";
import { FileTree } from "./FileTree";
import { IdeTutorial, type TutorialStep } from "./IdeTutorial";
import { InteractPanel } from "./InteractPanel";
import { AccountPanel } from "./AccountPanel";
import { LabDrawer, type ForgeLabSummary } from "./LabDrawer";
import { LedgerPanel } from "./LedgerPanel";
import { XdrPanel } from "./XdrPanel";
import { OpsPanel } from "./OpsPanel";
import { MobileNotice } from "./MobileNotice";
import { PaneRail } from "./PaneRail";
import { ProjectDrawer } from "./ProjectDrawer";
import { Splitter } from "./Splitter";
import { WalletMenu } from "./WalletMenu";
import { PANE_LIMITS, useIdeLayout, useIdeShortcuts } from "./useIdeLayout";
import { useForgeRun } from "./use-forge-run";

// Top-level client state for the Forge IDE: active project + files (from
// localStorage), the sandbox run pipeline, and the pane layout.
//
// Desktop is the full smithy:
//
//   ┌ toolbar ────────────────────────────────────────────┐
//   │ files │ editor                        │ deploy /    │
//   │       ├────────────────────────────────  interact   │
//   │       │ console                       │  (panel)    │
//   └───────┴────────────────────────────────┴────────────┘
//
// Every pane collapses (⌘B files · ⌘⌥B panel · ⌘J console), every divider
// drags, and the sizes persist. Between 768px and 1279px the side panes stop
// being columns and float over the editor instead — three fixed columns left
// the editor a ~330px strip and pushed the right panel off-screen, clipped by
// the route layout's overflow-hidden with no scrollbar to reach it.
//
// Below 768px the compact Forge takes over — essentials only (editor,
// build/test, console, projects), one pane at a time, no wallet/deploy —
// plus a once-per-session "better on desktop" notice and its own tutorial:
//
//   ┌ toolbar ──────────┐
//   │ file chips        │
//   │ editor ⇄ console  │
//   │ build · test      │
//   └───────────────────┘

const DESKTOP_TUTORIAL_STEPS = [
  "projects",
  "fileTree",
  "editor",
  "build",
  "console",
  "wallet",
  "panels",
] as const;

const MOBILE_TUTORIAL_STEPS = ["projects", "files", "editor", "run", "console"] as const;

// Display order = the order a builder actually needs them: read the account,
// act on it, then the contract half of the workshop.
const PANEL_TAB_IDS = [
  "account",
  "ops",
  "deploy",
  "interact",
  "contract",
  "xdr",
  "ledger",
] as const;
type PanelTab = (typeof PANEL_TAB_IDS)[number];

export function IdeShell({ labs = [] }: { labs?: ForgeLabSummary[] }) {
  const m = useMessages();
  const [projects, setProjects] = useState<ForgeProjectMeta[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [files, setFiles] = useState<SorobanFileMap>({});
  const [activeFile, setActiveFile] = useState("src/lib.rs");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [wallet, setWallet] = useState<ForgeWallet | null>(null);
  const [lastContractId, setLastContractId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMobileNotice, setShowMobileNotice] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [forceCompact, setForceCompact] = useState(false);
  const { status, mode, lines, wasm, running, run, cancel } = useForgeRun();

  const shellRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<ForgeEditor | null>(null);
  const {
    layout,
    panes,
    toggle,
    setOpen: setOpenPane,
    resize,
    resetPane,
    setPanelTab,
    setMobileTab,
  } = useIdeLayout();

  const isMobile = layout === "phone" || forceCompact;
  // Between phone and desktop the side panes float over the editor. Their
  // open state is EPHEMERAL there — the persisted booleans stay the desktop
  // preference, so narrowing and re-widening the window never wipes the
  // layout the user set up.
  const overlayPanes = !isMobile && layout !== "desktop";
  const [overlay, setOverlay] = useState<"files" | "panel" | null>(null);

  const filesOpen = overlayPanes ? overlay === "files" : panes.filesOpen;
  const panelOpen = overlayPanes ? overlay === "panel" : panes.panelOpen;
  const panelTab: PanelTab = PANEL_TAB_IDS.includes(panes.panelTab as PanelTab)
    ? (panes.panelTab as PanelTab)
    : "deploy";
  const mobileTab = panes.mobileTab;

  const toggleFiles = useCallback(() => {
    if (overlayPanes) setOverlay((o) => (o === "files" ? null : "files"));
    else toggle("filesOpen");
  }, [overlayPanes, toggle]);

  const togglePanel = useCallback(() => {
    if (overlayPanes) setOverlay((o) => (o === "panel" ? null : "panel"));
    else toggle("panelOpen");
  }, [overlayPanes, toggle]);

  const toggleConsole = useCallback(() => toggle("consoleOpen"), [toggle]);

  useIdeShortcuts({
    onToggleFiles: toggleFiles,
    onTogglePanel: togglePanel,
    onToggleConsole: toggleConsole,
  });

  // Splitters write straight to these while dragging, so ~60 pointermoves a
  // second never re-render a tree that contains Monaco. State and localStorage
  // are touched once, on release.
  const previewPane = useCallback((cssVar: string, px: number) => {
    shellRef.current?.style.setProperty(cssVar, `${px}px`);
  }, []);

  // Monaco sizes itself, but a pane that collapses through a transition needs
  // one explicit relayout once the geometry settles.
  useEffect(() => {
    const id = window.setTimeout(() => editorRef.current?.layout(), 220);
    return () => window.clearTimeout(id);
  }, [filesOpen, panelOpen, panes.consoleOpen, layout, mobileTab]);

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
  //
  // The seed can fail silently — forge-store swallows quota/private-mode write
  // errors on purpose so in-memory state stays authoritative. When it does,
  // listProjects() comes back empty a second time, and reading metas[0].id
  // threw, white-screening the Forge. Now the smithy opens anyway, in memory,
  // behind a banner that says why nothing will be saved.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const compact = forgeCompactOverride();
    setForceCompact(compact);
    let metas = listProjects();
    if (metas.length === 0) {
      const template = templateById("hello-world");
      createProject(m.ide.shell.defaultProjectName, template.id, template.files);
      metas = listProjects();
    }
    setProjects(metas);
    const first = metas[0];
    if (first) {
      openProject(first.id, metas);
    } else {
      setFiles(templateById("hello-world").files);
      setStorageBlocked(true);
    }
    setLoaded(true);
    if (compact || window.matchMedia("(max-width: 767px)").matches) {
      // Notice first, then the compact tutorial once the notice is dismissed.
      if (!getMobileNoticeSeen()) setShowMobileNotice(true);
      else if (!getMobileTutorialSeen()) setShowTutorial(true);
    } else if (!getTutorialSeen()) {
      setShowTutorial(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // A collapsed pane has no [data-tutorial-id] to point at, and the tour
  // silently centers its popover instead. Reopen everything before it runs.
  const openTutorial = useCallback(() => {
    setOverlay(null);
    (["filesOpen", "panelOpen", "consoleOpen"] as const).forEach((pane) =>
      setOpenPane(pane, true),
    );
    setShowTutorial(true);
  }, [setOpenPane]);

  const dismissTutorial = useCallback(() => {
    if (isMobile) setMobileTutorialSeen();
    else setTutorialSeen();
    setShowTutorial(false);
  }, [isMobile]);

  const dismissMobileNotice = useCallback(() => {
    setMobileNoticeSeen();
    setShowMobileNotice(false);
    if (!getMobileTutorialSeen()) setShowTutorial(true);
  }, []);

  // Debounced autosave of the working copy. The pending write is flushed on
  // unmount — without it, navigating away inside the debounce window dropped
  // the last half-second of typing and fired setState after teardown.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSave = useRef<
    { id: string; data: { files: SorobanFileMap; activeFile: string } } | null
  >(null);
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      const pending = pendingSave.current;
      if (pending) saveProject(pending.id, pending.data);
    },
    [],
  );
  const persist = useCallback(
    (id: string | null, nextFiles: SorobanFileMap, nextActive: string) => {
      if (!id) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      pendingSave.current = { id, data: { files: nextFiles, activeFile: nextActive } };
      saveTimer.current = setTimeout(() => {
        saveProject(id, { files: nextFiles, activeFile: nextActive });
        pendingSave.current = null;
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
    pendingSave.current = null;
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

  // On the compact layout every run flips to the console — on one small pane
  // the user would otherwise stare at the editor while output streams unseen.
  const startMobileRun = (runMode: "build" | "test") => {
    setMobileTab("console");
    run(runMode, files);
  };

  const activeProject = projects.find((p) => p.id === projectId);

  if (!loaded) {
    return (
      <div className="grid h-full place-items-center font-mono text-xs text-muted">
        {m.ide.shell.loading}
      </div>
    );
  }

  const tutorialSteps: TutorialStep[] = isMobile
    ? MOBILE_TUTORIAL_STEPS.map((k) => ({ key: `m-${k}`, ...m.ide.tutorial.mobileSteps[k] }))
    : DESKTOP_TUTORIAL_STEPS.map((k) => ({ key: k, ...m.ide.tutorial.steps[k] }));

  // Shared across both layouts (the drawer positions itself absolutely
  // against the layout root; the notice and tutorial are fixed overlays).
  const overlays = (
    <>
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
      <LabDrawer open={labsOpen} labs={labs} onClose={() => setLabsOpen(false)} />
      {showMobileNotice && <MobileNotice onContinue={dismissMobileNotice} />}
      {showTutorial && <IdeTutorial steps={tutorialSteps} onDone={dismissTutorial} />}
    </>
  );

  if (isMobile) {
    const sortedFiles = Object.keys(files).sort((a, b) => {
      if (a === "Cargo.toml") return -1;
      if (b === "Cargo.toml") return 1;
      return a.localeCompare(b);
    });

    return (
      <div className="relative flex h-full flex-col bg-bg">
        {/* compact toolbar */}
        <div className="flex items-center justify-between gap-2 border-b border-line bg-bg-elev px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              data-tutorial-id="m-projects"
              onClick={() => setDrawerOpen(true)}
              className="shrink-0 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
            >
              ☰ {m.ide.shell.projects}
            </button>
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                setLabsOpen(true);
              }}
              aria-label={m.ide.labs.title}
              className="shrink-0 rounded-md border border-accent2/40 px-2.5 py-1.5 font-mono text-[11px] text-accent2 transition hover:bg-accent2/10"
            >
              ⚒
            </button>
            <span className="truncate font-mono text-[12px] text-fg">
              {activeProject?.name ?? "…"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-accent2/40 bg-accent2/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent2">
              {m.ide.layout.network}
            </span>
            <button
              type="button"
              title={m.ide.tutorial.reopenTitle}
              aria-label={m.ide.tutorial.reopenTitle}
              onClick={openTutorial}
              className="grid h-7 w-7 place-items-center rounded-full border border-line font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
            >
              ?
            </button>
          </div>
        </div>

        {/* file chips — switching only; add/delete waits for desktop */}
        <div
          data-tutorial-id="m-files"
          className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-line bg-bg-elev px-3 py-2"
        >
          {sortedFiles.map((path) => (
            <button
              key={path}
              type="button"
              onClick={() => {
                setActiveFile(path);
                setMobileTab("editor");
                persist(projectId, files, path);
              }}
              className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] transition ${
                path === activeFile
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line text-muted2"
              }`}
            >
              {path.replace(/^src\//, "")}
            </button>
          ))}
        </div>

        {/* editor ⇄ console switcher */}
        <div className="flex shrink-0 border-b border-line bg-bg-elev">
          {(["editor", "console"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              data-tutorial-id={tab === "console" ? "m-console" : undefined}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
                mobileTab === tab ? "border-b border-accent text-accent" : "text-muted"
              }`}
            >
              {m.ide.mobile.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Panes stay mounted; hiding instead of unmounting preserves Monaco
            state and the console scroll position. `relative` is load-bearing:
            the inactive pane is taken out of flow but kept at full size, so
            Monaco never measures 0×0 and never flashes on the way back. */}
        <div className="relative min-h-0 flex-1">
          <div
            data-tutorial-id="m-editor"
            className={
              mobileTab === "editor"
                ? "h-full"
                : "pointer-events-none invisible absolute inset-0 h-full"
            }
          >
            <EditorPane
              path={activeFile}
              value={files[activeFile] ?? ""}
              onChange={(v) => updateFile(activeFile, v)}
              onRun={() => startMobileRun("build")}
              onSave={saveNow}
              fontSize={16}
            />
          </div>
          <div
            className={
              mobileTab === "console"
                ? "flex h-full flex-col"
                : "pointer-events-none invisible absolute inset-0 flex h-full flex-col"
            }
          >
            {/* The Raven perches here only when a run failed. */}
            <RavenPanel status={status} mode={mode} files={files} lines={lines} />
            <div className="min-h-0 flex-1">
              <ConsolePane lines={lines} status={status} />
            </div>
          </div>
        </div>

        {/* run bar — the essentials: build + test */}
        <div
          data-tutorial-id="m-run"
          className="flex shrink-0 items-center gap-2 border-t border-line bg-bg-elev px-3 py-2"
        >
          <button
            type="button"
            onClick={() => startMobileRun("build")}
            disabled={running}
            className="flex-[2] rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-[13px] text-accent transition hover:bg-accent/20 disabled:opacity-50"
          >
            {running && status === "building" ? m.ide.toolbar.building : m.ide.mobile.build}
          </button>
          <button
            type="button"
            onClick={() => startMobileRun("test")}
            disabled={running}
            className="flex-1 rounded-lg border border-line px-4 py-2.5 font-mono text-[13px] text-muted2 transition hover:border-line-strong hover:text-fg disabled:opacity-40"
          >
            {running && status === "testing" ? m.ide.toolbar.testing : m.ide.toolbar.test}
          </button>
          {running && (
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-red-400/40 px-3 py-2.5 font-mono text-[13px] text-red-400 transition hover:bg-red-400/10"
            >
              {m.ide.toolbar.cancel}
            </button>
          )}
        </div>

        {/* in memoriam — James Bachini, creator of the Soroban Playground */}
        <div className="flex shrink-0 items-center justify-center gap-1.5 border-t border-line bg-bg-elev px-4 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          <span className="truncate font-mono text-[10px] text-muted">
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

        {overlays}
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className="relative flex h-full flex-col bg-bg"
      style={
        {
          "--forge-files-w": `${panes.filesW}px`,
          "--forge-panel-w": `${panes.panelW}px`,
          "--forge-console-h": `${panes.consoleH}px`,
        } as React.CSSProperties
      }
    >
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
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              setLabsOpen(true);
            }}
            className="rounded-md border border-accent2/40 px-3 py-1.5 font-mono text-[11px] text-accent2 transition hover:bg-accent2/10"
          >
            ⚒ {m.ide.labs.open}
          </button>
          <span className="truncate font-mono text-[12px] text-fg">
            {activeProject?.name ?? "…"}
          </span>
          <span className="rounded-full border border-accent2/40 bg-accent2/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent2">
            {m.ide.layout.network}
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
            onClick={openTutorial}
            className="grid h-7 w-7 place-items-center rounded-full border border-line font-mono text-[11px] text-muted2 transition hover:border-line-strong hover:text-fg"
          >
            ?
          </button>
        </div>
      </div>

      {storageBlocked && (
        <div className="shrink-0 border-b border-ember/40 bg-ember/10 px-4 py-2 font-mono text-[11px] leading-relaxed text-ember">
          {m.ide.layout.storageBlocked}
        </div>
      )}

      {/* panes */}
      <div className="relative flex min-h-0 flex-1">
        {/* ── files ── */}
        {(overlayPanes || !filesOpen) && (
          <PaneRail
            side="left"
            label={m.ide.fileTree.title}
            title={filesOpen ? m.ide.layout.hideFiles : m.ide.layout.showFiles}
            onOpen={toggleFiles}
          />
        )}
        {filesOpen && (
          <aside
            data-tutorial-id="fileTree"
            style={{ width: "var(--forge-files-w)" }}
            className={`shrink-0 border-r border-line bg-bg-elev ${
              overlayPanes ? "absolute inset-y-0 left-7 z-20 shadow-2xl shadow-black/60" : ""
            }`}
          >
            <FileTree
              files={Object.keys(files)}
              activeFile={activeFile}
              onSelect={(path) => {
                setActiveFile(path);
                persist(projectId, files, path);
                if (overlayPanes) setOverlay(null);
              }}
              onAdd={addFile}
              onDelete={removeFile}
              onCollapse={toggleFiles}
              collapseTitle={m.ide.layout.hideFiles}
            />
          </aside>
        )}
        {!overlayPanes && filesOpen && (
          <Splitter
            orientation="vertical"
            value={panes.filesW}
            min={PANE_LIMITS.filesW.min}
            max={PANE_LIMITS.filesW.max}
            label={m.ide.layout.resizeFiles}
            onPreview={(n) => previewPane("--forge-files-w", n)}
            onCommit={(n) => resize("filesW", n)}
            onReset={() => {
              resetPane("filesW");
              previewPane("--forge-files-w", IDE_LAYOUT_DEFAULTS.filesW);
            }}
          />
        )}

        {/* ── editor + console ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div data-tutorial-id="editor" className="min-h-0 flex-1">
            <EditorPane
              path={activeFile}
              value={files[activeFile] ?? ""}
              onChange={(v) => updateFile(activeFile, v)}
              onRun={() => run("build", files)}
              onSave={saveNow}
              onReady={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
          {panes.consoleOpen ? (
            <>
              <Splitter
                orientation="horizontal"
                invert
                value={panes.consoleH}
                min={PANE_LIMITS.consoleH.min}
                max={PANE_LIMITS.consoleH.max}
                label={m.ide.layout.resizeConsole}
                onPreview={(n) => previewPane("--forge-console-h", n)}
                onCommit={(n) => resize("consoleH", n)}
                onReset={() => {
                  resetPane("consoleH");
                  previewPane("--forge-console-h", IDE_LAYOUT_DEFAULTS.consoleH);
                }}
              />
              <div
                data-tutorial-id="console"
                style={{ height: "var(--forge-console-h)" }}
                className="shrink-0 border-t border-line"
              >
                <ConsolePane
                  lines={lines}
                  status={status}
                  onCollapse={toggleConsole}
                  collapseTitle={m.ide.layout.hideConsole}
                />
              </div>
            </>
          ) : (
            // A build that fails into a hidden console is the worst outcome
            // here, so the collapsed console keeps reporting its status.
            <PaneRail
              side="bottom"
              label={m.ide.console.title}
              title={m.ide.layout.showConsole}
              onOpen={toggleConsole}
              accent={
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted2">
                  {m.ide.console.status[status]}
                </span>
              }
            />
          )}
        </div>

        {/* ── side panel ── */}
        {!overlayPanes && panelOpen && (
          <Splitter
            orientation="vertical"
            invert
            value={panes.panelW}
            min={PANE_LIMITS.panelW.min}
            max={PANE_LIMITS.panelW.max}
            label={m.ide.layout.resizePanel}
            onPreview={(n) => previewPane("--forge-panel-w", n)}
            onCommit={(n) => resize("panelW", n)}
            onReset={() => {
              resetPane("panelW");
              previewPane("--forge-panel-w", IDE_LAYOUT_DEFAULTS.panelW);
            }}
          />
        )}
        {panelOpen && (
          <aside
            data-tutorial-id="panels"
            style={{ width: "var(--forge-panel-w)" }}
            className={`flex shrink-0 flex-col border-l border-line bg-bg-elev ${
              overlayPanes ? "absolute inset-y-0 right-7 z-20 shadow-2xl shadow-black/60" : ""
            }`}
          >
            {/* The Raven perches here only when a run failed. */}
            <RavenPanel status={status} mode={mode} files={files} lines={lines} />
            <div
              role="tablist"
              aria-label={m.ide.layout.panes}
              className="flex overflow-x-auto border-b border-line"
            >
              {PANEL_TAB_IDS.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  id={`forge-tab-${tab}`}
                  aria-selected={panelTab === tab}
                  aria-controls="forge-tabpanel"
                  tabIndex={panelTab === tab ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                    e.preventDefault();
                    const step = e.key === "ArrowRight" ? 1 : -1;
                    const next =
                      PANEL_TAB_IDS[
                        (i + step + PANEL_TAB_IDS.length) % PANEL_TAB_IDS.length
                      ];
                    setPanelTab(next);
                    document.getElementById(`forge-tab-${next}`)?.focus();
                  }}
                  onClick={() => setPanelTab(tab)}
                  className={`shrink-0 whitespace-nowrap px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition ${
                    panelTab === tab
                      ? "border-b border-accent text-accent"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {m.ide.shell.tabs[tab]}
                </button>
              ))}
              <button
                type="button"
                onClick={togglePanel}
                title={m.ide.layout.hidePanel}
                aria-label={m.ide.layout.hidePanel}
                className="px-3 font-mono text-[11px] text-muted transition hover:text-fg"
              >
                ›
              </button>
            </div>
            <div
              id="forge-tabpanel"
              role="tabpanel"
              aria-labelledby={`forge-tab-${panelTab}`}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              {panelTab === "account" ? (
                <AccountPanel wallet={wallet} />
              ) : panelTab === "ops" ? (
                <OpsPanel wallet={wallet} />
              ) : panelTab === "deploy" ? (
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
              ) : panelTab === "contract" ? (
                <ExplorePanel wallet={wallet} />
              ) : panelTab === "xdr" ? (
                <XdrPanel wallet={wallet} />
              ) : (
                <LedgerPanel />
              )}
            </div>
          </aside>
        )}
        {(overlayPanes || !panelOpen) && (
          <PaneRail
            side="right"
            label={m.ide.layout.panes}
            title={panelOpen ? m.ide.layout.hidePanel : m.ide.layout.showPanel}
            onOpen={togglePanel}
          />
        )}

        {/* Tapping the editor dismisses a floating pane. */}
        {overlayPanes && overlay !== null && (
          <button
            type="button"
            aria-label={overlay === "files" ? m.ide.layout.hideFiles : m.ide.layout.hidePanel}
            onClick={() => setOverlay(null)}
            className="absolute inset-0 z-10 cursor-default bg-bg/50"
          />
        )}
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

      {overlays}
    </div>
  );
}
