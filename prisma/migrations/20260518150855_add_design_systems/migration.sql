-- CreateTable
CREATE TABLE "DesignSystem" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignSystem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignSystem_workspaceId_idx" ON "DesignSystem"("workspaceId");

-- CreateIndex
CREATE INDEX "DesignSystem_updatedAt_idx" ON "DesignSystem"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DesignSystem_workspaceId_slug_key" ON "DesignSystem"("workspaceId", "slug");

-- AddForeignKey
ALTER TABLE "DesignSystem" ADD CONSTRAINT "DesignSystem_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
