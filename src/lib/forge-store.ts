import type { SorobanFileMap } from "@/lib/soroban/types";

// Client-side persistence for the Forge IDE (v1 keeps everything in
// localStorage; the versioned key prefix leaves room for a later DB sync).
// All functions are browser-only — callers are client components.

const PREFIX = "tusst:forge:v1";
const INDEX_KEY = `${PREFIX}:index`;
const DEPLOYMENTS_KEY = `${PREFIX}:deployments`;
const projectKey = (id: string) => `${PREFIX}:project:${id}`;

export interface ForgeProjectMeta {
  id: string;
  name: string;
  template: string;
  updatedAt: number;
}

export interface ForgeProjectData {
  files: SorobanFileMap;
  activeFile: string;
}

export interface ForgeDeployment {
  contractId: string;
  wasmHash: string;
  network: "testnet";
  label: string;
  createdAt: number;
}

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / private mode — the in-memory state stays authoritative.
  }
}

export function listProjects(): ForgeProjectMeta[] {
  return (read<ForgeProjectMeta[]>(INDEX_KEY) ?? []).sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );
}

export function loadProject(id: string): ForgeProjectData | null {
  return read<ForgeProjectData>(projectKey(id));
}

export function createProject(
  name: string,
  template: string,
  files: SorobanFileMap,
): ForgeProjectMeta {
  const meta: ForgeProjectMeta = {
    id: crypto.randomUUID(),
    name,
    template,
    updatedAt: Date.now(),
  };
  write(projectKey(meta.id), {
    files,
    activeFile: "src/lib.rs",
  } satisfies ForgeProjectData);
  write(INDEX_KEY, [...listProjects(), meta]);
  return meta;
}

export function saveProject(id: string, data: ForgeProjectData): void {
  write(projectKey(id), data);
  const index = listProjects().map((m) =>
    m.id === id ? { ...m, updatedAt: Date.now() } : m,
  );
  write(INDEX_KEY, index);
}

export function renameProject(id: string, name: string): void {
  write(
    INDEX_KEY,
    listProjects().map((m) => (m.id === id ? { ...m, name } : m)),
  );
}

export function deleteProject(id: string): void {
  try {
    window.localStorage.removeItem(projectKey(id));
  } catch {
    // ignore
  }
  write(
    INDEX_KEY,
    listProjects().filter((m) => m.id !== id),
  );
}

export function listDeployments(): ForgeDeployment[] {
  return read<ForgeDeployment[]>(DEPLOYMENTS_KEY) ?? [];
}

export function addDeployment(deployment: ForgeDeployment): void {
  write(DEPLOYMENTS_KEY, [deployment, ...listDeployments()].slice(0, 50));
}

// Contract ids loaded through the Explore panel. Plain strings — foreign
// contracts carry no trustworthy metadata worth storing.
const EXPLORED_KEY = `${PREFIX}:explored`;

export function listExplored(): string[] {
  return read<string[]>(EXPLORED_KEY) ?? [];
}

export function addExplored(contractId: string): void {
  const rest = listExplored().filter((id) => id !== contractId);
  write(EXPLORED_KEY, [contractId, ...rest].slice(0, 20));
}

// First-visit walkthrough. No auth gate on /ide, so this stays client-side —
// same as everything else in this store — rather than a User column.
// Desktop and the compact (phone/tablet) layout have different walkthroughs,
// so each keeps its own flag — seeing one shouldn't suppress the other.
const TUTORIAL_SEEN_KEY = `${PREFIX}:tutorialSeen`;
const MOBILE_TUTORIAL_SEEN_KEY = `${PREFIX}:mobileTutorialSeen`;

export function getTutorialSeen(): boolean {
  return read<boolean>(TUTORIAL_SEEN_KEY) ?? false;
}

export function setTutorialSeen(): void {
  write(TUTORIAL_SEEN_KEY, true);
}

export function getMobileTutorialSeen(): boolean {
  return read<boolean>(MOBILE_TUTORIAL_SEEN_KEY) ?? false;
}

export function setMobileTutorialSeen(): void {
  write(MOBILE_TUTORIAL_SEEN_KEY, true);
}

// The "better on desktop" notice nags once per browser session, not once
// ever — sessionStorage instead of localStorage is deliberate.
const MOBILE_NOTICE_KEY = `${PREFIX}:mobileNoticeSeen`;

export function getMobileNoticeSeen(): boolean {
  try {
    return window.sessionStorage.getItem(MOBILE_NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMobileNoticeSeen(): void {
  try {
    window.sessionStorage.setItem(MOBILE_NOTICE_KEY, "1");
  } catch {
    // Private mode — the modal just shows again next time.
  }
}
