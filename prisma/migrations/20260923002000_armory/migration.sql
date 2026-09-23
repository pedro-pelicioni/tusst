-- The Armory: per-user cosmetic ownership. The catalog (ids, prices, sheet
-- cells) is pure TS in src/content/armory.ts — this table only records who
-- owns what, what they paid, and what is equipped.
--
-- IF NOT EXISTS / IF EXISTS throughout keeps a re-run harmless, matching
-- 20260920120000_character_hero.

-- CreateTable
CREATE TABLE IF NOT EXISTS "ArmoryPiece" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "paid" INTEGER NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArmoryPiece_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- The buy guard: a double purchase aborts with P2002 instead of charging twice.
CREATE UNIQUE INDEX IF NOT EXISTS "ArmoryPiece_userId_itemId_key" ON "ArmoryPiece"("userId", "itemId");

-- CreateIndex
-- The equip swap reads one slot's rows for one player.
CREATE INDEX IF NOT EXISTS "ArmoryPiece_userId_slot_idx" ON "ArmoryPiece"("userId", "slot");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "ArmoryPiece" ADD CONSTRAINT "ArmoryPiece_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
