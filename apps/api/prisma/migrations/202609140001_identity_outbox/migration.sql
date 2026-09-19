CREATE TABLE "IdentityOutbox" (
  "id" UUID NOT NULL,
  "payloadCipher" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leaseUntil" TIMESTAMP(3),
  "leaseId" UUID,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "deliveredAt" TIMESTAMP(3),
  "exhaustedAt" TIMESTAMP(3),
  CONSTRAINT "IdentityOutbox_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "IdentityOutbox_attempts_nonnegative" CHECK ("attempts" >= 0)
);
CREATE INDEX "IdentityOutbox_deliveredAt_exhaustedAt_availableAt_idx" ON "IdentityOutbox"("deliveredAt", "exhaustedAt", "availableAt");
