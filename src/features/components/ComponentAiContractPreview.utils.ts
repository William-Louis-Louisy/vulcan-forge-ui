import type { ComponentRegistryItem } from './components-registry.utils';

type AiContractMissingSourceDataKey =
  | 'anatomy'
  | 'variants'
  | 'states'
  | 'accessibilityRules'
  | 'forbiddenPatterns';

type AiContractModelGapKey =
  | 'usageGuidelines'
  | 'contentGuidelines'
  | 'tokenBindings';

export function getComponentAiContractMissingSourceData(
  component: ComponentRegistryItem,
): AiContractMissingSourceDataKey[] {
  const missingSourceData: AiContractMissingSourceDataKey[] = [];

  if (component.contract.anatomy.length === 0) {
    missingSourceData.push('anatomy');
  }

  if (component.contract.variants.length === 0) {
    missingSourceData.push('variants');
  }

  if (component.contract.states.length === 0) {
    missingSourceData.push('states');
  }

  if (component.contract.accessibility.length === 0) {
    missingSourceData.push('accessibilityRules');
  }

  if (component.contract.forbiddenPatterns.length === 0) {
    missingSourceData.push('forbiddenPatterns');
  }

  return missingSourceData;
}

export function getComponentAiContractModelGaps(): AiContractModelGapKey[] {
  return ['usageGuidelines', 'contentGuidelines', 'tokenBindings'];
}
