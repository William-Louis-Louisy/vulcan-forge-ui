import type { Prisma } from '@/generated/prisma/client';
import {
  createDesignSystemProjectSource,
  type ComponentContractType,
  type DesignSystemProjectSource,
  type ThemeMode,
} from '@/domain/design-system';
import type { AppLocale } from '@/domain/i18n';
import { prisma } from '@/server/db/prisma';

const designSystemProjectSourceSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
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
  tokenSets: {
    orderBy: {
      type: 'asc',
    },
    select: {
      id: true,
      type: true,
      name: true,
      tokens: true,
    },
  },
  themes: {
    orderBy: {
      mode: 'asc',
    },
    select: {
      id: true,
      mode: true,
      name: true,
      tokens: true,
      updatedAt: true,
    },
  },
  componentContracts: {
    orderBy: {
      type: 'asc',
    },
    select: {
      id: true,
      type: true,
      name: true,
      contract: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.DesignSystemProjectSelect;

const designSystemProjectConsumerSnapshotSelect = {
  ...designSystemProjectSourceSelect,
  documentationProfile: {
    select: {
      content: true,
    },
  },
  aiInstructionProfile: {
    select: {
      content: true,
    },
  },
  localeSettings: {
    select: {
      documentationLocale: true,
      aiInstructionLocale: true,
    },
  },
  exportLogs: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 8,
    select: {
      id: true,
      format: true,
      locale: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
  },
} satisfies Prisma.DesignSystemProjectSelect;

type DesignSystemProjectSourceRecord = Prisma.DesignSystemProjectGetPayload<{
  select: typeof designSystemProjectSourceSelect;
}>;

type DesignSystemProjectConsumerSnapshotRecord =
  Prisma.DesignSystemProjectGetPayload<{
    select: typeof designSystemProjectConsumerSnapshotSelect;
  }>;

export type DesignSystemProjectConsumerSnapshot = {
  source: DesignSystemProjectSource;
  documentationProfileContent: unknown | null;
  aiInstructionProfileContent: unknown | null;
  localeSettings: {
    documentationLocale: string | null;
    aiInstructionLocale: string | null;
  } | null;
  exportLogs: Array<{
    id: string;
    format: string;
    locale: string | null;
    status: string;
    errorMessage: string | null;
    createdAt: Date;
  }>;
};

function createProjectSource(
  project: DesignSystemProjectSourceRecord,
): DesignSystemProjectSource {
  return createDesignSystemProjectSource({
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      defaultLocale: project.defaultLocale as AppLocale,
      supportedLocales: project.supportedLocales as AppLocale[],
    },
    brandProfile: project.brandProfile,
    tokenSets: project.tokenSets,
    themes: project.themes.map((theme) => ({
      ...theme,
      mode: theme.mode as ThemeMode,
    })),
    componentContracts: project.componentContracts.map((componentContract) => ({
      ...componentContract,
      type: componentContract.type as ComponentContractType,
    })),
  });
}

function createConsumerSnapshot(
  project: DesignSystemProjectConsumerSnapshotRecord,
): DesignSystemProjectConsumerSnapshot {
  return {
    source: createProjectSource(project),
    documentationProfileContent: project.documentationProfile?.content ?? null,
    aiInstructionProfileContent: project.aiInstructionProfile?.content ?? null,
    localeSettings: project.localeSettings,
    exportLogs: project.exportLogs,
  };
}

export async function getDesignSystemProjectSourceForUser({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<DesignSystemProjectSource | null> {
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
    select: designSystemProjectSourceSelect,
  });

  return project ? createProjectSource(project) : null;
}

export async function getDesignSystemProjectConsumerSnapshotForUser({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<DesignSystemProjectConsumerSnapshot | null> {
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
    select: designSystemProjectConsumerSnapshotSelect,
  });

  return project ? createConsumerSnapshot(project) : null;
}
