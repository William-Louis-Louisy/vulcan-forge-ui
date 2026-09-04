import { z } from 'zod';
import {
  componentContractSchema,
  componentContractTypeSchema,
  type ComponentContract,
  type ComponentContractType,
  type ComponentTokenBinding,
} from './component-contract.schema';

export const componentContractVersion = 2 as const;

export const componentKeySchema = z
  .string()
  .trim()
  .min(1, { message: 'componentKeyRequired' })
  .max(64, { message: 'componentKeyTooLong' })
  .regex(/^[a-z][a-zA-Z0-9]*$/, { message: 'componentKeyInvalid' });

export const componentTemplateKeySchema = z
  .string()
  .trim()
  .min(1, { message: 'componentTemplateKeyRequired' })
  .max(64, { message: 'componentTemplateKeyTooLong' })
  .regex(/^[a-z][a-zA-Z0-9]*$/, {
    message: 'componentTemplateKeyInvalid',
  });

export const componentCategorySchema = z.enum([
  'action',
  'input',
  'layout',
  'feedback',
  'overlay',
  'navigation',
  'dataDisplay',
  'other',
]);

const tokenPathSchema = z
  .string()
  .trim()
  .min(1, { message: 'designValueTokenPathRequired' })
  .regex(/^[a-zA-Z0-9._-]+$/, { message: 'tokenPathInvalid' });

const spacingTokenReferenceSchema = z
  .object({
    source: z.literal('token'),
    tokenType: z.literal('spacing'),
    path: tokenPathSchema,
  })
  .strict();

const radiusTokenReferenceSchema = z
  .object({
    source: z.literal('token'),
    tokenType: z.literal('radius'),
    path: tokenPathSchema,
  })
  .strict();

const colorTokenReferenceSchema = z
  .object({
    source: z.literal('token'),
    tokenType: z.literal('color'),
    path: tokenPathSchema,
  })
  .strict();

const typographyTokenReferenceSchema = z
  .object({
    source: z.literal('token'),
    tokenType: z.literal('typography'),
    path: tokenPathSchema,
  })
  .strict();

export const explicitLengthValueSchema = z
  .string()
  .trim()
  .regex(/^(?:0|\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|ch))$/, {
    message: 'designValueLengthInvalid',
  });

export const explicitColorValueSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === 'transparent' ||
      /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
        value,
      ),
    { message: 'designValueColorInvalid' },
  );

const explicitFontFamilySchema = z
  .string()
  .trim()
  .min(1, { message: 'designValueFontFamilyRequired' })
  .max(200, { message: 'designValueFontFamilyTooLong' })
  .refine((value) => !/[;{}]/.test(value), {
    message: 'designValueFontFamilyInvalid',
  });

const explicitLineHeightSchema = z.union([
  z.number().positive(),
  z
    .string()
    .trim()
    .regex(/^(?:\d+(?:\.\d+)?|\d+(?:\.\d+)?(?:px|rem|em|%))$/, {
      message: 'designValueLineHeightInvalid',
    }),
]);

export const lengthDesignValueSchema = z.union([
  spacingTokenReferenceSchema,
  z
    .object({
      source: z.literal('value'),
      value: explicitLengthValueSchema,
    })
    .strict(),
]);

export const radiusDesignValueSchema = z.union([
  radiusTokenReferenceSchema,
  z
    .object({
      source: z.literal('value'),
      value: explicitLengthValueSchema,
    })
    .strict(),
]);

export const colorDesignValueSchema = z.union([
  colorTokenReferenceSchema,
  z
    .object({
      source: z.literal('value'),
      value: explicitColorValueSchema,
    })
    .strict(),
]);

export const dimensionDesignValueSchema = z.union([
  lengthDesignValueSchema,
  z
    .object({
      source: z.literal('mode'),
      value: z.enum(['auto', 'fill']),
    })
    .strict(),
]);

const typographyExplicitValueSchema = z
  .object({
    fontFamily: explicitFontFamilySchema.optional(),
    fontSize: explicitLengthValueSchema.optional(),
    fontWeight: z
      .union([
        z.number().int().min(100).max(900),
        z.literal('normal'),
        z.literal('bold'),
      ])
      .optional(),
    lineHeight: explicitLineHeightSchema.optional(),
    letterSpacing: explicitLengthValueSchema.optional(),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  })
  .strict()
  .refine(
    (value) =>
      Object.values(value).some((fieldValue) => fieldValue !== undefined),
    { message: 'designValueTypographyEmpty' },
  );

export const typographyDesignValueSchema = z.union([
  typographyTokenReferenceSchema,
  z
    .object({
      source: z.literal('value'),
      value: typographyExplicitValueSchema,
    })
    .strict(),
]);

export const elevationDesignValueSchema = z
  .object({
    source: z.literal('value'),
    value: z.enum(['none', 'sm', 'md', 'lg', 'xl']),
  })
  .strict();

export const componentDimensionsSchema = z
  .object({
    width: dimensionDesignValueSchema.optional(),
    minWidth: lengthDesignValueSchema.optional(),
    maxWidth: lengthDesignValueSchema.optional(),
    height: dimensionDesignValueSchema.optional(),
    minHeight: lengthDesignValueSchema.optional(),
    maxHeight: lengthDesignValueSchema.optional(),
  })
  .strict();

export const componentSpacingSchema = z
  .object({
    padding: lengthDesignValueSchema.optional(),
    paddingX: lengthDesignValueSchema.optional(),
    paddingY: lengthDesignValueSchema.optional(),
    paddingTop: lengthDesignValueSchema.optional(),
    paddingRight: lengthDesignValueSchema.optional(),
    paddingBottom: lengthDesignValueSchema.optional(),
    paddingLeft: lengthDesignValueSchema.optional(),
    gap: lengthDesignValueSchema.optional(),
  })
  .strict();

export const componentBorderSchema = z
  .object({
    width: lengthDesignValueSchema.optional(),
    topWidth: lengthDesignValueSchema.optional(),
    rightWidth: lengthDesignValueSchema.optional(),
    bottomWidth: lengthDesignValueSchema.optional(),
    leftWidth: lengthDesignValueSchema.optional(),
    style: z.enum(['none', 'solid', 'dashed', 'dotted']).optional(),
    color: colorDesignValueSchema.optional(),
  })
  .strict();

export const componentRadiusSchema = z
  .object({
    radius: radiusDesignValueSchema.optional(),
    topLeft: radiusDesignValueSchema.optional(),
    topRight: radiusDesignValueSchema.optional(),
    bottomRight: radiusDesignValueSchema.optional(),
    bottomLeft: radiusDesignValueSchema.optional(),
  })
  .strict();

export const componentSurfaceSchema = z
  .object({
    background: colorDesignValueSchema.optional(),
    foreground: colorDesignValueSchema.optional(),
    elevation: elevationDesignValueSchema.optional(),
  })
  .strict();

export const componentLayoutSchema = z
  .object({
    direction: z.enum(['row', 'column']).optional(),
    alignment: z.enum(['start', 'center', 'end', 'stretch']).optional(),
    justification: z
      .enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround'])
      .optional(),
    wrap: z.enum(['nowrap', 'wrap']).optional(),
    gap: lengthDesignValueSchema.optional(),
  })
  .strict();

export const componentOverflowSchema = z
  .object({
    x: z.enum(['visible', 'clip', 'auto']).optional(),
    y: z.enum(['visible', 'clip', 'auto']).optional(),
  })
  .strict();

export const componentVisualPropertiesSchema = z
  .object({
    dimensions: componentDimensionsSchema.optional(),
    spacing: componentSpacingSchema.optional(),
    border: componentBorderSchema.optional(),
    radius: componentRadiusSchema.optional(),
    surface: componentSurfaceSchema.optional(),
    typography: typographyDesignValueSchema.optional(),
    layout: componentLayoutSchema.optional(),
    overflow: componentOverflowSchema.optional(),
  })
  .strict();

export const componentSlotConfigurationSchema = z.record(
  componentKeySchema,
  z
    .object({
      enabled: z.boolean(),
      visual: componentVisualPropertiesSchema.optional(),
    })
    .strict(),
);

const componentOverrideCollectionSchema = z.record(
  componentKeySchema,
  componentVisualPropertiesSchema,
);

export const componentVisualOverridesSchema = z
  .object({
    variants: componentOverrideCollectionSchema.default({}),
    sizes: componentOverrideCollectionSchema.default({}),
    states: componentOverrideCollectionSchema.default({}),
  })
  .strict();

const componentContractV2BaseSchema = componentContractSchema.omit({
  type: true,
  name: true,
});

export const componentContractV2Schema = componentContractV2BaseSchema
  .extend({
    version: z.literal(componentContractVersion),
    key: componentKeySchema,
    name: z.string().trim().min(1, { message: 'componentNameRequired' }),
    templateKey: componentTemplateKeySchema,
    category: componentCategorySchema,
    visual: componentVisualPropertiesSchema.default({}),
    slots: componentSlotConfigurationSchema.default({}),
    overrides: componentVisualOverridesSchema.default({
      variants: {},
      sizes: {},
      states: {},
    }),
  })
  .strict();

export const componentIdentitySchema = z
  .object({
    key: componentKeySchema,
    name: z.string().trim().min(1, { message: 'componentNameRequired' }),
    templateKey: componentTemplateKeySchema,
    category: componentCategorySchema,
  })
  .strict();

export const componentIdentityCollectionSchema = z
  .array(componentIdentitySchema)
  .superRefine((identities, context) => {
    const seenKeys = new Set<string>();

    identities.forEach((identity, index) => {
      if (seenKeys.has(identity.key)) {
        context.addIssue({
          code: 'custom',
          path: [index, 'key'],
          message: 'componentKeyAlreadyExists',
        });
        return;
      }

      seenKeys.add(identity.key);
    });
  });

export type ComponentContractV2 = z.infer<typeof componentContractV2Schema>;
export type ComponentIdentity = z.infer<typeof componentIdentitySchema>;
export type ComponentCategory = z.infer<typeof componentCategorySchema>;
export type ComponentVisualProperties = z.infer<
  typeof componentVisualPropertiesSchema
>;
export type ComponentSlotConfiguration = z.infer<
  typeof componentSlotConfigurationSchema
>;
export type ComponentVisualOverrides = z.infer<
  typeof componentVisualOverridesSchema
>;

export type StoredComponentContractInput = {
  contractVersion: number;
  key: string;
  name: string;
  templateKey: string;
  category: string;
  contract: unknown;
};

type TemplateSlotRequirement = 'required' | 'optional';

type TemplateSlotProfile = Readonly<Record<string, TemplateSlotRequirement>>;

export const componentTemplateSlotProfiles = {
  button: {
    leadingIcon: 'optional',
    label: 'required',
    trailingIcon: 'optional',
    loadingIndicator: 'optional',
  },
  textField: {
    label: 'optional',
    field: 'required',
    leadingAdornment: 'optional',
    input: 'required',
    trailingAdornment: 'optional',
    helpText: 'optional',
    errorText: 'optional',
  },
  card: {
    header: 'optional',
    content: 'required',
    footer: 'optional',
  },
  alert: {
    icon: 'optional',
    title: 'optional',
    content: 'required',
    actions: 'optional',
    dismiss: 'optional',
  },
  dialog: {
    backdrop: 'required',
    panel: 'required',
    header: 'optional',
    content: 'required',
    footer: 'optional',
    closeAction: 'optional',
  },
} as const satisfies Readonly<Record<string, TemplateSlotProfile>>;

export type WaveAComponentTemplateKey =
  keyof typeof componentTemplateSlotProfiles;

const legacyCategoryByType: Record<ComponentContractType, ComponentCategory> = {
  button: 'action',
  textField: 'input',
  card: 'layout',
  alert: 'feedback',
  dialog: 'overlay',
};

export function getLegacyComponentCategory(
  type: ComponentContractType,
): ComponentCategory {
  return legacyCategoryByType[type];
}

function isKnownWaveATemplate(
  templateKey: string,
): templateKey is WaveAComponentTemplateKey {
  return Object.prototype.hasOwnProperty.call(
    componentTemplateSlotProfiles,
    templateKey,
  );
}

export function resolveComponentSlots(
  templateKey: string,
  slots: ComponentSlotConfiguration,
): ComponentSlotConfiguration {
  if (!isKnownWaveATemplate(templateKey)) {
    return slots;
  }

  const profile = componentTemplateSlotProfiles[templateKey];
  const resolved: ComponentSlotConfiguration = {};

  for (const [slotKey, requirement] of Object.entries(profile)) {
    resolved[slotKey] = slots[slotKey] ?? {
      enabled: requirement === 'required',
    };
  }

  return resolved;
}

export function validateComponentSlotConfiguration({
  templateKey,
  slots,
}: {
  templateKey: string;
  slots: ComponentSlotConfiguration;
}): { success: boolean; issues: string[] } {
  if (!isKnownWaveATemplate(templateKey)) {
    return { success: false, issues: ['componentTemplateUnsupported'] };
  }

  const profile = componentTemplateSlotProfiles[templateKey];
  const issues: string[] = [];

  for (const [slotKey, configuration] of Object.entries(slots)) {
    if (!Object.prototype.hasOwnProperty.call(profile, slotKey)) {
      issues.push(`componentSlotUnsupported:${slotKey}`);
      continue;
    }

    const requirement = profile[slotKey as keyof typeof profile];

    if (requirement === 'required' && !configuration.enabled) {
      issues.push(`componentSlotRequired:${slotKey}`);
    }
  }

  return { success: issues.length === 0, issues };
}

function createTokenReference(
  binding: ComponentTokenBinding,
):
  | { source: 'token'; tokenType: 'spacing'; path: string }
  | { source: 'token'; tokenType: 'radius'; path: string }
  | { source: 'token'; tokenType: 'color'; path: string }
  | null {
  if (binding.tokenType === 'spacing') {
    return {
      source: 'token',
      tokenType: 'spacing',
      path: binding.tokenPath,
    };
  }

  if (binding.tokenType === 'radius') {
    return {
      source: 'token',
      tokenType: 'radius',
      path: binding.tokenPath,
    };
  }

  if (binding.tokenType === 'color') {
    return {
      source: 'token',
      tokenType: 'color',
      path: binding.tokenPath,
    };
  }

  return null;
}

function migrateLegacyVisualProperties(
  tokenBindings: readonly ComponentTokenBinding[],
): ComponentVisualProperties {
  const visual: ComponentVisualProperties = {};

  for (const binding of tokenBindings) {
    const tokenReference = createTokenReference(binding);

    if (!tokenReference) {
      continue;
    }

    if (binding.key === 'background' && tokenReference.tokenType === 'color') {
      visual.surface = {
        ...visual.surface,
        background: tokenReference,
      };
      continue;
    }

    if (binding.key === 'foreground' && tokenReference.tokenType === 'color') {
      visual.surface = {
        ...visual.surface,
        foreground: tokenReference,
      };
      continue;
    }

    if (binding.key === 'radius' && tokenReference.tokenType === 'radius') {
      visual.radius = {
        ...visual.radius,
        radius: tokenReference,
      };
      continue;
    }

    if (
      (binding.key === 'padding' ||
        binding.key === 'paddingX' ||
        binding.key === 'paddingY' ||
        binding.key === 'paddingTop' ||
        binding.key === 'paddingRight' ||
        binding.key === 'paddingBottom' ||
        binding.key === 'paddingLeft' ||
        binding.key === 'gap') &&
      tokenReference.tokenType === 'spacing'
    ) {
      visual.spacing = {
        ...visual.spacing,
        [binding.key]: tokenReference,
      };
    }
  }

  return componentVisualPropertiesSchema.parse(visual);
}

function getLegacyAnatomyKeys(contract: ComponentContract): Set<string> {
  return new Set(
    contract.anatomy.map((part) =>
      typeof part === 'string' ? part : part.key,
    ),
  );
}

function createLegacySlotConfiguration(
  contract: ComponentContract,
): ComponentSlotConfiguration {
  const anatomyKeys = getLegacyAnatomyKeys(contract);

  if (contract.type === 'button') {
    return {
      label: { enabled: true },
      leadingIcon: { enabled: anatomyKeys.has('icon') },
      trailingIcon: { enabled: false },
      loadingIndicator: {
        enabled: contract.states.some((state) => state.key === 'loading'),
      },
    };
  }

  if (contract.type === 'textField') {
    return {
      label: { enabled: anatomyKeys.has('label') },
      field: { enabled: true },
      input: { enabled: true },
      leadingAdornment: { enabled: false },
      trailingAdornment: { enabled: false },
      helpText: { enabled: anatomyKeys.has('hint') },
      errorText: { enabled: anatomyKeys.has('error') },
    };
  }

  if (contract.type === 'card') {
    return {
      header: { enabled: anatomyKeys.has('header') },
      content: { enabled: true },
      footer: { enabled: anatomyKeys.has('footer') },
    };
  }

  if (contract.type === 'alert') {
    return {
      icon: { enabled: anatomyKeys.has('icon') },
      title: { enabled: anatomyKeys.has('title') },
      content: { enabled: true },
      actions: { enabled: anatomyKeys.has('actions') },
      dismiss: { enabled: false },
    };
  }

  return {
    backdrop: { enabled: true },
    panel: { enabled: true },
    header: { enabled: anatomyKeys.has('title') },
    content: { enabled: true },
    footer: { enabled: anatomyKeys.has('actions') },
    closeAction: { enabled: false },
  };
}

export function migrateLegacyComponentContract(
  input: unknown,
  identityOverride?: Partial<ComponentIdentity>,
): ComponentContractV2 {
  const legacyContract = componentContractSchema.parse(input);
  const identity = componentIdentitySchema.parse({
    key: identityOverride?.key ?? legacyContract.type,
    name: identityOverride?.name ?? legacyContract.name,
    templateKey: identityOverride?.templateKey ?? legacyContract.type,
    category:
      identityOverride?.category ??
      getLegacyComponentCategory(legacyContract.type),
  });

  return componentContractV2Schema.parse({
    version: componentContractVersion,
    ...identity,
    purpose: legacyContract.purpose,
    usageGuidelines: legacyContract.usageGuidelines,
    contentGuidelines: legacyContract.contentGuidelines,
    status: legacyContract.status,
    anatomy: legacyContract.anatomy,
    variants: legacyContract.variants,
    sizes: legacyContract.sizes,
    states: legacyContract.states,
    tokenBindings: legacyContract.tokenBindings,
    accessibility: legacyContract.accessibility,
    forbiddenPatterns: legacyContract.forbiddenPatterns,
    visual: migrateLegacyVisualProperties(legacyContract.tokenBindings),
    slots: createLegacySlotConfiguration(legacyContract),
    overrides: {
      variants: {},
      sizes: {},
      states: {},
    },
  });
}

export function parseStoredComponentContractV2({
  contractVersion,
  key,
  name,
  templateKey,
  category,
  contract,
}: StoredComponentContractInput): ComponentContractV2 {
  if (contractVersion === 1) {
    return migrateLegacyComponentContract(contract, {
      key: componentKeySchema.parse(key),
      name,
      templateKey: componentTemplateKeySchema.parse(templateKey),
      category: componentCategorySchema.parse(category),
    });
  }

  if (contractVersion !== componentContractVersion) {
    throw new Error(
      `Unsupported ComponentContract version: ${contractVersion}`,
    );
  }

  if (
    typeof contract !== 'object' ||
    contract === null ||
    Array.isArray(contract)
  ) {
    return componentContractV2Schema.parse(contract);
  }

  return componentContractV2Schema.parse({
    ...contract,
    key,
    name,
    templateKey,
    category,
    version: componentContractVersion,
  });
}

export function toLegacyComponentContract(
  contract: ComponentContractV2,
): ComponentContract {
  const parsedType = componentContractTypeSchema.safeParse(
    contract.templateKey,
  );

  if (!parsedType.success) {
    throw new Error(
      `Template ${contract.templateKey} has no legacy ComponentContract adapter`,
    );
  }

  return componentContractSchema.parse({
    type: parsedType.data,
    name: contract.name,
    purpose: contract.purpose,
    usageGuidelines: contract.usageGuidelines,
    contentGuidelines: contract.contentGuidelines,
    status: contract.status,
    anatomy: contract.anatomy,
    variants: contract.variants,
    sizes: contract.sizes,
    states: contract.states,
    tokenBindings: contract.tokenBindings,
    accessibility: contract.accessibility,
    forbiddenPatterns: contract.forbiddenPatterns,
  });
}

function mergeRadiusProperties(
  base: ComponentVisualProperties['radius'],
  override: ComponentVisualProperties['radius'],
): ComponentVisualProperties['radius'] {
  if (!override) {
    return base;
  }

  if (!base) {
    return override;
  }

  if (!override.radius) {
    return componentRadiusSchema.parse({ ...base, ...override });
  }

  return componentRadiusSchema.parse({
    radius: override.radius,
    ...(override.topLeft ? { topLeft: override.topLeft } : {}),
    ...(override.topRight ? { topRight: override.topRight } : {}),
    ...(override.bottomRight ? { bottomRight: override.bottomRight } : {}),
    ...(override.bottomLeft ? { bottomLeft: override.bottomLeft } : {}),
  });
}

function mergeVisualProperties(
  base: ComponentVisualProperties,
  override: ComponentVisualProperties | undefined,
): ComponentVisualProperties {
  if (!override) {
    return base;
  }

  return componentVisualPropertiesSchema.parse({
    dimensions:
      base.dimensions || override.dimensions
        ? { ...base.dimensions, ...override.dimensions }
        : undefined,
    spacing:
      base.spacing || override.spacing
        ? { ...base.spacing, ...override.spacing }
        : undefined,
    border:
      base.border || override.border
        ? { ...base.border, ...override.border }
        : undefined,
    radius: mergeRadiusProperties(base.radius, override.radius),
    surface:
      base.surface || override.surface
        ? { ...base.surface, ...override.surface }
        : undefined,
    typography: override.typography ?? base.typography,
    layout:
      base.layout || override.layout
        ? { ...base.layout, ...override.layout }
        : undefined,
    overflow:
      base.overflow || override.overflow
        ? { ...base.overflow, ...override.overflow }
        : undefined,
  });
}

export function resolveComponentVisualProperties({
  templateDefaults = {},
  base = {},
  overrides,
  variantKey,
  sizeKey,
  stateKey,
}: {
  templateDefaults?: ComponentVisualProperties;
  base?: ComponentVisualProperties;
  overrides: ComponentVisualOverrides;
  variantKey?: string;
  sizeKey?: string;
  stateKey?: string;
}): ComponentVisualProperties {
  let resolved = mergeVisualProperties(templateDefaults, base);

  if (variantKey) {
    resolved = mergeVisualProperties(resolved, overrides.variants[variantKey]);
  }

  if (sizeKey) {
    resolved = mergeVisualProperties(resolved, overrides.sizes[sizeKey]);
  }

  if (stateKey) {
    resolved = mergeVisualProperties(resolved, overrides.states[stateKey]);
  }

  return resolved;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function resetComponentVisualOverrideProperty(
  override: ComponentVisualProperties,
  group: keyof ComponentVisualProperties,
  property: string,
): ComponentVisualProperties {
  const next = structuredClone(override) as unknown;

  if (!isRecord(next)) {
    return {};
  }

  const groupValue = next[group];

  if (!isRecord(groupValue)) {
    return componentVisualPropertiesSchema.parse(next);
  }

  delete groupValue[property];

  if (Object.keys(groupValue).length === 0) {
    delete next[group];
  }

  return componentVisualPropertiesSchema.parse(next);
}
