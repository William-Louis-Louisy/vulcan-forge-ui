import {
  resolveDesignTokens,
  type ComponentContract,
  type ComponentContractType,
  type DesignTokenType,
} from '@/domain/design-system';
import type { AppLocale, LocalizedString } from '@/domain/i18n';
import {
  createAccessibilityRuleSources,
  type AccessibilityRuleComponentContractSource,
  type AccessibilityRuleTokenSetSource,
  type AccessibilityRuleSources,
  type ParsedAccessibilityRuleComponentContract,
} from './accessibility-rule-sources';

export type ExpandedAccessibilityIssueCode =
  | 'missingTokenDescription'
  | 'invalidTokenSet'
  | 'invalidComponentContract'
  | 'missingComponentLocalization'
  | 'missingComponentAccessibilityRules'
  | 'missingComponentFocusVisibleState'
  | 'unresolvedComponentTokenBinding'
  | 'componentTokenTypeMismatch'
  | 'tokenResolutionError';

export type ExpandedAccessibilityIssueScope =
  | 'tokenDocumentation'
  | 'tokenResolution'
  | 'componentContract'
  | 'componentBinding';

export type ExpandedAccessibilityIssueField =
  | 'description'
  | 'tokenSet'
  | 'contract'
  | 'purpose'
  | 'anatomy'
  | 'variants'
  | 'sizes'
  | 'states'
  | 'accessibility'
  | 'focusVisible'
  | 'tokenBindings';

export type ExpandedAccessibilityIssue = {
  id: string;
  code: ExpandedAccessibilityIssueCode;
  severity: 'warning' | 'critical';
  scope: ExpandedAccessibilityIssueScope;
  tokenPath: string | null;
  tokenSetId: string | null;
  tokenSetName: string | null;
  componentId: string | null;
  componentType: ComponentContractType | null;
  componentName: string | null;
  affectedField: ExpandedAccessibilityIssueField | null;
  affectedCount: number | null;
  missingLocales: AppLocale[];
  bindingKey: string | null;
  expectedTokenType: DesignTokenType | null;
  actualTokenType: DesignTokenType | null;
};

type CreateExpandedIssueInput = Omit<ExpandedAccessibilityIssue, 'id'>;

const interactiveComponentTypes = new Set<ComponentContractType>([
  'button',
  'textField',
  'dialog',
]);

function createExpandedIssue(
  input: CreateExpandedIssueInput,
): ExpandedAccessibilityIssue {
  const id = [
    input.scope,
    input.code,
    input.tokenSetId,
    input.componentId,
    input.tokenPath,
    input.affectedField,
    input.bindingKey,
    input.missingLocales.join(','),
    input.expectedTokenType,
    input.actualTokenType,
  ]
    .filter(Boolean)
    .join(':');

  return {
    id,
    ...input,
  };
}

function hasLocalizedText(
  value: LocalizedString | undefined,
  locale: AppLocale,
): boolean {
  return Boolean(value?.[locale]?.trim());
}

function getMissingLocales({
  values,
  locales,
}: {
  values: LocalizedString[];
  locales: AppLocale[];
}): AppLocale[] {
  return locales.filter((locale) =>
    values.some((value) => !hasLocalizedText(value, locale)),
  );
}

function countIncompleteLocalizedValues({
  values,
  locales,
}: {
  values: LocalizedString[];
  locales: AppLocale[];
}): number {
  return values.filter((value) =>
    locales.some((locale) => !hasLocalizedText(value, locale)),
  ).length;
}

function createTokenDocumentationIssues(
  sources: AccessibilityRuleSources,
): ExpandedAccessibilityIssue[] {
  return sources.tokenSets.flatMap(({ id, tokenSet }) =>
    tokenSet.tokens.flatMap((token) => {
      if (token.status !== 'ready') {
        return [];
      }

      const missingLocales = getMissingLocales({
        values: [token.description ?? {}],
        locales: sources.locales,
      });

      if (missingLocales.length === 0) {
        return [];
      }

      return [
        createExpandedIssue({
          code: 'missingTokenDescription',
          severity: 'warning',
          scope: 'tokenDocumentation',
          tokenPath: token.path,
          tokenSetId: id,
          tokenSetName: tokenSet.name,
          componentId: null,
          componentType: null,
          componentName: null,
          affectedField: 'description',
          affectedCount: 1,
          missingLocales,
          bindingKey: null,
          expectedTokenType: null,
          actualTokenType: null,
        }),
      ];
    }),
  );
}

function createInvalidTokenSetIssues(
  sources: AccessibilityRuleSources,
): ExpandedAccessibilityIssue[] {
  return sources.invalidTokenSets.flatMap((tokenSet) => {
    if (tokenSet.type === 'color') {
      return [];
    }

    return [
      createExpandedIssue({
        code: 'invalidTokenSet',
        severity: 'critical',
        scope: 'tokenDocumentation',
        tokenPath: null,
        tokenSetId: tokenSet.id,
        tokenSetName: tokenSet.name,
        componentId: null,
        componentType: null,
        componentName: null,
        affectedField: 'tokenSet',
        affectedCount: null,
        missingLocales: [],
        bindingKey: null,
        expectedTokenType: null,
        actualTokenType: null,
      }),
    ];
  });
}

function createTokenResolutionIssues(
  sources: AccessibilityRuleSources,
): ExpandedAccessibilityIssue[] {
  const allTokens = sources.tokenSets.flatMap(({ tokenSet }) => tokenSet.tokens);

  if (allTokens.length === 0) {
    return [];
  }

  const tokenSetByPath = new Map(
    sources.tokenSets.flatMap(({ id, tokenSet }) =>
      tokenSet.tokens.map((token) => [
        token.path,
        {
          id,
          name: tokenSet.name,
        },
      ] as const),
    ),
  );

  return resolveDesignTokens(allTokens).errors.map((error) => {
    const tokenSet = tokenSetByPath.get(error.tokenPath) ?? null;

    return createExpandedIssue({
      code: 'tokenResolutionError',
      severity: 'critical',
      scope: 'tokenResolution',
      tokenPath: error.tokenPath,
      tokenSetId: tokenSet?.id ?? null,
      tokenSetName: tokenSet?.name ?? null,
      componentId: null,
      componentType: null,
      componentName: null,
      affectedField: null,
      affectedCount: null,
      missingLocales: [],
      bindingKey: null,
      expectedTokenType: null,
      actualTokenType: null,
    });
  });
}

function getComponentLocalizedFieldValues(
  contract: ComponentContract,
): Array<{
  field: Extract<
    ExpandedAccessibilityIssueField,
    'purpose' | 'anatomy' | 'variants' | 'sizes' | 'states'
  >;
  values: LocalizedString[];
}> {
  return [
    {
      field: 'purpose',
      values: [contract.purpose],
    },
    {
      field: 'anatomy',
      values: contract.anatomy.map((part) =>
        typeof part === 'string' ? { en: part } : part.label,
      ),
    },
    {
      field: 'variants',
      values: contract.variants.map((variant) => variant.label),
    },
    {
      field: 'sizes',
      values: contract.sizes.map((size) => size.label),
    },
    {
      field: 'states',
      values: contract.states.map((state) => state.label),
    },
  ];
}

function createComponentLocalizationIssues({
  source,
  locales,
}: {
  source: ParsedAccessibilityRuleComponentContract;
  locales: AppLocale[];
}): ExpandedAccessibilityIssue[] {
  return getComponentLocalizedFieldValues(source.contract).flatMap(
    ({ field, values }) => {
      if (values.length === 0) {
        return [];
      }

      const missingLocales = getMissingLocales({ values, locales });

      if (missingLocales.length === 0) {
        return [];
      }

      return [
        createExpandedIssue({
          code: 'missingComponentLocalization',
          severity: 'warning',
          scope: 'componentContract',
          tokenPath: null,
          tokenSetId: null,
          tokenSetName: null,
          componentId: source.id,
          componentType: source.contract.type,
          componentName: source.contract.name,
          affectedField: field,
          affectedCount: countIncompleteLocalizedValues({ values, locales }),
          missingLocales,
          bindingKey: null,
          expectedTokenType: null,
          actualTokenType: null,
        }),
      ];
    },
  );
}

function normalizeStateKey(key: string): string {
  return key.trim().replace(/[\s._-]+/g, '').toLowerCase();
}

function hasFocusVisibleState(contract: ComponentContract): boolean {
  return contract.states.some(
    (state) => normalizeStateKey(state.key) === 'focusvisible',
  );
}

function createComponentContractIssues(
  sources: AccessibilityRuleSources,
): ExpandedAccessibilityIssue[] {
  const invalidContractIssues = sources.invalidComponentContracts.map(
    (component) =>
      createExpandedIssue({
        code: 'invalidComponentContract',
        severity: 'critical',
        scope: 'componentContract',
        tokenPath: null,
        tokenSetId: null,
        tokenSetName: null,
        componentId: component.id,
        componentType: component.type,
        componentName: component.name,
        affectedField: 'contract',
        affectedCount: null,
        missingLocales: [],
        bindingKey: null,
        expectedTokenType: null,
        actualTokenType: null,
      }),
  );

  const parsedContractIssues = sources.componentContracts.flatMap((source) => {
    const issues = createComponentLocalizationIssues({
      source,
      locales: sources.locales,
    });
    const isInteractive = interactiveComponentTypes.has(source.contract.type);

    if (isInteractive && source.contract.accessibility.length === 0) {
      issues.push(
        createExpandedIssue({
          code: 'missingComponentAccessibilityRules',
          severity: 'warning',
          scope: 'componentContract',
          tokenPath: null,
          tokenSetId: null,
          tokenSetName: null,
          componentId: source.id,
          componentType: source.contract.type,
          componentName: source.contract.name,
          affectedField: 'accessibility',
          affectedCount: null,
          missingLocales: [],
          bindingKey: null,
          expectedTokenType: null,
          actualTokenType: null,
        }),
      );
    }

    if (isInteractive && !hasFocusVisibleState(source.contract)) {
      issues.push(
        createExpandedIssue({
          code: 'missingComponentFocusVisibleState',
          severity:
            source.contract.type === 'dialog' ? 'warning' : 'critical',
          scope: 'componentContract',
          tokenPath: null,
          tokenSetId: null,
          tokenSetName: null,
          componentId: source.id,
          componentType: source.contract.type,
          componentName: source.contract.name,
          affectedField: 'focusVisible',
          affectedCount: null,
          missingLocales: [],
          bindingKey: null,
          expectedTokenType: null,
          actualTokenType: null,
        }),
      );
    }

    return issues;
  });

  return [...invalidContractIssues, ...parsedContractIssues];
}

function createComponentBindingIssues(
  sources: AccessibilityRuleSources,
): ExpandedAccessibilityIssue[] {
  return sources.componentContracts.flatMap((source) =>
    source.contract.tokenBindings.flatMap((binding) => {
      const token = sources.tokensByPath.get(binding.tokenPath);

      if (!token) {
        return [
          createExpandedIssue({
            code: 'unresolvedComponentTokenBinding',
            severity: 'critical',
            scope: 'componentBinding',
            tokenPath: binding.tokenPath,
            tokenSetId: null,
            tokenSetName: null,
            componentId: source.id,
            componentType: source.contract.type,
            componentName: source.contract.name,
            affectedField: 'tokenBindings',
            affectedCount: null,
            missingLocales: [],
            bindingKey: binding.key,
            expectedTokenType: binding.tokenType,
            actualTokenType: null,
          }),
        ];
      }

      if (token.type !== binding.tokenType) {
        return [
          createExpandedIssue({
            code: 'componentTokenTypeMismatch',
            severity: 'warning',
            scope: 'componentBinding',
            tokenPath: binding.tokenPath,
            tokenSetId: null,
            tokenSetName: null,
            componentId: source.id,
            componentType: source.contract.type,
            componentName: source.contract.name,
            affectedField: 'tokenBindings',
            affectedCount: null,
            missingLocales: [],
            bindingKey: binding.key,
            expectedTokenType: binding.tokenType,
            actualTokenType: token.type,
          }),
        ];
      }

      return [];
    }),
  );
}

export function createExpandedAccessibilityIssues({
  defaultLocale,
  supportedLocales,
  tokenSets,
  componentContracts,
}: {
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
  tokenSets: AccessibilityRuleTokenSetSource[];
  componentContracts: AccessibilityRuleComponentContractSource[];
}): ExpandedAccessibilityIssue[] {
  const sources = createAccessibilityRuleSources({
    defaultLocale,
    supportedLocales,
    tokenSets,
    componentContracts,
  });

  return [
    ...createInvalidTokenSetIssues(sources),
    ...createTokenDocumentationIssues(sources),
    ...createTokenResolutionIssues(sources),
    ...createComponentContractIssues(sources),
    ...createComponentBindingIssues(sources),
  ];
}
