import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

export const { POST } = handlers;

// Auth.js reports every server-side failure to the client as `Configuration`,
// including an OAuth callback that arrives without the PKCE cookie set when
// the sign-in started (its `InvalidCheck`). Nothing is misconfigured then: the
// round-trip ended in a different browser than it began in. Typical on phones,
// where a link tapped inside Discord opens an in-app browser and the Discord
// app takes over the consent and hands the callback to the system browser.
// Retrying from the page the player lands on works, so say that instead of
// "come back in a few minutes".
const PKCE_COOKIES = ["authjs.pkce.code_verifier", "__Secure-authjs.pkce.code_verifier"];

export async function GET(req: NextRequest) {
  const res = await handlers.GET(req);
  if (!req.nextUrl.pathname.startsWith("/api/auth/callback/")) return res;
  if (PKCE_COOKIES.some((name) => req.cookies.has(name))) return res;

  const location = res.headers.get("location");
  if (!location) return res;
  const target = new URL(location);
  if (target.searchParams.get("error") !== "Configuration") return res;

  target.searchParams.set("error", "InvalidCheck");
  // Response.redirect() headers are immutable — rebuild instead of mutating.
  const headers = new Headers(res.headers);
  headers.set("location", target.href);
  return new Response(res.body, { status: res.status, headers });
}
