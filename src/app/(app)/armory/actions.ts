"use server";

// Buy and equip Armory cosmetics. Called by <ArmoryShop> through plain
// <form action> submissions, so the shop works before hydration and without
// JS — same contract as the hero picker (src/app/(app)/hero/actions.ts).
//
// Two invariants the client can never talk its way past:
//
//   1. THE PRICE IS OURS. The form sends an item id, never an amount; the
//      price comes from src/content/armory.ts on the server.
//   2. GOLD NEVER GOES NEGATIVE AND NOTHING IS BOUGHT TWICE. The conditional
//      `updateMany` re-evaluates `gold >= price` under the row lock, and the
//      unique index on (userId, itemId) aborts a concurrent duplicate with
//      P2002 — the same shape as the credit-exactly-once transaction in
//      src/app/api/submissions/route.ts, run in reverse.
//
// Failures come back as a query flag the page renders (?err=funds), because a
// server action that has to work without JS cannot return a value to the DOM.

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { armoryItem, isArmorySlot, type ArmorySlot } from "@/content/armory";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Query flags the Armory page turns into a visible banner. */
export type ArmoryError = "funds" | "locked" | "unknown-item";

function back(slot: ArmorySlot | null, err?: ArmoryError): never {
  const params = new URLSearchParams();
  if (slot) params.set("slot", slot);
  if (err) params.set("err", err);
  const query = params.toString();
  redirect(query ? `/armory?${query}` : "/armory");
}

async function requireUser(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?callbackUrl=%2Farmory");
  return userId;
}

export async function buyItem(formData: FormData): Promise<void> {
  const userId = await requireUser();
  const item = armoryItem(formData.get("itemId")?.toString());
  if (!item) back(null, "unknown-item");

  try {
    await prisma.$transaction(async (tx) => {
      // Every loadout write for this player serialises on their own User row.
      // Without it, READ COMMITTED lets a concurrent equip and this buy each
      // see the other's slot as empty and both commit — two pieces worn in one
      // slot. The lock is taken first in BOTH actions, so the order is total.
      await tx.$executeRaw`SELECT 1 FROM "User" WHERE "id" = ${userId} FOR UPDATE`;

      // The ownership row goes in FIRST: its unique (userId, itemId) index is
      // what makes a double-click physically unable to charge twice.
      await tx.armoryPiece.create({
        data: {
          userId,
          itemId: item.id,
          slot: item.slot,
          paid: item.price,
          equipped: true, // buying equips it — one action, not two
        },
      });

      // Charge. `gte` inside the WHERE is the balance check: if the player
      // cannot afford it (or the shop is not unlocked for them), no row
      // matches, nothing is decremented, and the throw below rolls the
      // ownership row back out.
      const charged = await tx.user.updateMany({
        where: { id: userId, goldRevealed: true, gold: { gte: item.price } },
        data: { gold: { decrement: item.price } },
      });
      if (charged.count !== 1) {
        const reason: ArmoryError = (await tx.user.findUnique({
          where: { id: userId },
          select: { goldRevealed: true },
        }))?.goldRevealed
          ? "funds"
          : "locked";
        throw new ArmoryRefused(reason);
      }

      // Newly bought piece takes the slot; the previous occupant steps down.
      await tx.armoryPiece.updateMany({
        where: { userId, slot: item.slot, equipped: true, itemId: { not: item.id } },
        data: { equipped: false },
      });
    });
  } catch (e) {
    if (e instanceof ArmoryRefused) back(item.slot, e.reason);
    // Already owned (P2002, caught OUTSIDE the transaction like every other
    // replay guard in this codebase) — a double submit, not an error. Fall
    // through to the redirect so the shop just shows it as owned.
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) {
      throw e;
    }
  }

  // The pouch chip lives in <Nav>, which is rendered by the (app) layout —
  // revalidating the pages alone leaves a stale gold total in the header
  // (same reason as the locale switch, src/i18n/actions.ts).
  revalidatePath("/", "layout");
  revalidatePath("/armory");
  revalidatePath("/profile");
  back(item.slot);
}

export async function equipItem(formData: FormData): Promise<void> {
  const userId = await requireUser();

  // An empty itemId with a slot means "take this slot off".
  const rawSlot = formData.get("slot")?.toString();
  const itemId = formData.get("itemId")?.toString();

  if (!itemId) {
    if (!isArmorySlot(rawSlot)) back(null, "unknown-item");
    await prisma.armoryPiece.updateMany({
      where: { userId, slot: rawSlot, equipped: true },
      data: { equipped: false },
    });
    revalidatePath("/", "layout");
    revalidatePath("/armory");
    revalidatePath("/profile");
    back(rawSlot);
  }

  const item = armoryItem(itemId);
  if (!item) back(isArmorySlot(rawSlot) ? rawSlot : null, "unknown-item");

  // Order matters, and it is the reverse of the obvious one. Standing the
  // incumbent down first meant an id the player does NOT own (a stale tab, a
  // tampered POST) emptied the slot and put nothing back — the second statement
  // matched no row and said nothing about it. So: stand the new piece up first,
  // and let its match count BE the ownership check. Zero rows means the id is
  // not theirs, and the throw rolls back before anything was taken off.
  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT 1 FROM "User" WHERE "id" = ${userId} FOR UPDATE`;

      const worn = await tx.armoryPiece.updateMany({
        where: { userId, itemId: item.id },
        data: { equipped: true },
      });
      if (worn.count !== 1) throw new ArmoryRefused("unknown-item");

      await tx.armoryPiece.updateMany({
        where: { userId, slot: item.slot, equipped: true, itemId: { not: item.id } },
        data: { equipped: false },
      });
    });
  } catch (e) {
    // Caught OUTSIDE the transaction, like every other guard in this codebase.
    if (e instanceof ArmoryRefused) back(item.slot, e.reason);
    throw e;
  }

  revalidatePath("/", "layout");
  revalidatePath("/armory");
  revalidatePath("/profile");
  back(item.slot);
}

/** Internal: unwinds the transaction and names the banner to show. */
class ArmoryRefused extends Error {
  constructor(readonly reason: ArmoryError) {
    super(reason);
  }
}
