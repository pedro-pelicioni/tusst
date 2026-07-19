import "server-only";

// Raven MCP client (raven.stellar.buzz) — fetches short Stellar-docs
// excerpts to ground the mentor's hints on Soroban/Stellar content.
//
// Best-effort by design: every failure path returns null and the mentor
// simply answers without docs. The MCP requires OAuth (authorization-code
// only), so tokens come from the RavenToken row seeded once by
// scripts/raven-auth.mjs; this module refreshes them in place. Minimal
// streamable-HTTP MCP client: initialize → tools/list → tools/call, JSON
// or SSE responses, session id via Mcp-Session-Id header.

import { prisma } from "@/lib/db";

const MCP_URL = process.env.RAVEN_MCP_URL ?? "https://raven.stellar.buzz/mcp";
const TOKEN_URL = `${new URL(MCP_URL).origin}/token`;
const PROTOCOL_VERSION = "2025-03-26";
const RPC_TIMEOUT_MS = 6_000;
const DOCS_CAP = 1_500;

// ---------------------------------------------------------------------------
// OAuth: access token from the DB row, refreshed when near expiry.

async function refreshAccessToken(row: {
  clientId: string;
  refreshToken: string;
}): Promise<string | null> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: row.refreshToken,
      client_id: row.clientId,
      resource: MCP_URL,
    }),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
  });
  if (!res.ok) {
    console.error(`[raven] token refresh failed: HTTP ${res.status}`);
    return null;
  }
  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) return null;

  const expiresAt = new Date(Date.now() + (data.expires_in ?? 3600) * 1000);
  // Optimistic lock on the old refresh token: if another serverless instance
  // already rotated it, keep theirs (count 0) instead of clobbering.
  await prisma.ravenToken.updateMany({
    where: { id: "raven", refreshToken: row.refreshToken },
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? row.refreshToken,
      expiresAt,
    },
  });
  return data.access_token;
}

async function getAccessToken(): Promise<string | null> {
  try {
    const row = await prisma.ravenToken.findUnique({ where: { id: "raven" } });
    if (!row) return null; // never authorized — feature off
    if (row.expiresAt.getTime() - Date.now() > 60_000) return row.accessToken;
    return await refreshAccessToken(row);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Minimal MCP over streamable HTTP.

interface RpcResult {
  result?: unknown;
  error?: { message?: string };
}

// SSE bodies carry the JSON-RPC response as `data:` lines.
function parseSse(text: string): RpcResult | null {
  for (const chunk of text.split("\n\n")) {
    const data = chunk
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .join("");
    if (!data) continue;
    try {
      const parsed = JSON.parse(data) as RpcResult;
      if (parsed.result !== undefined || parsed.error !== undefined) return parsed;
    } catch {
      // keep scanning
    }
  }
  return null;
}

let rpcId = 0;

async function rpc(
  token: string,
  sessionId: string | null,
  method: string,
  params: unknown,
  notification = false,
): Promise<{ result: unknown; sessionId: string | null }> {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${token}`,
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      ...(notification ? {} : { id: ++rpcId }),
      method,
      params,
    }),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
  });
  const nextSession = res.headers.get("mcp-session-id") ?? sessionId;
  if (notification) {
    return { result: null, sessionId: nextSession };
  }
  if (!res.ok) throw new Error(`raven rpc ${method}: HTTP ${res.status}`);

  const text = await res.text();
  const parsed: RpcResult | null = res.headers
    .get("content-type")
    ?.includes("text/event-stream")
    ? parseSse(text)
    : (JSON.parse(text) as RpcResult);
  if (!parsed || parsed.error) {
    throw new Error(`raven rpc ${method}: ${parsed?.error?.message ?? "bad response"}`);
  }
  return { result: parsed.result, sessionId: nextSession };
}

interface McpTool {
  name: string;
  inputSchema?: { properties?: Record<string, { type?: string }> };
}

// Raven is a Cloudflare "codemode" MCP: `search` finds operations, `execute`
// runs sandboxed JS against the discovered SDKs (stellarDocs.*). Docs content
// comes from executing stellarDocs.search_docs. A generic single-search-tool
// server (if RAVEN_MCP_URL is ever pointed elsewhere) still works via the
// fallback tool picker.
type SearchMode =
  | { kind: "codemode" }
  | { kind: "generic"; name: string; argKey: string };

interface McpSession {
  token: string;
  sessionId: string | null;
  mode: SearchMode | null;
}

let cachedSession: McpSession | null = null;

function pickMode(tools: McpTool[]): SearchMode | null {
  if (tools.some((t) => t.name === "execute")) return { kind: "codemode" };
  const candidate =
    tools.find((t) => /search|docs?|lookup|ask|query/i.test(t.name)) ??
    (tools.length === 1 ? tools[0] : null);
  if (!candidate) return null;
  const props = candidate.inputSchema?.properties ?? {};
  const argKey =
    ["query", "q", "question", "text", "prompt", "input"].find((k) => k in props) ??
    Object.keys(props).find((k) => props[k]?.type === "string") ??
    "query";
  return { kind: "generic", name: candidate.name, argKey };
}

async function openSession(token: string): Promise<McpSession> {
  const init = await rpc(token, null, "initialize", {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: { name: "tusst-mentor", version: "1.0.0" },
  });
  await rpc(token, init.sessionId, "notifications/initialized", {}, true).catch(
    () => {},
  );
  const list = await rpc(token, init.sessionId, "tools/list", {});
  const tools = ((list.result as { tools?: McpTool[] })?.tools ?? []) as McpTool[];
  return { token, sessionId: list.sessionId, mode: pickMode(tools) };
}

// A tools/call result may carry several text items (payload + advisory
// notes) — return them separately so the compactor can parse each one.
function extractTexts(result: unknown): string[] {
  const content = (result as { content?: { type?: string; text?: string }[] })
    ?.content;
  if (!Array.isArray(content)) return [];
  return content
    .filter((c) => c.type === "text" && typeof c.text === "string")
    .map((c) => (c.text as string).trim())
    .filter((t) => t !== "");
}

function callArgs(mode: SearchMode, query: string): { name: string; arguments: unknown } {
  if (mode.kind === "generic") {
    return { name: mode.name, arguments: { [mode.argKey]: query } };
  }
  // JSON.stringify keeps untrusted query text (it may derive from student
  // compiler logs) from escaping the string literal in the sandbox code.
  const code =
    `async () => { const r = await stellarDocs.search_docs({ query: ${JSON.stringify(query)}, hitsPerPage: 2, includeContent: true }); return r; }`;
  return { name: "execute", arguments: { code } };
}

// Codemode payloads are JSON, but the text item may carry advisory prose
// appended after the JSON — delimit by the outermost braces before parsing.
function tryParseJson(t: string): unknown | null {
  try {
    return JSON.parse(t);
  } catch {
    const a = t.indexOf("{");
    const b = t.lastIndexOf("}");
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(t.slice(a, b + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// { ok, data: { hits: [{ url, breadcrumb, snippet, content? }] } } →
// compact plain-text block for the prompt.
function compactParsed(parsed: unknown): string | null {
  const p = parsed as {
    ok?: boolean;
    data?: {
      hits?: {
        url_without_anchor?: string;
        url?: string;
        breadcrumb?: string;
        snippet?: string;
        content?: string;
      }[];
    };
  };
  if (p.ok === false || !Array.isArray(p.data?.hits)) return null;
  const parts = p.data.hits.slice(0, 2).map((h) => {
    const body = (h.content ?? h.snippet ?? "").replace(/\*\*/g, "").trim();
    return [
      h.breadcrumb ? `[${h.breadcrumb}]` : null,
      h.url_without_anchor ?? h.url ?? null,
      body.slice(0, 650),
    ]
      .filter(Boolean)
      .join("\n");
  });
  const text = parts.join("\n---\n").trim();
  return text === "" ? null : text;
}

// Pick the docs text from the call's content items. A JSON item is the
// authoritative payload (compacted hits, or nothing usable — advisory prose
// items must not masquerade as docs); prose-only responses (generic servers)
// fall back to the first item.
function pickDocs(texts: string[]): string | null {
  let prose: string | null = null;
  for (const t of texts) {
    const parsed = tryParseJson(t);
    if (parsed !== null) return compactParsed(parsed);
    prose = prose ?? t;
  }
  return prose;
}

// ---------------------------------------------------------------------------
// Public API: search the Stellar docs, cached per query per instance.

const docsCache = new Map<string, { at: number; docs: string | null }>();
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX = 100;

export async function searchRavenDocs(query: string): Promise<string | null> {
  const key = query.slice(0, 200);
  const hit = docsCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.docs;

  let docs: string | null = null;
  try {
    const token = await getAccessToken();
    if (token) {
      if (!cachedSession || cachedSession.token !== token) {
        cachedSession = await openSession(token);
      }
      let session = cachedSession;
      if (session.mode) {
        let call;
        try {
          call = await rpc(
            session.token,
            session.sessionId,
            "tools/call",
            callArgs(session.mode, key),
          );
        } catch {
          // Session likely expired — reopen once and retry.
          cachedSession = await openSession(token);
          session = cachedSession;
          if (!session.mode) throw new Error("no usable tool after re-init");
          call = await rpc(
            session.token,
            session.sessionId,
            "tools/call",
            callArgs(session.mode, key),
          );
        }
        docs = pickDocs(extractTexts(call.result))?.slice(0, DOCS_CAP) ?? null;
      }
    }
  } catch (e) {
    console.error(`[raven] docs lookup failed: ${e instanceof Error ? e.message : e}`);
    docs = null;
  }

  if (docsCache.size >= CACHE_MAX) {
    const oldest = docsCache.keys().next().value;
    if (oldest !== undefined) docsCache.delete(oldest);
  }
  docsCache.set(key, { at: Date.now(), docs });
  return docs;
}
