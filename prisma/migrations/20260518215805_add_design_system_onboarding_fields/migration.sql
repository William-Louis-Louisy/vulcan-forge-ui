-- CreateEnum
CREATE TYPE "DesignSystemPlatform" AS ENUM ('web', 'mobile');

-- CreateEnum
CREATE TYPE "AccessibilityTarget" AS ENUM ('wcag_aa', 'wcag_aaa');

-- AlterTable
ALTER TABLE "DesignSystem" ADD COLUMN     "accessibilityTarget" "AccessibilityTarget" NOT NULL DEFAULT 'wcag_aa',
ADD COLUMN     "defaultLocale" "AppLocale" NOT NULL DEFAULT 'en',
ADD COLUMN     "platforms" "DesignSystemPlatform"[] DEFAULT ARRAY['web']::"DesignSystemPlatform"[],
ADD COLUMN     "supportedLocales" "AppLocale"[] DEFAULT ARRAY['en', 'fr']::"AppLocale"[],
ADD COLUMN     "visualDirection" TEXT;
