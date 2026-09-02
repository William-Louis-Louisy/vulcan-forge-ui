import {
  componentContractV2Schema,
  componentVisualPropertiesSchema,
  type ComponentContractV2,
  type ComponentVisualProperties,
} from '@/domain/design-system';

export type ButtonVisualScope =
  | { kind: 'base' }
  | { kind: 'variant' | 'size' | 'state'; key: string };

const radiusCornerProperties = [
  'topLeft',
  'topRight',
  'bottomRight',
  'bottomLeft',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getButtonVisualTarget(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
): ComponentVisualProperties {
  if (scope.kind === 'base') {
    return contract.visual;
  }

  if (scope.kind === 'variant') {
    return contract.overrides.variants[scope.key] ?? {};
  }

  if (scope.kind === 'size') {
    return contract.overrides.sizes[scope.key] ?? {};
  }

  return contract.overrides.states[scope.key] ?? {};
}

export function getButtonVisualProperty(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
  group: keyof ComponentVisualProperties,
  property: string,
): unknown {
  const target = getButtonVisualTarget(contract, scope);
  const groupValue = target[group];

  return isRecord(groupValue)
    ? (groupValue as Record<string, unknown>)[property]
    : undefined;
}

function setTarget(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
  target: ComponentVisualProperties,
): ComponentContractV2 {
  const nextContract = structuredClone(contract);

  if (scope.kind === 'base') {
    nextContract.visual = target;
    return componentContractV2Schema.parse(nextContract);
  }

  if (scope.kind === 'variant') {
    if (Object.keys(target).length === 0) {
      delete nextContract.overrides.variants[scope.key];
    } else {
      nextContract.overrides.variants[scope.key] = target;
    }
  } else if (scope.kind === 'size') {
    if (Object.keys(target).length === 0) {
      delete nextContract.overrides.sizes[scope.key];
    } else {
      nextContract.overrides.sizes[scope.key] = target;
    }
  } else if (Object.keys(target).length === 0) {
    delete nextContract.overrides.states[scope.key];
  } else {
    nextContract.overrides.states[scope.key] = target;
  }

  return componentContractV2Schema.parse(nextContract);
}

export function setButtonVisualProperty(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
  group: keyof ComponentVisualProperties,
  property: string,
  value: unknown,
): ComponentContractV2 {
  const target = structuredClone(
    getButtonVisualTarget(contract, scope),
  ) as unknown;
  const nextTarget = isRecord(target) ? target : {};
  const groupValue = nextTarget[group];
  const nextGroup = isRecord(groupValue) ? groupValue : {};

  if (group === 'radius' && property === 'radius') {
    for (const cornerProperty of radiusCornerProperties) {
      delete nextGroup[cornerProperty];
    }
  }

  nextGroup[property] = value;
  nextTarget[group] = nextGroup;

  return setTarget(
    contract,
    scope,
    componentVisualPropertiesSchema.parse(nextTarget),
  );
}

export function resetButtonVisualProperty(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
  group: keyof ComponentVisualProperties,
  property: string,
): ComponentContractV2 {
  const target = structuredClone(
    getButtonVisualTarget(contract, scope),
  ) as unknown;

  if (!isRecord(target)) {
    return contract;
  }

  const groupValue = target[group];

  if (!isRecord(groupValue)) {
    return contract;
  }

  delete groupValue[property];

  if (Object.keys(groupValue).length === 0) {
    delete target[group];
  }

  return setTarget(
    contract,
    scope,
    componentVisualPropertiesSchema.parse(target),
  );
}

export function setButtonTypographyValue(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
  value: ComponentVisualProperties['typography'] | undefined,
): ComponentContractV2 {
  const target = structuredClone(
    getButtonVisualTarget(contract, scope),
  ) as ComponentVisualProperties;

  if (value === undefined) {
    delete target.typography;
  } else {
    target.typography = value;
  }

  return setTarget(
    contract,
    scope,
    componentVisualPropertiesSchema.parse(target),
  );
}

export function createButtonVisualCustomizationFingerprint(
  contract: ComponentContractV2,
): string {
  return JSON.stringify({
    visual: contract.visual,
    overrides: contract.overrides,
  });
}
