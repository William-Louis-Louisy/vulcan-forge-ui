import { z } from 'zod';
import {
  designTokenSchema,
  componentContractSchema,
  type DesignToken,
  type ComponentContract,
} from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';
import type { AppLocale } from '@/domain/i18n';
import type { AiInstructionsInput } from '@/domain/ai-instructions';

const designTokenArraySchema = z.array(designTokenSchema);

export type AiInstructionsGeneratorInput = Omit<
  AiInstructionsInput,
  'locale' | 'fallbackLocale' | 'strictness' | 'sections'
>;

export type AiInstructionsGeneratorPageData = {
  projectSlug: string;
  fallbackLocale: AppLocale;
  aiInstructionsInput: AiInstructionsGeneratorInput;
};

function parseTokenSetTokens(tokens: unknown): DesignToken[] {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  return parsedTokens.success ? parsedTokens.data : [];
}

function parseComponentContract(contract: unknown): ComponentContract | null {
  const parsedContract = componentContractSchema.safeParse(contract);

  return parsedContract.success ? parsedContract.data : null;
}

export async function getAiInstructionsGeneratorPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<AiInstructionsGeneratorPageData | null> {
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

  const components = project.componentContracts
    .map((componentContract) =>
      parseComponentContract(componentContract.contract),
    )
    .filter((contract): contract is ComponentContract => contract !== null);

  return {
    projectSlug: project.slug,
    fallbackLocale:
      (project.localeSettings?.documentationLocale as AppLocale | undefined) ??
      (project.defaultLocale as AppLocale),
    aiInstructionsInput: {
      project: {
        name: project.name,
        description: project.description,
        defaultLocale: project.defaultLocale as AppLocale,
        supportedLocales: project.supportedLocales as AppLocale[],
      },
      tokens,
      components,
    },
  };
}
