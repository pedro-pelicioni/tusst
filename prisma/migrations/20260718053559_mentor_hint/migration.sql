-- CreateTable
CREATE TABLE "MentorHint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "submissionId" TEXT,
    "locale" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorHint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorHint_submissionId_key" ON "MentorHint"("submissionId");

-- CreateIndex
CREATE INDEX "MentorHint_userId_createdAt_idx" ON "MentorHint"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MentorHint_userId_lessonId_createdAt_idx" ON "MentorHint"("userId", "lessonId", "createdAt");

-- AddForeignKey
ALTER TABLE "MentorHint" ADD CONSTRAINT "MentorHint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorHint" ADD CONSTRAINT "MentorHint_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
