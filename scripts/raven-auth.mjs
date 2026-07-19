// One-time OAuth consent for the Raven MCP (raven.stellar.buzz) — the docs
// source the AI mentor uses for Stellar/Soroban hints.
//
// The MCP only supports the interactive authorization-code grant (PKCE), so
// a human has to approve once in the browser. This script does the whole
// dance and stores the resulting tokens in the RavenToken table of whatever
// DATABASE_URL points at; from then on the app refreshes by itself
// (src/lib/mentor/raven.ts).
//
//   Local:      node scripts/raven-auth.mjs
//   Production: DATABASE_URL="<string do Neon>" node scripts/raven-auth.mjs
//
// No secrets are printed; tokens go straight to the database.

import "dotenv/config";
import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import pg from "pg";

const MCP_URL = process.env.RAVEN_MCP_URL ?? "https://raven.stellar.buzz/mcp";
const ORIGIN = new URL(MCP_URL).origin;
const REDIRECT_PORT = 8765;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

const b64url = (buf) => buf.toString("base64url");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL não está definida (usa .env local ou passe a do Neon).");
    process.exit(1);
  }

  // 1. Discover the authorization server.
  const meta = await (
    await fetch(`${ORIGIN}/.well-known/oauth-authorization-server`)
  ).json();
  console.log(`→ authorization server: ${meta.issuer}`);

  // 2. Dynamic client registration (public client, PKCE).
  const reg = await fetch(meta.registration_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "TUSST mentor",
      redirect_uris: [REDIRECT_URI],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: "mcp",
    }),
  });
  if (!reg.ok) {
    console.error(`registro de client falhou: HTTP ${reg.status} — ${await reg.text()}`);
    process.exit(1);
  }
  const { client_id } = await reg.json();
  console.log(`→ client registrado`);

  // 3. PKCE + authorize URL.
  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const authorizeUrl =
    `${meta.authorization_endpoint}?` +
    new URLSearchParams({
      response_type: "code",
      client_id,
      redirect_uri: REDIRECT_URI,
      scope: "mcp",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
      resource: MCP_URL,
    });

  // 4. Wait for the browser to come back with the code.
  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      if (url.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }
      const err = url.searchParams.get("error");
      const gotState = url.searchParams.get("state");
      const gotCode = url.searchParams.get("code");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (err || gotState !== state || !gotCode) {
        res.end("<h3>Falhou — volte ao terminal.</h3>");
        server.close();
        reject(new Error(err ?? "state inválido"));
        return;
      }
      res.end("<h3>Autorizado! Pode fechar esta aba e voltar ao terminal.</h3>");
      server.close();
      resolve(gotCode);
    });
    server.listen(REDIRECT_PORT, () => {
      console.log("\nAbra (ou confirme no browser que abriu) e autorize:\n");
      console.log(`  ${authorizeUrl}\n`);
      if (process.platform === "darwin") spawn("open", [authorizeUrl]);
    });
    setTimeout(() => {
      server.close();
      reject(new Error("timeout de 5 minutos esperando a autorização"));
    }, 5 * 60 * 1000).unref();
  });

  // 5. Exchange the code for tokens.
  const tok = await fetch(meta.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id,
      code_verifier: verifier,
      resource: MCP_URL,
    }),
  });
  if (!tok.ok) {
    console.error(`troca do code falhou: HTTP ${tok.status} — ${await tok.text()}`);
    process.exit(1);
  }
  const tokens = await tok.json();
  if (!tokens.access_token || !tokens.refresh_token) {
    console.error("resposta do token endpoint sem access_token/refresh_token — o servidor não emitiu refresh token; abra uma issue com a Raven.");
    process.exit(1);
  }
  const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000);

  // 6. Store in RavenToken (upsert, single row id 'raven').
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(
    `INSERT INTO "RavenToken" (id, "clientId", "accessToken", "refreshToken", "expiresAt", "updatedAt")
     VALUES ('raven', $1, $2, $3, $4, NOW())
     ON CONFLICT (id) DO UPDATE SET
       "clientId" = EXCLUDED."clientId",
       "accessToken" = EXCLUDED."accessToken",
       "refreshToken" = EXCLUDED."refreshToken",
       "expiresAt" = EXCLUDED."expiresAt",
       "updatedAt" = NOW()`,
    // ISO string, not Date: node-pg serializes Date objects in LOCAL time
    // for timestamp-without-tz columns, which would shift expiry by the
    // machine's UTC offset (Prisma reads the column as UTC).
    [client_id, tokens.access_token, tokens.refresh_token, expiresAt.toISOString()],
  );
  await client.end();

  console.log(`✓ tokens salvos no banco (expira ${expiresAt.toISOString()}; o app renova sozinho).`);
  console.log("✓ o mentor agora consulta os docs da Stellar via Raven nas lições Stellar/Soroban e na Forge.");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
