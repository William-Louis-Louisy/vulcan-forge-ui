import {
  componentContractSchema,
  type ComponentContract,
  type ComponentContractType,
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
  type: ComponentContractType;
  name: string;
  status: ComponentRegistryStatus;
  category: 'action' | 'input' | 'layout' | 'feedback' | 'overlay';
  platforms: Array<'web' | 'mobile'>;
  contract: ComponentContract;
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

export function getComponentCategory(
  type: ComponentContractType,
): ComponentRegistryItem['category'] {
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
    type: ComponentContractType;
    name: string;
    contract: unknown;
  }>,
): ComponentRegistryResult {
  const items: ComponentRegistryItem[] = [];
  let invalidCount = 0;

  for (const componentContract of componentContracts) {
    const parsedContract = componentContractSchema.safeParse(
      componentContract.contract,
    );

    if (!parsedContract.success) {
      invalidCount += 1;
      continue;
    }

    items.push({
      id: componentContract.id,
      type: componentContract.type,
      name: componentContract.name,
      status: parsedContract.data.status,
      category: getComponentCategory(parsedContract.data.type),
      platforms: getComponentPlatforms(parsedContract.data.type),
      contract: parsedContract.data,
      completeness: getComponentCompleteness(parsedContract.data),
      isValid: true,
    });
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
