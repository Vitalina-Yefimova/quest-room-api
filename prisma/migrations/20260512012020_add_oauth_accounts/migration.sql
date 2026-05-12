-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('google');

-- AlterTable
ALTER TABLE "public"."Users" ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."OAuthAccounts" (
    "id" SERIAL NOT NULL,
    "provider" "public"."Provider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OAuthAccounts_userId_idx" ON "public"."OAuthAccounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccounts_provider_providerId_key" ON "public"."OAuthAccounts"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccounts_userId_provider_key" ON "public"."OAuthAccounts"("userId", "provider");

-- AddForeignKey
ALTER TABLE "public"."OAuthAccounts" ADD CONSTRAINT "OAuthAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
