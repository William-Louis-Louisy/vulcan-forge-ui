import { z } from 'zod';
import type {
  MarkdownDocumentationInput,
  MarkdownDocumentationTheme,
} from '@/domain/documentation';
import {
  designTokenSchema,
  componentContractSchema,
  type DesignToken,
  type ComponentContract,
} from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';
import type { AppLocale } from '@/domain/i18n';
import { createAccessibilityCenterReport } from '@/features/accessibility/accessibility-center.utils';

const designTokenArraySchema = z.array(designTokenSchema);

export type DocumentationGeneratorInput = Omit<
  MarkdownDocumentationInput,
  'locale' | 'fallbackLocale' | 'sections'
>;

export type DocumentationGeneratorPageData = {
  projectSlug: string;
  fallbackLocale: AppLocale;
  documentationInput: DocumentationGeneratorInput;
};

function parseTokenSetTokens(tokens: unknown): DesignToken[] {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  return parsedTokens.success ? parsedTokens.data : [];
}

function parseComponentContract(contract: unknown): ComponentContract | null {
  const parsedContract = componentContractSchema.safeParse(contract);

  return parsedContract.success ? parsedContract.data : null;
}

function asThemeTokens(tokens: unknown): Record<string, unknown> {
  return typeof tokens === 'object' && tokens !== null
    ? (tokens as Record<string, unknown>)
    : {};
}

export async function getDocumentationGeneratorPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<DocumentationGeneratorPageData | null> {
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
      description: true,
      defaultLocale: true,
      supportedLocales: true,
      localeSettings: {
        select: {
          documentationLocale: true,
        },
      },
      tokenSets: {
        orderBy: {
          type: 'asc',
        },
        select: {
          type: true,
          tokens: true,
        },
      },
      themes: {
        orderBy: {
          mode: 'asc',
        },
        select: {
          mode: true,
          name: true,
          tokens: true,
        },
      },
      componentContracts: {
        orderBy: {
          type: 'asc',
        },
        select: {
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const tokens = project.tokenSets.flatMap((tokenSet) =>
    parseTokenSetTokens(tokenSet.tokens),
  );

  const themes: MarkdownDocumentationTheme[] = project.themes.map((theme) => ({
    mode: theme.mode as MarkdownDocumentationTheme['mode'],
    name: theme.name,
    tokens: asThemeTokens(theme.tokens),
  }));

  const components = project.componentContracts
    .map((componentContract) =>
      parseComponentContract(componentContract.contract),
    )
    .filter((contract): contract is ComponentContract => contract !== null);

  const colorTokenSet = project.tokenSets.find(
    (tokenSet) => tokenSet.type === 'color',
  );

  const accessibilityReport = colorTokenSet
    ? createAccessibilityCenterReport(colorTokenSet.tokens)
    : null;

  return {
    projectSlug: project.slug,
    fallbackLocale:
      (project.localeSettings?.documentationLocale as AppLocale | undefined) ??
      (project.defaultLocale as AppLocale),
    documentationInput: {
      project: {
        name: project.name,
        description: project.description,
        defaultLocale: project.defaultLocale as AppLocale,
        supportedLocales: project.supportedLocales as AppLocale[],
      },
      tokens,
      themes,
      components,
      accessibility: accessibilityReport
        ? {
            score: accessibilityReport.score,
            status: accessibilityReport.status,
            contrastPairs: accessibilityReport.contrastPairs,
          }
        : null,
    },
  };
}
