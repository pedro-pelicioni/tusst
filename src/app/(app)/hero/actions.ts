"use server";

// Persist the hero pick. Called by <HeroPicker> via a plain <form action>,
// so it works before hydration too. Validates the id against the hero
// registry, upserts the Character (a fresh account may not have one yet),
// refreshes the surfaces that draw the hero and returns the player to
// wherever the picker was opened from.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isHeroId } from "@/content/heroes";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { safeCallbackUrl } from "@/lib/safe-redirect";

export async function chooseHero(formData: FormData): Promise<void> {
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"), "/path");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?callbackUrl=%2Fhero");

  const heroId = formData.get("heroId");
  if (!isHeroId(heroId)) {
    // Tampered / empty submission: back to the picker, keep the destination.
    redirect(`/hero?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  await prisma.character.upsert({
    where: { userId },
    create: { userId, heroId },
    update: { heroId },
  });

  revalidatePath("/path");
  revalidatePath("/journey");
  revalidatePath("/campaign");
  revalidatePath("/harbor");

  redirect(callbackUrl);
}
