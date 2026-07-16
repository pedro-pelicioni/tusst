import { redirect } from "next/navigation";
import { auth, signIn, devLoginEnabled } from "@/lib/auth";
import { DiscordMark, GitHubMark } from "@/components/icons";
import { getMessages } from "@/i18n/server";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/path");

  const m = await getMessages();

  const githubEnabled = !!(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  );
  const discordEnabled = !!(
    process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
  );
  const emailEnabled = !!process.env.AUTH_EMAIL_SERVER;
  const devEnabled = devLoginEnabled;

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[#b8873e]/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-sigil.png"
            alt={m.common.logoAlt}
            className="h-full w-full object-contain p-0.5"
          />
        </span>
        <span className="font-mono text-sm font-semibold tracking-[0.22em]">
          TUSST
        </span>
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight">
        {m.auth.signIn}
      </h1>
      <p className="mt-2 text-sm text-muted2">{m.auth.tagline}</p>

      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-line bg-bg-elev p-6">
        {githubEnabled && (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/path" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2.5 rounded-md border border-line-strong bg-white/[0.04] px-4 py-2 font-mono text-[13px] transition hover:bg-white/[0.08]"
            >
              <GitHubMark className="h-4 w-4" />
              {m.auth.continueWithGitHub}
            </button>
          </form>
        )}

        {discordEnabled && (
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: "/path" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2.5 rounded-md border border-[#5865F2]/40 bg-[#5865F2]/10 px-4 py-2 font-mono text-[13px] transition hover:bg-[#5865F2]/20"
            >
              <DiscordMark className="h-4 w-4 text-[#7984f5]" />
              {m.auth.continueWithDiscord}
            </button>
          </form>
        )}

        {emailEnabled && (
          <form
            action={async (formData: FormData) => {
              "use server";
              await signIn("nodemailer", {
                email: String(formData.get("email") ?? ""),
                redirectTo: "/path",
              });
            }}
            className="flex flex-col gap-2"
          >
            <input
              type="email"
              name="email"
              required
              placeholder={m.auth.emailPlaceholder}
              className="rounded-md border border-line bg-bg px-3 py-2 font-mono text-[13px] outline-none placeholder:text-muted focus:border-accent/50"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-line-strong bg-white/[0.04] px-4 py-2 font-mono text-[13px] transition hover:bg-white/[0.08]"
            >
              {m.auth.emailMagicLink}
            </button>
          </form>
        )}

        {devEnabled && (
          <form
            action={async (formData: FormData) => {
              "use server";
              await signIn("dev", {
                name: String(formData.get("name") ?? ""),
                redirectTo: "/path",
              });
            }}
            className="flex flex-col gap-2"
          >
            {(githubEnabled || discordEnabled || emailEnabled) && (
              <div className="my-1 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {m.auth.devLogin}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
            )}
            <input
              type="text"
              name="name"
              placeholder={m.auth.devNamePlaceholder}
              className="rounded-md border border-line bg-bg px-3 py-2 font-mono text-[13px] outline-none placeholder:text-muted focus:border-accent/50"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-[13px] text-accent transition hover:bg-accent/20"
            >
              {m.auth.devContinue}
            </button>
          </form>
        )}

        {!githubEnabled && !discordEnabled && !emailEnabled && !devEnabled && (
          <p className="font-mono text-xs text-muted">{m.auth.noProviders}</p>
        )}
      </div>
    </div>
  );
}
