import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn, devLoginEnabled } from "@/lib/auth";
import { safeCallbackUrl } from "@/lib/safe-redirect";
import { DiscordMark, GitHubMark } from "@/components/icons";
import { ProviderButton } from "@/components/ProviderButton";
import { TrackView } from "@/components/TrackView";
import { getMessages } from "@/i18n/server";
import type { Messages } from "@/i18n/messages";

// The gate of the realm. Login-first entry: the landing CTA lands here,
// GitHub / Discord are the two doors, and `callbackUrl` (validated, app
// relative only) is threaded through every sign-in so the OAuth round-trip
// drops the player exactly where they were. Auth.js also sends its error
// page here (`pages.error`), so `?error=<code>` renders a branded block.

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages();
  return { title: m.auth.metaTitle };
}

// Auth.js error codes we have copy for. Everything else reads the default.
const KNOWN_ERROR_CODES = [
  "OAuthAccountNotLinked",
  "OAuthCallbackError",
  "OAuthSignin",
  "AccessDenied",
  "Configuration",
  "Verification",
] as const satisfies readonly (keyof Messages["auth"]["errors"])[];

type KnownErrorCode = (typeof KNOWN_ERROR_CODES)[number];

function isKnownErrorCode(code: string): code is KnownErrorCode {
  return (KNOWN_ERROR_CODES as readonly string[]).includes(code);
}

function describeAuthError(errors: Messages["auth"]["errors"], code: string): string {
  return isKnownErrorCode(code) ? errors[code] : errors.default;
}

const PRIMARY_BUTTON =
  "flex w-full items-center justify-center gap-3 border-2 border-ow-frame-light bg-[linear-gradient(#bd4551,#a32c3c_48%,#812130_50%,#942635)] px-4 py-3 font-pixel text-[12px] uppercase tracking-[0.12em] text-ow-parchment shadow-[0_2px_0_#3a2416] transition hover:brightness-110 active:translate-y-px active:shadow-none";

const QUIET_INPUT =
  "border-2 border-ow-frame bg-ow-parchment2/60 px-3 py-2 font-mono text-[13px] text-ow-ink outline-none placeholder:text-ow-ink-muted focus:border-ow-crimson";

const QUIET_BUTTON =
  "w-full border-2 border-ow-frame bg-ow-parchment2/40 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ow-ink transition hover:bg-ow-parchment2";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = safeCallbackUrl(sp.callbackUrl);

  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  const m = await getMessages();

  const githubEnabled = !!(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  );
  const discordEnabled = !!(
    process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
  );
  const emailEnabled = !!process.env.AUTH_EMAIL_SERVER;
  const devEnabled = devLoginEnabled;

  const anyPrimary = githubEnabled || discordEnabled;
  const anySecondary = emailEnabled || devEnabled;
  const errorCode = sp.error?.trim() || null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-stretch px-4 py-16 sm:py-20">
      <TrackView name="login_view" props={{ error: errorCode ?? "" }} />

      <section className="border-[3px] border-ow-frame bg-ow-parchment text-ow-ink shadow-[var(--ow-gilding)]">
        <header className="bg-ow-crimson px-4 py-2 font-pixel text-[11px] uppercase tracking-[0.2em] text-ow-parchment">
          ◆ TUSST · {m.auth.kicker}
        </header>

        <div className="flex flex-col gap-5 px-5 py-6 sm:px-6">
          <div>
            <h1 className="font-pixel text-xl leading-tight sm:text-2xl">{m.auth.signIn}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ow-ink-muted">{m.auth.tagline}</p>
          </div>

          {errorCode && (
            <div
              role="alert"
              className="border-2 border-ow-crimson bg-ow-crimson/10 px-4 py-3"
            >
              <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-ow-crimson">
                {m.auth.errors.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ow-ink">
                {describeAuthError(m.auth.errors, errorCode)}
              </p>
            </div>
          )}

          {anyPrimary && (
            <div className="flex flex-col gap-3">
              {githubEnabled && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: callbackUrl });
                  }}
                >
                  <ProviderButton provider="github" className={PRIMARY_BUTTON}>
                    <GitHubMark className="h-4 w-4" />
                    {m.auth.continueWithGitHub}
                  </ProviderButton>
                </form>
              )}

              {discordEnabled && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("discord", { redirectTo: callbackUrl });
                  }}
                >
                  <ProviderButton provider="discord" className={PRIMARY_BUTTON}>
                    <DiscordMark className="h-4 w-4" />
                    {m.auth.continueWithDiscord}
                  </ProviderButton>
                </form>
              )}
            </div>
          )}

          {anySecondary && (
            <div className="flex flex-col gap-4">
              {anyPrimary && <hr className="border-0 border-t border-ow-frame/60" />}

              {emailEnabled && (
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    await signIn("nodemailer", {
                      email: String(formData.get("email") ?? ""),
                      redirectTo: callbackUrl,
                    });
                  }}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={m.auth.emailPlaceholder}
                    className={QUIET_INPUT}
                  />
                  <ProviderButton provider="email" className={QUIET_BUTTON}>
                    {m.auth.emailMagicLink}
                  </ProviderButton>
                </form>
              )}

              {devEnabled && (
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    await signIn("dev", {
                      name: String(formData.get("name") ?? ""),
                      redirectTo: callbackUrl,
                    });
                  }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-ow-frame/60" />
                    <span className="font-pixel text-[10px] uppercase tracking-[0.18em] text-ow-ink-muted">
                      {m.auth.devLogin}
                    </span>
                    <span className="h-px flex-1 bg-ow-frame/60" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder={m.auth.devNamePlaceholder}
                    className={QUIET_INPUT}
                  />
                  <ProviderButton provider="dev" className={QUIET_BUTTON}>
                    {m.auth.devContinue}
                  </ProviderButton>
                </form>
              )}
            </div>
          )}

          {!anyPrimary && !anySecondary && (
            <p className="font-mono text-xs leading-relaxed text-ow-ink-muted">
              {m.auth.noProviders}
            </p>
          )}
        </div>
      </section>

      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-[12px] text-muted2">{m.auth.note}</p>
        {callbackUrl !== "/path" && (
          <p className="font-mono text-[12px] text-muted">{m.auth.continueTo}</p>
        )}
        <Link
          href="/"
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted2 transition hover:text-fg"
        >
          {m.auth.backHome}
        </Link>
      </div>
    </div>
  );
}
