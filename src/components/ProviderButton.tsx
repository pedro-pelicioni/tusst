"use client";

// Submit button for a provider sign-in form. Records the click for
// analytics and then lets the surrounding <form> submit its server action
// untouched (no preventDefault).

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProviderButton({
  provider,
  children,
  className,
}: {
  provider: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={() => trackEvent("login_provider_click", { provider })}
    >
      {children}
    </button>
  );
}
