"use client";

// "Sign in" link that remembers where the player was: /login gets a
// `callbackUrl` pointing at the current path so the OAuth round-trip lands
// them back here. The landing and the login page itself carry no callback.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { withCallback } from "@/lib/safe-redirect";

export function SignInLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const callbackUrl = pathname === "/" || pathname === "/login" ? null : pathname;
  return (
    <Link href={withCallback("/login", callbackUrl)} className={className}>
      {children}
    </Link>
  );
}
