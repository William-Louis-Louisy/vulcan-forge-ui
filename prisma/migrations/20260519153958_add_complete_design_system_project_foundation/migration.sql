-- CreateEnum
CREATE TYPE "TokenSetType" AS ENUM ('color', 'spacing', 'radius', 'typography', 'motion');

-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('light', 'dark');

-- CreateEnum
CREATE TYPE "ComponentContractType" AS ENUM ('button', 'textField', 'card', 'alert', 'dialog');

-- CreateTable
CREATE TABLE "ProjectLocaleSettings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "defaultLocale" "AppLocale" NOT NULL DEFAULT 'en',
    "supportedLocales" "AppLocale"[] DEFAULT ARRAY['en', 'fr']::"AppLocale"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLocaleSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visualDirection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenSet" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "TokenSetType" NOT NULL,
    "name" TEXT NOT NULL,
    "tokens" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "mode" "ThemeMode" NOT NULL,
    "name" TEXT NOT NULL,
    "tokens" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentContract" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ComponentContractType" NOT NULL,
    "name" TEXT NOT NULL,
    "contract" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentationProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'markdown',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInstructionProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiInstructionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLocaleSettings_projectId_key" ON "ProjectLocaleSettings"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_projectId_key" ON "BrandProfile"("projectId");

-- CreateIndex
CREATE INDEX "TokenSet_projectId_idx" ON "TokenSet"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenSet_projectId_type_key" ON "TokenSet"("projectId", "type");

-- CreateIndex
CREATE INDEX "Theme_projectId_idx" ON "Theme"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_projectId_mode_key" ON "Theme"("projectId", "mode");

-- CreateIndex
CREATE INDEX "ComponentContract_projectId_idx" ON "ComponentContract"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentContract_projectId_type_key" ON "ComponentContract"("projectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentationProfile_projectId_key" ON "DocumentationProfile"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "AiInstructionProfile_projectId_key" ON "AiInstructionProfile"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectLocaleSettings" ADD CONSTRAINT "ProjectLocaleSettings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenSet" ADD CONSTRAINT "TokenSet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentContract" ADD CONSTRAINT "ComponentContract_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentationProfile" ADD CONSTRAINT "DocumentationProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInstructionProfile" ADD CONSTRAINT "AiInstructionProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
