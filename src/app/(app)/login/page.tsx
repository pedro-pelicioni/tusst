import { redirect } from "next/navigation";
import { auth, signIn, devLoginEnabled } from "@/lib/auth";
import { DiscordMark, GitHubMark, Sparkle } from "@/components/icons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/path");

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
        <span className="grid h-8 w-8 place-items-center rounded-md border border-accent/40 bg-accent/10 text-accent">
          <Sparkle className="h-4 w-4" />
        </span>
        <span className="font-mono text-sm font-semibold tracking-[0.22em]">
          TUSST
        </span>
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted2">
        Track your progress across every challenge.
      </p>

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
              className="flex w-full items-center justify-center gap-2.5 rounded-md border border-line-strong bg-white/[0.04] px-4 py-2.5 font-mono text-sm transition hover:bg-white/[0.08]"
            >
              <GitHubMark className="h-4 w-4" />
              Continue with GitHub
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
              className="flex w-full items-center justify-center gap-2.5 rounded-md border border-[#5865F2]/40 bg-[#5865F2]/10 px-4 py-2.5 font-mono text-sm transition hover:bg-[#5865F2]/20"
            >
              <DiscordMark className="h-4 w-4 text-[#7984f5]" />
              Continue with Discord
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
              placeholder="you@email.com"
              className="rounded-md border border-line bg-bg px-3 py-2.5 font-mono text-sm outline-none placeholder:text-muted focus:border-accent/50"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-line-strong bg-white/[0.04] px-4 py-2.5 font-mono text-sm transition hover:bg-white/[0.08]"
            >
              Email me a magic link
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
                  dev login
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
            )}
            <input
              type="text"
              name="name"
              placeholder="pick a name"
              className="rounded-md border border-line bg-bg px-3 py-2.5 font-mono text-sm outline-none placeholder:text-muted focus:border-accent/50"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-sm text-accent transition hover:bg-accent/20"
            >
              Continue
            </button>
          </form>
        )}

        {!githubEnabled && !discordEnabled && !emailEnabled && !devEnabled && (
          <p className="font-mono text-xs text-muted">
            No auth providers are configured. Set AUTH_DEV_LOGIN=true in local
            dev (or GitHub / Discord / email env vars) to enable sign-in.
          </p>
        )}
      </div>
    </div>
  );
}
