import { getComponentAnatomyPartKey } from '@/domain/design-system';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import { toResolvableLocalizedString } from './components-registry-page.utils';

export type AiContractMissingSourceDataKey =
  | 'purpose'
  | 'usageGuidelines'
  | 'contentGuidelines'
  | 'anatomy'
  | 'variants'
  | 'sizes'
  | 'states'
  | 'tokenBindings'
  | 'accessibilityRules'
  | 'forbiddenPatterns';

export type ComponentAiContractRuleCopy = {
  strictRules: string;
  purpose: string;
  usageGuidelines: string;
  contentGuidelines: string;
  anatomy: string;
  variants: string;
  sizes: string;
  states: string;
  tokenBindings: string;
  accessibility: string;
  forbidden: string;
  severities: Record<'info' | 'warning' | 'critical', string>;
};

export type ComponentAiContractPreviewModel = {
  heading: string;
  rules: string[];
  missingSourceData: AiContractMissingSourceDataKey[];
};

export function createComponentAiContractPreview({
  component,
  locale,
  copy,
}: {
  component: ComponentRegistryItem;
  locale: Locale;
  copy: ComponentAiContractRuleCopy;
}): ComponentAiContractPreviewModel {
  const contract = component.contract;
  const rules: string[] = [];
  const purpose = resolveLocalizedText(contract.purpose, locale);
  const usageGuidelines = resolveLocalizedText(
    contract.usageGuidelines,
    locale,
  );
  const contentGuidelines = resolveLocalizedText(
    contract.contentGuidelines,
    locale,
  );

  if (purpose) {
    rules.push(`${copy.purpose}: ${purpose}`);
  }

  if (usageGuidelines) {
    rules.push(`${copy.usageGuidelines}: ${usageGuidelines}`);
  }

  if (contentGuidelines) {
    rules.push(`${copy.contentGuidelines}: ${contentGuidelines}`);
  }

  if (contract.anatomy.length > 0) {
    rules.push(
      `${copy.anatomy}: ${formatCodeList(
        contract.anatomy.map(getComponentAnatomyPartKey),
      )}`,
    );
  }

  if (contract.variants.length > 0) {
    rules.push(
      `${copy.variants}: ${formatCodeList(
        contract.variants.map((variant) => variant.key),
      )}`,
    );
  }

  if (contract.sizes.length > 0) {
    rules.push(
      `${copy.sizes}: ${formatCodeList(
        contract.sizes.map((size) => size.key),
      )}`,
    );
  }

  if (contract.states.length > 0) {
    rules.push(
      `${copy.states}: ${formatCodeList(
        contract.states.map((state) => state.key),
      )}`,
    );
  }

  if (contract.tokenBindings.length > 0) {
    rules.push(
      `${copy.tokenBindings}: ${contract.tokenBindings
        .map((binding) => `\`${binding.key}\` → \`${binding.tokenPath}\``)
        .join(', ')}`,
    );
  }

  contract.accessibility.forEach((rule) => {
    const description = resolveLocalizedText(rule.description, locale);

    rules.push(
      `${copy.accessibility} [${copy.severities[rule.severity]}]: ${
        description || rule.key
      }`,
    );
  });

  contract.forbiddenPatterns.forEach((pattern) => {
    const description = resolveLocalizedText(pattern, locale);

    if (description) {
      rules.push(`${copy.forbidden}: ${description}`);
    }
  });

  return {
    heading: `# ${component.name} — ${copy.strictRules}`,
    rules,
    missingSourceData: getComponentAiContractMissingSourceData(component),
  };
}

export function getComponentAiContractMissingSourceData(
  component: ComponentRegistryItem,
): AiContractMissingSourceDataKey[] {
  const contract = component.contract;
  const missingSourceData: AiContractMissingSourceDataKey[] = [];

  if (!hasLocalizedText(contract.purpose)) {
    missingSourceData.push('purpose');
  }

  if (!hasLocalizedText(contract.usageGuidelines)) {
    missingSourceData.push('usageGuidelines');
  }

  if (!hasLocalizedText(contract.contentGuidelines)) {
    missingSourceData.push('contentGuidelines');
  }

  if (contract.anatomy.length === 0) {
    missingSourceData.push('anatomy');
  }

  if (contract.variants.length === 0) {
    missingSourceData.push('variants');
  }

  if (contract.sizes.length === 0) {
    missingSourceData.push('sizes');
  }

  if (contract.states.length === 0) {
    missingSourceData.push('states');
  }

  if (contract.tokenBindings.length === 0) {
    missingSourceData.push('tokenBindings');
  }

  if (contract.accessibility.length === 0) {
    missingSourceData.push('accessibilityRules');
  }

  if (contract.forbiddenPatterns.length === 0) {
    missingSourceData.push('forbiddenPatterns');
  }

  return missingSourceData;
}

function resolveLocalizedText(
  value:
    | {
        en?: string | undefined;
        fr?: string | undefined;
      }
    | undefined,
  locale: Locale,
): string {
  if (!value) {
    return '';
  }

  return resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(value),
    locale,
  }).value;
}

function hasLocalizedText(
  value:
    | {
        en?: string | undefined;
        fr?: string | undefined;
      }
    | undefined,
): boolean {
  return Boolean(value?.en?.trim() || value?.fr?.trim());
}

function formatCodeList(items: string[]): string {
  return items.map((item) => `\`${item}\``).join(', ');
}
