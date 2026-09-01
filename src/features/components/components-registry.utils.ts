import {
  getComponentTemplateDefinition,
  resolveStoredComponentTemplateContract,
  toLegacyComponentContract,
  type ComponentContract,
  type ComponentContractType,
  type ComponentContractV2,
} from '@/domain/design-system';

export type ComponentRegistryStatus = ComponentContract['status'];

export type ComponentRegistryCompleteness = {
  score: number;
  level: 'complete' | 'partial' | 'incomplete';
  missingFields: ComponentRegistryMissingField[];
  warnings: ComponentCompletenessWarning[];
};

export type ComponentRegistryMissingField =
  | 'purpose'
  | 'anatomy'
  | 'variants'
  | 'states'
  | 'accessibility'
  | 'forbiddenPatterns';

export type ComponentRegistryItem = {
  id: string;
  key: string;
  templateKey: string;
  type: ComponentContractType;
  name: string;
  status: ComponentRegistryStatus;
  category: 'action' | 'input' | 'layout' | 'feedback' | 'overlay';
  platforms: Array<'web' | 'mobile'>;
  contract: ComponentContract;
  contractV2: ComponentContractV2;
  completeness: ComponentRegistryCompleteness;
  isValid: boolean;
};

export type ComponentRegistryResult = {
  items: ComponentRegistryItem[];
  invalidCount: number;
};

export type ComponentCompletenessWarningCode =
  | 'missingPurpose'
  | 'missingAccessibleNameRule'
  | 'missingCriticalStates';

export type ComponentCompletenessWarning = {
  code: ComponentCompletenessWarningCode;
  severity: 'warning';
};

export type ComponentRegistryCategoryGroup = {
  category: ComponentRegistryItem['category'];
  items: ComponentRegistryItem[];
};

export function groupComponentRegistryItemsByCategory(
  items: readonly ComponentRegistryItem[],
): ComponentRegistryCategoryGroup[] {
  return componentRegistryCategoryOrder
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export const componentRegistryCategoryOrder = [
  'action',
  'input',
  'layout',
  'feedback',
  'overlay',
] as const satisfies readonly ComponentRegistryItem['category'][];

function isRegistryCategory(
  category: ComponentContractV2['category'],
): category is ComponentRegistryItem['category'] {
  return (
    category === 'action' ||
    category === 'input' ||
    category === 'layout' ||
    category === 'feedback' ||
    category === 'overlay'
  );
}

export function getComponentCategory(
  type: ComponentContractType,
): ComponentRegistryItem['category'] {
  const category = getComponentTemplateDefinition(type)?.category;

  if (category && isRegistryCategory(category)) {
    return category;
  }

  const categories: Record<
    ComponentContractType,
    ComponentRegistryItem['category']
  > = {
    button: 'action',
    textField: 'input',
    card: 'layout',
    alert: 'feedback',
    dialog: 'overlay',
  };

  return categories[type];
}

function getRegistryCategory(
  category: ComponentContractV2['category'],
  templateType: ComponentContractType,
): ComponentRegistryItem['category'] {
  return isRegistryCategory(category)
    ? category
    : getComponentCategory(templateType);
}

export function getComponentPlatforms(
  type: ComponentContractType,
): ComponentRegistryItem['platforms'] {
  if (type === 'dialog') {
    return ['web', 'mobile'];
  }

  return ['web', 'mobile'];
}

export function getComponentCompleteness(
  contract: ComponentContract,
): ComponentRegistryCompleteness {
  const missingFields: ComponentRegistryMissingField[] = [];

  if (!contract.purpose) {
    missingFields.push('purpose');
  }

  if (contract.anatomy.length === 0) {
    missingFields.push('anatomy');
  }

  if (contract.variants.length === 0) {
    missingFields.push('variants');
  }

  if (contract.states.length === 0) {
    missingFields.push('states');
  }

  if (contract.accessibility.length === 0) {
    missingFields.push('accessibility');
  }

  if (contract.forbiddenPatterns.length === 0) {
    missingFields.push('forbiddenPatterns');
  }

  const warnings = getComponentCompletenessWarnings(contract);

  const totalFields = 6;
  const fieldScore = Math.round(
    ((totalFields - missingFields.length) / totalFields) * 100,
  );

  const score = Math.max(0, fieldScore - warnings.length * 10);

  return {
    score,
    missingFields,
    warnings,
    level: score >= 90 ? 'complete' : score >= 50 ? 'partial' : 'incomplete',
  };
}

export function createComponentRegistryItems(
  componentContracts: Array<{
    id: string;
    key: string;
    templateKey: string;
    category: string;
    contractVersion: number;
    type: ComponentContractType;
    name: string;
    contract: unknown;
  }>,
): ComponentRegistryResult {
  const items: ComponentRegistryItem[] = [];
  let invalidCount = 0;

  for (const componentContract of componentContracts) {
    try {
      const { template, contract: contractV2 } =
        resolveStoredComponentTemplateContract({
          contractVersion: componentContract.contractVersion,
          key: componentContract.key,
          name: componentContract.name,
          templateKey: componentContract.templateKey,
          category: componentContract.category,
          contract: componentContract.contract,
        });
      const legacyContract = toLegacyComponentContract(contractV2);

      items.push({
        id: componentContract.id,
        key: contractV2.key,
        templateKey: template.key,
        type: template.legacyType,
        name: contractV2.name,
        status: legacyContract.status,
        category: getRegistryCategory(contractV2.category, template.legacyType),
        platforms: getComponentPlatforms(template.legacyType),
        contract: legacyContract,
        contractV2,
        completeness: getComponentCompleteness(legacyContract),
        isValid: true,
      });
    } catch {
      invalidCount += 1;
    }
  }

  return {
    items,
    invalidCount,
  };
}

const interactiveComponentTypes: ComponentContractType[] = [
  'button',
  'textField',
  'dialog',
];

const criticalStateKeysByComponentType: Record<
  ComponentContractType,
  string[]
> = {
  button: ['disabled', 'focus', 'hover'],
  textField: ['focus', 'disabled', 'error'],
  card: [],
  alert: [],
  dialog: ['open', 'focus', 'dismissed'],
};

function hasLocalizedPurpose(contract: ComponentContract): boolean {
  return Boolean(contract.purpose.en?.trim() || contract.purpose.fr?.trim());
}

function hasAccessibleNameRule(contract: ComponentContract): boolean {
  return contract.accessibility.some((rule) => {
    const searchableText = [
      rule.key,
      rule.description.en ?? '',
      rule.description.fr ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return (
      searchableText.includes('accessible name') ||
      searchableText.includes('nom accessible') ||
      searchableText.includes('aria-label') ||
      searchableText.includes('aria-labelledby')
    );
  });
}

function hasRequiredCriticalStates(contract: ComponentContract): boolean {
  const criticalStates = criticalStateKeysByComponentType[contract.type];

  if (criticalStates.length === 0) {
    return true;
  }

  const documentedStateKeys = contract.states.map((state) =>
    state.key.toLowerCase(),
  );

  return criticalStates.every((criticalState) =>
    documentedStateKeys.includes(criticalState),
  );
}

export function getComponentCompletenessWarnings(
  contract: ComponentContract,
): ComponentCompletenessWarning[] {
  const warnings: ComponentCompletenessWarning[] = [];

  if (!hasLocalizedPurpose(contract)) {
    warnings.push({
      code: 'missingPurpose',
      severity: 'warning',
    });
  }

  if (
    interactiveComponentTypes.includes(contract.type) &&
    !hasAccessibleNameRule(contract)
  ) {
    warnings.push({
      code: 'missingAccessibleNameRule',
      severity: 'warning',
    });
  }

  if (!hasRequiredCriticalStates(contract)) {
    warnings.push({
      code: 'missingCriticalStates',
      severity: 'warning',
    });
  }

  return warnings;
}
