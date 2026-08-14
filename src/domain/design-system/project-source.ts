import { z } from 'zod';
import type { AppLocale } from '@/domain/i18n';
import {
  parseStoredBrandProfile,
  type BrandProfile,
} from './brand-profile.schema';
import {
  componentContractSchema,
  type ComponentContract,
  type ComponentContractType,
} from './component-contract.schema';
import {
  designTokenSchema,
  type DesignToken,
} from './design-token.schema';
import type { ThemeMode } from './theme.schema';

const designTokenArraySchema = z.array(designTokenSchema);

export type DesignSystemProjectSourceProject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
};

export type DesignSystemProjectSourceTokenSet = {
  id: string;
  type: string;
  name: string;
  tokens: DesignToken[];
};

export type DesignSystemProjectSourceTheme = {
  id: string;
  mode: ThemeMode;
  name: string;
  tokens: Record<string, unknown>;
  updatedAt: Date;
};

export type DesignSystemProjectSourceComponent = {
  id: string;
  type: ComponentContractType;
  name: string;
  contract: ComponentContract;
  updatedAt: Date;
};

export type DesignSystemProjectSource = {
  project: DesignSystemProjectSourceProject;
  brand: BrandProfile | null;
  tokenSets: DesignSystemProjectSourceTokenSet[];
  tokens: DesignToken[];
  themes: DesignSystemProjectSourceTheme[];
  components: DesignSystemProjectSourceComponent[];
};

export type DesignSystemProjectSourceInput = {
  project: DesignSystemProjectSourceProject;
  brandProfile: {
    visualStyle: unknown;
    uiDensity: unknown;
    inspirationKeywords: unknown;
    localizedContent: unknown;
  } | null;
  tokenSets: Array<{
    id: string;
    type: string;
    name: string;
    tokens: unknown;
  }>;
  themes: Array<{
    id: string;
    mode: ThemeMode;
    name: string;
    tokens: unknown;
    updatedAt: Date;
  }>;
  componentContracts: Array<{
    id: string;
    type: ComponentContractType;
    name: string;
    contract: unknown;
    updatedAt: Date;
  }>;
};

function parseStoredTokenSetTokens(tokens: unknown): DesignToken[] {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  return parsedTokens.success ? parsedTokens.data : [];
}

function normalizeThemeTokens(tokens: unknown): Record<string, unknown> {
  return typeof tokens === 'object' &&
    tokens !== null &&
    !Array.isArray(tokens)
    ? (tokens as Record<string, unknown>)
    : {};
}

export function createDesignSystemProjectSource({
  project,
  brandProfile,
  tokenSets,
  themes,
  componentContracts,
}: DesignSystemProjectSourceInput): DesignSystemProjectSource {
  const normalizedTokenSets = tokenSets.map((tokenSet) => ({
    id: tokenSet.id,
    type: tokenSet.type,
    name: tokenSet.name,
    tokens: parseStoredTokenSetTokens(tokenSet.tokens),
  }));

  const components = componentContracts.flatMap((componentContract) => {
    const parsedContract = componentContractSchema.safeParse(
      componentContract.contract,
    );

    if (!parsedContract.success) {
      return [];
    }

    return [
      {
        id: componentContract.id,
        type: componentContract.type,
        name: componentContract.name,
        contract: parsedContract.data,
        updatedAt: componentContract.updatedAt,
      },
    ];
  });

  return {
    project,
    brand: brandProfile ? parseStoredBrandProfile(brandProfile) : null,
    tokenSets: normalizedTokenSets,
    tokens: normalizedTokenSets.flatMap((tokenSet) => tokenSet.tokens),
    themes: themes.map((theme) => ({
      id: theme.id,
      mode: theme.mode,
      name: theme.name,
      tokens: normalizeThemeTokens(theme.tokens),
      updatedAt: theme.updatedAt,
    })),
    components,
  };
}
