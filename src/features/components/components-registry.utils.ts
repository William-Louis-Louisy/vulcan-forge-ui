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

  const totalFields = 6;
  const score = Math.round(
    ((totalFields - missingFields.length) / totalFields) * 100,
  );

  return {
    score,
    missingFields,
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
