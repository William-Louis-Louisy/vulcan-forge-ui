import {
  componentContractSchema,
  type ComponentContract,
  type ComponentContractType,
} from './component-contract.schema';
import {
  componentContractV2Schema,
  componentTemplateSlotProfiles,
  getLegacyComponentCategory,
  migrateLegacyComponentContract,
  parseStoredComponentContractV2,
  resolveComponentSlots,
  validateComponentSlotConfiguration,
  type ComponentCategory,
  type ComponentContractV2,
  type ComponentIdentity,
  type StoredComponentContractInput,
  type WaveAComponentTemplateKey,
} from './component-contract-v2.schema';
import { mvpComponentContractSeeds } from './mvp-seed-templates';

export const componentTemplateCapabilityLevels = [
  'full',
  'constrained',
  'none',
] as const;

export type ComponentTemplateCapabilityLevel =
  (typeof componentTemplateCapabilityLevels)[number];

export const componentTemplateCapabilityGroups = [
  'dimensions',
  'spacing',
  'border',
  'radius',
  'surface',
  'typography',
  'layout',
  'overflow',
] as const;

export type ComponentTemplateCapabilityGroup =
  (typeof componentTemplateCapabilityGroups)[number];

export type ComponentTemplateCapabilityProfile = Readonly<
  Record<ComponentTemplateCapabilityGroup, ComponentTemplateCapabilityLevel>
>;

export type ComponentTemplateRendererKey =
  | 'button'
  | 'textField'
  | 'card'
  | 'alert'
  | 'dialog';

export type ComponentTemplateSlotRequirement = 'required' | 'optional';

export type ComponentTemplateDefinition = Readonly<{
  key: WaveAComponentTemplateKey;
  name: string;
  category: ComponentCategory;
  legacyType: ComponentContractType;
  rendererKey: ComponentTemplateRendererKey;
  capabilities: ComponentTemplateCapabilityProfile;
  slots: Readonly<Record<string, ComponentTemplateSlotRequirement>>;
  defaultContract: ComponentContractV2;
}>;

const buttonCapabilities: ComponentTemplateCapabilityProfile = {
  dimensions: 'constrained',
  spacing: 'full',
  border: 'full',
  radius: 'full',
  surface: 'full',
  typography: 'full',
  layout: 'constrained',
  overflow: 'none',
};

const textFieldCapabilities: ComponentTemplateCapabilityProfile = {
  dimensions: 'full',
  spacing: 'full',
  border: 'full',
  radius: 'full',
  surface: 'full',
  typography: 'full',
  layout: 'constrained',
  overflow: 'none',
};

const cardCapabilities: ComponentTemplateCapabilityProfile = {
  dimensions: 'full',
  spacing: 'full',
  border: 'full',
  radius: 'full',
  surface: 'full',
  typography: 'full',
  layout: 'full',
  overflow: 'full',
};

const alertCapabilities: ComponentTemplateCapabilityProfile = {
  dimensions: 'full',
  spacing: 'full',
  border: 'full',
  radius: 'full',
  surface: 'full',
  typography: 'full',
  layout: 'full',
  overflow: 'none',
};

const dialogCapabilities: ComponentTemplateCapabilityProfile = {
  dimensions: 'full',
  spacing: 'full',
  border: 'full',
  radius: 'full',
  surface: 'full',
  typography: 'full',
  layout: 'full',
  overflow: 'full',
};

const capabilityProfileByTemplate: Readonly<
  Record<WaveAComponentTemplateKey, ComponentTemplateCapabilityProfile>
> = {
  button: buttonCapabilities,
  textField: textFieldCapabilities,
  card: cardCapabilities,
  alert: alertCapabilities,
  dialog: dialogCapabilities,
};

const rendererKeyByTemplate: Readonly<
  Record<WaveAComponentTemplateKey, ComponentTemplateRendererKey>
> = {
  button: 'button',
  textField: 'textField',
  card: 'card',
  alert: 'alert',
  dialog: 'dialog',
};

function getLegacySeed(
  templateKey: WaveAComponentTemplateKey,
): ComponentContract {
  const seed = mvpComponentContractSeeds.find(
    (candidate) => candidate.type === templateKey,
  );

  if (!seed) {
    throw new Error(`Missing Component seed for template: ${templateKey}`);
  }

  return componentContractSchema.parse(seed);
}

function createTemplateDefinition(
  templateKey: WaveAComponentTemplateKey,
): ComponentTemplateDefinition {
  const legacySeed = getLegacySeed(templateKey);
  const defaultContract = migrateLegacyComponentContract(legacySeed);

  return {
    key: templateKey,
    name: legacySeed.name,
    category: getLegacyComponentCategory(legacySeed.type),
    legacyType: legacySeed.type,
    rendererKey: rendererKeyByTemplate[templateKey],
    capabilities: capabilityProfileByTemplate[templateKey],
    slots: componentTemplateSlotProfiles[templateKey],
    defaultContract,
  };
}

export const componentTemplateDefinitions = [
  createTemplateDefinition('button'),
  createTemplateDefinition('textField'),
  createTemplateDefinition('card'),
  createTemplateDefinition('alert'),
  createTemplateDefinition('dialog'),
] as const satisfies readonly ComponentTemplateDefinition[];

const componentTemplateDefinitionByKey = new Map<
  string,
  ComponentTemplateDefinition
>(
  componentTemplateDefinitions.map((definition) => [
    definition.key,
    definition,
  ]),
);

export function isRegisteredComponentTemplateKey(
  templateKey: string,
): templateKey is WaveAComponentTemplateKey {
  return componentTemplateDefinitionByKey.has(templateKey);
}

export function getComponentTemplateDefinition(
  templateKey: string,
): ComponentTemplateDefinition | null {
  return componentTemplateDefinitionByKey.get(templateKey) ?? null;
}

export function requireComponentTemplateDefinition(
  templateKey: string,
): ComponentTemplateDefinition {
  const definition = getComponentTemplateDefinition(templateKey);

  if (!definition) {
    throw new Error(`Unsupported Component template: ${templateKey}`);
  }

  return definition;
}

export function getComponentTemplateRendererKey(
  templateKey: string,
): ComponentTemplateRendererKey | null {
  return getComponentTemplateDefinition(templateKey)?.rendererKey ?? null;
}

export function createComponentContractFromTemplate({
  templateKey,
  key,
  name,
  category,
  status,
}: {
  templateKey: WaveAComponentTemplateKey;
  key: string;
  name: string;
  category?: ComponentCategory;
  status?: ComponentContractV2['status'];
}): ComponentContractV2 {
  const template = requireComponentTemplateDefinition(templateKey);
  const defaultContract = componentContractV2Schema.parse(
    template.defaultContract,
  );

  return componentContractV2Schema.parse({
    ...defaultContract,
    key,
    name,
    templateKey: template.key,
    category: category ?? template.category,
    ...(status === undefined ? {} : { status }),
  });
}

export function migrateLegacyComponentToRegisteredTemplate(
  input: unknown,
  identityOverride?: Partial<ComponentIdentity>,
): {
  template: ComponentTemplateDefinition;
  contract: ComponentContractV2;
} {
  const legacyContract = componentContractSchema.parse(input);
  const template = requireComponentTemplateDefinition(legacyContract.type);
  const contract = migrateLegacyComponentContract(legacyContract, {
    ...identityOverride,
    templateKey: identityOverride?.templateKey ?? template.key,
    category: identityOverride?.category ?? template.category,
  });

  return {
    template,
    contract,
  };
}

export function resolveStoredComponentTemplateContract(
  input: StoredComponentContractInput,
): {
  template: ComponentTemplateDefinition;
  contract: ComponentContractV2;
} {
  const template = requireComponentTemplateDefinition(input.templateKey);
  const normalizedContract = parseStoredComponentContractV2(input);
  const resolvedSlots = resolveComponentSlots(
    template.key,
    normalizedContract.slots,
  );
  const slotValidation = validateComponentSlotConfiguration({
    templateKey: template.key,
    slots: resolvedSlots,
  });

  if (!slotValidation.success) {
    throw new Error(
      `Invalid Component slot configuration: ${slotValidation.issues.join(', ')}`,
    );
  }

  return {
    template,
    contract: componentContractV2Schema.parse({
      ...normalizedContract,
      slots: resolvedSlots,
    }),
  };
}