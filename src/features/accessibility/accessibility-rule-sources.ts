import {
  componentContractSchema,
  designTokenSetSchema,
  type ComponentContract,
  type ComponentContractType,
  type DesignToken,
  type DesignTokenSet,
} from '@/domain/design-system';
import type { AppLocale } from '@/domain/i18n';

export type AccessibilityRuleTokenSetSource = {
  id: string;
  type: string;
  name: string;
  tokens: unknown;
};

export type AccessibilityRuleComponentContractSource = {
  id: string;
  type: ComponentContractType;
  name: string;
  contract: unknown;
};

export type ParsedAccessibilityRuleTokenSet = {
  id: string;
  tokenSet: DesignTokenSet;
};

export type ParsedAccessibilityRuleComponentContract = {
  id: string;
  storedType: ComponentContractType;
  storedName: string;
  contract: ComponentContract;
};

export type AccessibilityRuleSources = {
  locales: AppLocale[];
  tokenSets: ParsedAccessibilityRuleTokenSet[];
  invalidTokenSets: AccessibilityRuleTokenSetSource[];
  componentContracts: ParsedAccessibilityRuleComponentContract[];
  invalidComponentContracts: AccessibilityRuleComponentContractSource[];
  tokensByPath: Map<string, DesignToken>;
};

function normalizeProjectLocales({
  defaultLocale,
  supportedLocales,
}: {
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
}): AppLocale[] {
  return Array.from(new Set([defaultLocale, ...supportedLocales]));
}

export function createAccessibilityRuleSources({
  defaultLocale,
  supportedLocales,
  tokenSets,
  componentContracts,
}: {
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
  tokenSets: AccessibilityRuleTokenSetSource[];
  componentContracts: AccessibilityRuleComponentContractSource[];
}): AccessibilityRuleSources {
  const parsedTokenSets: ParsedAccessibilityRuleTokenSet[] = [];
  const invalidTokenSets: AccessibilityRuleTokenSetSource[] = [];

  for (const source of tokenSets) {
    const result = designTokenSetSchema.safeParse({
      type: source.type,
      name: source.name,
      tokens: source.tokens,
    });

    if (!result.success) {
      invalidTokenSets.push(source);
      continue;
    }

    parsedTokenSets.push({
      id: source.id,
      tokenSet: result.data,
    });
  }

  const parsedComponentContracts: ParsedAccessibilityRuleComponentContract[] =
    [];
  const invalidComponentContracts: AccessibilityRuleComponentContractSource[] =
    [];

  for (const source of componentContracts) {
    const result = componentContractSchema.safeParse(source.contract);

    if (!result.success) {
      invalidComponentContracts.push(source);
      continue;
    }

    parsedComponentContracts.push({
      id: source.id,
      storedType: source.type,
      storedName: source.name,
      contract: result.data,
    });
  }

  const tokensByPath = new Map<string, DesignToken>();

  for (const { tokenSet } of parsedTokenSets) {
    for (const token of tokenSet.tokens) {
      tokensByPath.set(token.path, token);
    }
  }

  return {
    locales: normalizeProjectLocales({
      defaultLocale,
      supportedLocales,
    }),
    tokenSets: parsedTokenSets,
    invalidTokenSets,
    componentContracts: parsedComponentContracts,
    invalidComponentContracts,
    tokensByPath,
  };
}
