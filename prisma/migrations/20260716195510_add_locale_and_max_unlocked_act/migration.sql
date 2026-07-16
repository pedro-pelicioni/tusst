-- AlterTable
-- IF NOT EXISTS: this column may already be present on databases where an
-- earlier `prisma db push` applied it out-of-band, without recording a
-- migration (Neon, at time of writing) — see memory `tusst-seed-safety`.
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "maxUnlockedAct" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
-- IF NOT EXISTS: same drift as above — `locale` already exists on databases
-- pushed out-of-band during the i18n feature, before this migration existed.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'en';
