import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Nodemailer from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { prisma } from "@/lib/db";

const providers: Provider[] = [];

// GitHub OAuth — active only when credentials are configured.
// Read-only scopes; the profile map keeps just name + email (no avatar,
// no extra profile data is ever stored).
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
      profile(p) {
        return {
          id: String(p.id),
          name: p.name ?? p.login,
          email: p.email,
        };
      },
    }),
  );
}

// Discord OAuth — active only when credentials are configured.
// "identify email" is Discord's minimal read-only pair; we keep the display
// name (falling back to the username) + email, nothing else.
if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
  providers.push(
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: { params: { scope: "identify email" } },
      profile(p) {
        return {
          id: p.id,
          name: p.global_name ?? p.username,
          email: p.email,
        };
      },
    }),
  );
}

// Email magic-link — active only when an SMTP server is configured.
if (process.env.AUTH_EMAIL_SERVER) {
  providers.push(
    Nodemailer({
      server: process.env.AUTH_EMAIL_SERVER,
      from: process.env.AUTH_EMAIL_FROM,
    }),
  );
}

// Local dev login (any name -> upserts + logs in a user). Hard-gated on
// NODE_ENV so a stray AUTH_DEV_LOGIN in a production deploy can't enable it.
export const devLoginEnabled =
  process.env.AUTH_DEV_LOGIN === "true" &&
  process.env.NODE_ENV !== "production";

if (devLoginEnabled) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Dev login",
      credentials: { name: { label: "Name", type: "text" } },
      async authorize(creds) {
        const raw = ((creds?.name as string) ?? "").trim() || "guardian";
        const handle =
          raw
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "guardian";
        const email = `${handle}@dev.local`;
        const user = await prisma.user.upsert({
          where: { email },
          create: { email, name: handle, character: { create: {} } },
          update: {},
        });
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/login" },
  providers,
  events: {
    // OAuth signups go through the adapter (not the dev-login upsert), so
    // the player's Character is forged here.
    async createUser({ user }) {
      if (!user.id) return;
      await prisma.character.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id as string;
      return token;
    },
    session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
