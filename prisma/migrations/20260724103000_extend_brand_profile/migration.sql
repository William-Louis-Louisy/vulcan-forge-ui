-- CreateEnum
CREATE TYPE "BrandVisualStyle" AS ENUM ('minimal', 'premium', 'editorial', 'technical', 'playful', 'bold', 'neutral', 'custom');

-- CreateEnum
CREATE TYPE "BrandUiDensity" AS ENUM ('compact', 'cozy', 'comfortable');

-- Extend BrandProfile with the structured DS-170-05 model.
ALTER TABLE "BrandProfile"
ADD COLUMN "visualStyle" "BrandVisualStyle",
ADD COLUMN "uiDensity" "BrandUiDensity" NOT NULL DEFAULT 'cozy',
ADD COLUMN "inspirationKeywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "localizedContent" JSONB;

-- Preserve the existing project foundation. The previous enterprise direction is
-- represented by the validated technical style in the new model.
UPDATE "BrandProfile" AS brand
SET
  "visualStyle" = (
    CASE COALESCE(brand."visualDirection", project."visualDirection", 'minimal')
      WHEN 'premium' THEN 'premium'
      WHEN 'editorial' THEN 'editorial'
      WHEN 'technical' THEN 'technical'
      WHEN 'enterprise' THEN 'technical'
      WHEN 'playful' THEN 'playful'
      WHEN 'bold' THEN 'bold'
      WHEN 'neutral' THEN 'neutral'
      WHEN 'custom' THEN 'custom'
      ELSE 'minimal'
    END
  )::"BrandVisualStyle",
  "localizedContent" = CASE
    WHEN brand."description" IS NULL OR BTRIM(brand."description") = '' THEN '{}'::JSONB
    ELSE JSONB_BUILD_OBJECT(
      'shortDescription',
      JSONB_BUILD_OBJECT(project."defaultLocale"::TEXT, brand."description")
    )
  END
FROM "DesignSystem" AS project
WHERE project."id" = brand."projectId";

ALTER TABLE "BrandProfile"
ALTER COLUMN "visualStyle" SET DEFAULT 'minimal',
ALTER COLUMN "visualStyle" SET NOT NULL,
ALTER COLUMN "localizedContent" SET NOT NULL;

-- Remove duplicated and obsolete sources of truth.
ALTER TABLE "BrandProfile"
DROP COLUMN "name",
DROP COLUMN "description",
DROP COLUMN "visualDirection";

ALTER TABLE "DesignSystem"
DROP COLUMN "visualDirection";
