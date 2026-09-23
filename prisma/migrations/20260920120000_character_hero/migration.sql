-- Character.heroId: the hero chosen once at /hero (src/content/heroes.ts id).
-- Null until chosen. IF NOT EXISTS keeps a re-run harmless.
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "heroId" TEXT;
