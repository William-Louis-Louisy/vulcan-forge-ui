import type {
  AccessibilityTarget,
  AppLocale,
  DesignSystemPlatform,
} from '@/generated/prisma/client';
import { prisma } from '@/server/db/prisma';
import { buildDesignSystemProjectFoundation } from './create-design-system-project.foundation';

export type CreateDesignSystemProjectServiceInput = {
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  platforms: DesignSystemPlatform[];
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
  visualDirection: string;
  accessibilityTarget: AccessibilityTarget;
};

export async function createDesignSystemProject(
  input: CreateDesignSystemProjectServiceInput,
) {
  const foundation = buildDesignSystemProjectFoundation({
    name: input.name,
    description: input.description,
    platforms: input.platforms,
    defaultLocale: input.defaultLocale,
    supportedLocales: input.supportedLocales,
    visualDirection: input.visualDirection,
    accessibilityTarget: input.accessibilityTarget,
  });

  return prisma.designSystemProject.create({
    data: {
      workspaceId: input.workspaceId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      platforms: input.platforms,
      defaultLocale: input.defaultLocale,
      supportedLocales: input.supportedLocales,
      visualDirection: input.visualDirection,
      accessibilityTarget: input.accessibilityTarget,
      ...foundation,
    },
    select: {
      id: true,
      slug: true,
    },
  });
}
