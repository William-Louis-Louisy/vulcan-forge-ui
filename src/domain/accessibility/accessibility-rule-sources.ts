import {
  componentContractSchema,
  designTokenSetSchema,
  parseStoredComponentContractV2,
  toLegacyComponentContract,
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
  key?: string;
  templateKey?: string;
  category?: string;
  contractVersion?: number;
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

function parseComponentContractSource(
  source: AccessibilityRuleComponentContractSource,
): ComponentContract | null {
  if (
    source.key !== undefined &&
    source.templateKey !== undefined &&
    source.category !== undefined &&
    source.contractVersion !== undefined
  ) {
    try {
      return toLegacyComponentContract(
        parseStoredComponentContractV2({
          contractVersion: source.contractVersion,
          key: source.key,
          name: source.name,
          templateKey: source.templateKey,
          category: source.category,
          contract: source.contract,
        }),
      );
    } catch {
      return null;
    }
  }

  const legacyResult = componentContractSchema.safeParse(source.contract);

  return legacyResult.success ? legacyResult.data : null;
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
    const contract = parseComponentContractSource(source);

    if (!contract) {
      invalidComponentContracts.push(source);
      continue;
    }

    parsedComponentContracts.push({
      id: source.id,
      storedType: source.type,
      storedName: source.name,
      contract,
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
