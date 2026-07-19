-- AlterTable
ALTER TABLE "MentorHint" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'lesson',
ALTER COLUMN "lessonId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RavenToken" (
    "id" TEXT NOT NULL DEFAULT 'raven',
    "clientId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RavenToken_pkey" PRIMARY KEY ("id")
);
