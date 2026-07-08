import "server-only";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit, clientKeyFor } from "./rate-limit";
import { runForge } from "./runner";
import type { ForgeEvent, ForgeMode } from "./types";
import { validateFiles } from "./validate-files";

// Shared POST handler for /api/soroban/{compile,test,audit}.
//
// Contract: pre-stream failures (bad body, too large, rate limited) return
// plain JSON with a 4xx status; success returns an NDJSON stream of
// ForgeEvents. The client distinguishes the two by content-type.
//
// The Forge is open — no login required — but signed-in users get a higher
// rate-limit bucket. The Docker sandbox is the security boundary; these
// checks only keep the host cheap to abuse.

const MAX_BODY_BYTES = 600 * 1024; // 512KB of files + JSON envelope
const PING_INTERVAL_MS = 10_000;

export function createForgeHandler(mode: ForgeMode) {
  return async function POST(req: Request): Promise<Response> {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Project too large (512KB max)." },
        { status: 413 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const { files } = (body ?? {}) as { files?: unknown };
    const validated = validateFiles(files);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;
    const retryIn = checkRateLimit(clientKeyFor(req, userId), userId !== null);
    if (retryIn !== null) {
      return NextResponse.json(
        { error: `The forge needs to cool down — try again in ${retryIn}s.` },
        { status: 429, headers: { "retry-after": String(retryIn) } },
      );
    }

    const abort = new AbortController();
    req.signal.addEventListener("abort", () => abort.abort());
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let closed = false;
        const send = (event: ForgeEvent) => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
          } catch {
            closed = true;
          }
        };
        const ping = setInterval(() => send({ t: "ping" }), PING_INTERVAL_MS);
        try {
          for await (const event of runForge(mode, validated.files, abort.signal)) {
            send(event);
          }
        } catch {
          send({ t: "done", ok: false, timedOut: false, infraError: true });
        } finally {
          clearInterval(ping);
          closed = true;
          try {
            controller.close();
          } catch {
            // already errored/cancelled
          }
        }
      },
      cancel() {
        abort.abort();
      },
    });

    return new Response(stream, {
      headers: {
        "content-type": "application/x-ndjson; charset=utf-8",
        "cache-control": "no-store",
        "x-accel-buffering": "no",
      },
    });
  };
}
