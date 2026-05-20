-- CreateEnum
CREATE TYPE "AccessibilityReportStatus" AS ENUM ('pass', 'warning', 'fail');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('cssVariables', 'tailwindV4', 'typescriptTheme', 'reactNativeTheme', 'markdownDocumentation', 'aiInstructions');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('success', 'failed');

-- AlterTable
ALTER TABLE "ProjectLocaleSettings" ADD COLUMN     "aiInstructionLocale" "AppLocale" NOT NULL DEFAULT 'en',
ADD COLUMN     "documentationLocale" "AppLocale" NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "AccessibilityReport" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "AccessibilityReportStatus" NOT NULL,
    "score" INTEGER NOT NULL,
    "issues" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessibilityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "locale" "AppLocale",
    "status" "ExportStatus" NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessibilityReport_projectId_idx" ON "AccessibilityReport"("projectId");

-- CreateIndex
CREATE INDEX "AccessibilityReport_status_idx" ON "AccessibilityReport"("status");

-- CreateIndex
CREATE INDEX "AccessibilityReport_createdAt_idx" ON "AccessibilityReport"("createdAt");

-- CreateIndex
CREATE INDEX "ExportLog_projectId_idx" ON "ExportLog"("projectId");

-- CreateIndex
CREATE INDEX "ExportLog_format_idx" ON "ExportLog"("format");

-- CreateIndex
CREATE INDEX "ExportLog_status_idx" ON "ExportLog"("status");

-- CreateIndex
CREATE INDEX "ExportLog_createdAt_idx" ON "ExportLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AccessibilityReport" ADD CONSTRAINT "AccessibilityReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportLog" ADD CONSTRAINT "ExportLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
