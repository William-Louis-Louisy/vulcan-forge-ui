import {
  componentContractV2Schema,
  type ComponentContract,
  type ComponentContractV2,
} from '@/domain/design-system';

export function mergeLegacySemanticContractIntoV2(
  currentContract: ComponentContractV2,
  semanticContract: ComponentContract,
): ComponentContractV2 {
  return componentContractV2Schema.parse({
    ...currentContract,
    name: semanticContract.name,
    purpose: semanticContract.purpose,
    usageGuidelines: semanticContract.usageGuidelines,
    contentGuidelines: semanticContract.contentGuidelines,
    status: semanticContract.status,
    anatomy: semanticContract.anatomy,
    variants: semanticContract.variants,
    sizes: semanticContract.sizes,
    states: semanticContract.states,
    tokenBindings: semanticContract.tokenBindings,
    accessibility: semanticContract.accessibility,
    forbiddenPatterns: semanticContract.forbiddenPatterns,
  });
}
