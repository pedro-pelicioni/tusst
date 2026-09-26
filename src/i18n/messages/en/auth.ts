// Login page.
export const auth = {
  metaTitle: "Sign in — TUSST",
  kicker: "your journey starts here",
  signIn: "Enter the realm",
  tagline: "Sign in to save your hero, your XP and every mission you clear.",
  note: "No password, no form — one click and you're on the map.",
  backHome: "← Back to the landing",
  privacyLink: "How we handle your data",
  continueTo: "You'll be sent back to where you were.",
  errors: {
    title: "The gate didn't open",
    OAuthAccountNotLinked:
      "This email is already linked to another sign-in method. Use the provider you first signed up with.",
    OAuthCallbackError: "The provider didn't answer. Try again in a moment.",
    OAuthSignin: "We couldn't start the sign-in with that provider. Try again.",
    AccessDenied: "The provider denied access. Try again or use the other provider.",
    Configuration: "Sign-in is misconfigured on our side. Try again in a few minutes.",
    Verification: "That sign-in link expired or was already used. Request a new one.",
    default: "Something went wrong while signing in. Try again.",
  },
  continueWithGitHub: "Continue with GitHub",
  continueWithDiscord: "Continue with Discord",
  emailPlaceholder: "you@email.com",
  emailMagicLink: "Email me a magic link",
  devLogin: "dev login",
  devNamePlaceholder: "pick a name",
  devContinue: "Continue",
  noProviders:
    "No auth providers are configured. Set AUTH_DEV_LOGIN=true in local dev (or GitHub / Discord / email env vars) to enable sign-in.",
};
