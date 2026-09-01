import { z } from 'zod';
import type { AppLocale } from '@/domain/i18n';
import {
  parseStoredBrandProfile,
  type BrandProfile,
} from './brand-profile.schema';
import {
  type ComponentContract,
  type ComponentContractType,
} from './component-contract.schema';
import {
  parseStoredComponentContractV2,
  toLegacyComponentContract,
  type ComponentCategory,
  type ComponentContractV2,
} from './component-contract-v2.schema';
import { designTokenSchema, type DesignToken } from './design-token.schema';
import {
  jsonValueSchema,
  type JsonValue,
  type ThemeMode,
} from './theme.schema';

const designTokenArraySchema = z.array(designTokenSchema);
const themeTokensSchema = z.record(z.string(), jsonValueSchema);

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
  isMalformed: boolean;
};

export type DesignSystemProjectSourceTheme = {
  id: string;
  mode: ThemeMode;
  name: string;
  tokens: Record<string, JsonValue>;
  updatedAt: Date;
};

export type DesignSystemProjectSourceComponent = {
  id: string;
  key: string;
  templateKey: string;
  category: ComponentCategory;
  contractVersion: number;
  type: ComponentContractType;
  name: string;
  contract: ComponentContract;
  contractV2: ComponentContractV2;
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
    key: string;
    templateKey: string;
    category: string;
    contractVersion: number;
    type: ComponentContractType;
    name: string;
    contract: unknown;
    updatedAt: Date;
  }>;
};

function compareTokenPaths(firstToken: DesignToken, secondToken: DesignToken) {
  return firstToken.path.localeCompare(secondToken.path, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function sortTokensByPath(tokens: readonly DesignToken[]): DesignToken[] {
  return [...tokens].sort(compareTokenPaths);
}

function parseStoredTokenSetTokens(tokens: unknown): {
  tokens: DesignToken[];
  isMalformed: boolean;
} {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  return parsedTokens.success
    ? {
        tokens: sortTokensByPath(parsedTokens.data),
        isMalformed: false,
      }
    : {
        tokens: [],
        isMalformed: true,
      };
}

function normalizeThemeTokens(tokens: unknown): Record<string, JsonValue> {
  const parsedTokens = themeTokensSchema.safeParse(tokens);

  return parsedTokens.success ? parsedTokens.data : {};
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
    ...parseStoredTokenSetTokens(tokenSet.tokens),
  }));

  const components = componentContracts.flatMap((componentContract) => {
    try {
      const contractV2 = parseStoredComponentContractV2({
        contractVersion: componentContract.contractVersion,
        key: componentContract.key,
        name: componentContract.name,
        templateKey: componentContract.templateKey,
        category: componentContract.category,
        contract: componentContract.contract,
      });
      const legacyContract = toLegacyComponentContract(contractV2);

      return [
        {
          id: componentContract.id,
          key: contractV2.key,
          templateKey: contractV2.templateKey,
          category: contractV2.category,
          contractVersion: componentContract.contractVersion,
          type: legacyContract.type,
          name: contractV2.name,
          contract: legacyContract,
          contractV2,
          updatedAt: componentContract.updatedAt,
        },
      ];
    } catch {
      return [];
    }
  });

  return {
    project,
    brand: brandProfile ? parseStoredBrandProfile(brandProfile) : null,
    tokenSets: normalizedTokenSets,
    tokens: sortTokensByPath(
      normalizedTokenSets.flatMap((tokenSet) => tokenSet.tokens),
    ),
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
