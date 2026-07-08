import { auth } from "@/lib/auth";
import { ShatteredSky } from "@/components/landing/ShatteredSky";

// Landing page — "Shattered Sky" cinematic design. Server shell resolves
// the CTA targets; all visuals live in the client component.
export default async function Home() {
  const session = await auth();

  // New visitors get the Mimo-style personalized onboarding before their
  // first skirmish; returning players go straight to the campaign path.
  const beginHref = session?.user ? "/path" : "/onboarding";
  const enterHref = session?.user ? "/path" : "/login";

  return <ShatteredSky beginHref={beginHref} enterHref={enterHref} />;
}
