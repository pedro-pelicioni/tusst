"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
} from "@/i18n/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Persist the chosen locale: cookie for everyone (anonymous onboarding
// included), plus User.locale for signed-in players so the choice follows
// them across devices.
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  const session = await auth();
  if (session?.user?.id) {
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { locale },
      });
    } catch {
      // Cookie already set — a failed DB write must not block the switch.
    }
  }

  revalidatePath("/", "layout");
}
