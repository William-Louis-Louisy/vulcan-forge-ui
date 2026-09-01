-- DS-181R-01: introduce stable Component identity independently from the legacy type.
-- Existing records stay on contractVersion=1 and are normalized to V2 in the domain adapter.
-- This keeps the migration reversible while Components V2 remains on its integration branch.

ALTER TABLE "ComponentContract"
ADD COLUMN "key" TEXT,
ADD COLUMN "templateKey" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "contractVersion" INTEGER NOT NULL DEFAULT 1;

UPDATE "ComponentContract"
SET
  "key" = "type"::text,
  "templateKey" = "type"::text,
  "category" = CASE "type"::text
    WHEN 'button' THEN 'action'
    WHEN 'textField' THEN 'input'
    WHEN 'card' THEN 'layout'
    WHEN 'alert' THEN 'feedback'
    WHEN 'dialog' THEN 'overlay'
    ELSE 'other'
  END;

ALTER TABLE "ComponentContract"
ALTER COLUMN "key" SET NOT NULL,
ALTER COLUMN "templateKey" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL;

DROP INDEX "ComponentContract_projectId_type_key";

CREATE UNIQUE INDEX "ComponentContract_projectId_key_key"
ON "ComponentContract"("projectId", "key");

CREATE INDEX "ComponentContract_projectId_templateKey_idx"
ON "ComponentContract"("projectId", "templateKey");
