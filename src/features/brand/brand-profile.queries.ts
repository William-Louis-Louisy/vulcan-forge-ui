import type { AppLocale } from '@/domain/i18n';
import type { BrandProfile } from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';
import {
  defaultBrandProfile,
  parseStoredBrandProfile,
} from './brand-profile.utils';

export type BrandProfilePageData = {
  project: {
    id: string;
    name: string;
    slug: string;
    defaultLocale: AppLocale;
    supportedLocales: AppLocale[];
  };
  profile: BrandProfile;
};

export async function getBrandProfilePageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<BrandProfilePageData | null> {
  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      defaultLocale: true,
      supportedLocales: true,
      brandProfile: {
        select: {
          visualStyle: true,
          uiDensity: true,
          inspirationKeywords: true,
          localizedContent: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      defaultLocale: project.defaultLocale as AppLocale,
      supportedLocales: project.supportedLocales as AppLocale[],
    },
    profile: project.brandProfile
      ? parseStoredBrandProfile(project.brandProfile)
      : defaultBrandProfile,
  };
}
