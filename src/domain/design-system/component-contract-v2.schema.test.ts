import { describe, expect, it } from 'vitest';
import {
  colorDesignValueSchema,
  componentContractV2Schema,
  componentIdentityCollectionSchema,
  lengthDesignValueSchema,
  migrateLegacyComponentContract,
  parseStoredComponentContractV2,
  resetComponentVisualOverrideProperty,
  resolveComponentVisualProperties,
  toLegacyComponentContract,
  validateComponentSlotConfiguration,
} from './component-contract-v2.schema';
import { mvpComponentContractSeeds } from './mvp-seed-templates';

describe('ComponentContract V2 domain', () => {
  it('accepts token and explicit DesignValue branches without arbitrary CSS', () => {
    expect(
      lengthDesignValueSchema.safeParse({
        source: 'token',
        tokenType: 'spacing',
        path: 'spacing.4',
      }).success,
    ).toBe(true);
    expect(
      lengthDesignValueSchema.safeParse({
        source: 'value',
        value: '32rem',
      }).success,
    ).toBe(true);
    expect(
      lengthDesignValueSchema.safeParse({
        source: 'value',
        value: 'calc(100% - 2rem)',
      }).success,
    ).toBe(false);

    expect(
      colorDesignValueSchema.safeParse({
        source: 'token',
        tokenType: 'color',
        path: 'color.semantic.action.primary',
      }).success,
    ).toBe(true);
    expect(
      colorDesignValueSchema.safeParse({
        source: 'value',
        value: '#ff8731',
      }).success,
    ).toBe(true);
    expect(
      colorDesignValueSchema.safeParse({
        source: 'value',
        value: 'red; background: black',
      }).success,
    ).toBe(false);
  });

  it('migrates all five legacy seed shapes deterministically', () => {
    const migrated = mvpComponentContractSeeds.map((seed) =>
      migrateLegacyComponentContract(seed),
    );

    expect(migrated.map((contract) => contract.version)).toEqual([
      2, 2, 2, 2, 2,
    ]);
    expect(migrated.map((contract) => contract.key)).toEqual([
      'button',
      'textField',
      'card',
      'alert',
      'dialog',
    ]);
    expect(migrated.map((contract) => contract.templateKey)).toEqual([
      'button',
      'textField',
      'card',
      'alert',
      'dialog',
    ]);

    for (const contract of migrated) {
      expect(componentContractV2Schema.safeParse(contract).success).toBe(true);
      expect(contract.purpose.en).toBeTruthy();
      expect(contract.accessibility.length).toBeGreaterThan(0);
    }
  });

  it('preserves custom and recognized legacy Token bindings', () => {
    const buttonSeed = mvpComponentContractSeeds.find(
      (seed) => seed.type === 'button',
    );

    expect(buttonSeed).toBeDefined();

    const migrated = migrateLegacyComponentContract({
      ...buttonSeed,
      tokenBindings: [
        ...(buttonSeed?.tokenBindings ?? []),
        {
          key: 'brandGlow',
          tokenType: 'color',
          tokenPath: 'color.custom.brandGlow',
        },
      ],
    });

    expect(
      migrated.tokenBindings.some((binding) => binding.key === 'brandGlow'),
    ).toBe(true);
    expect(migrated.visual.surface?.background).toEqual({
      source: 'token',
      tokenType: 'color',
      path: 'color.semantic.action.primary',
    });
    expect(migrated.visual.radius?.radius).toEqual({
      source: 'token',
      tokenType: 'radius',
      path: 'radius.md',
    });
    expect(migrated.visual.spacing?.paddingX).toEqual({
      source: 'token',
      tokenType: 'spacing',
      path: 'spacing.4',
    });
  });

  it('supports distinct arbitrary identities using the same template', () => {
    const buttonSeed = mvpComponentContractSeeds.find(
      (seed) => seed.type === 'button',
    );

    const marketingCta = migrateLegacyComponentContract(buttonSeed, {
      key: 'marketingCta',
      name: 'Marketing CTA',
      templateKey: 'button',
      category: 'action',
    });
    const checkoutCta = migrateLegacyComponentContract(buttonSeed, {
      key: 'checkoutCta',
      name: 'Checkout CTA',
      templateKey: 'button',
      category: 'action',
    });

    expect(marketingCta.key).not.toBe(checkoutCta.key);
    expect(marketingCta.templateKey).toBe('button');
    expect(checkoutCta.templateKey).toBe('button');
    expect(componentContractV2Schema.safeParse(marketingCta).success).toBe(
      true,
    );
    expect(componentContractV2Schema.safeParse(checkoutCta).success).toBe(true);
  });

  it('rejects duplicate identity keys inside one project identity set', () => {
    const duplicateIdentities = [
      {
        key: 'marketingCta',
        name: 'Marketing CTA',
        templateKey: 'button',
        category: 'action',
      },
      {
        key: 'marketingCta',
        name: 'Checkout CTA',
        templateKey: 'button',
        category: 'action',
      },
    ];

    expect(
      componentIdentityCollectionSchema.safeParse(duplicateIdentities).success,
    ).toBe(false);
  });

  it('validates slots against the Wave A template structure', () => {
    expect(
      validateComponentSlotConfiguration({
        templateKey: 'card',
        slots: {
          content: { enabled: true },
          header: { enabled: true },
          footer: { enabled: false },
        },
      }),
    ).toEqual({ success: true, issues: [] });

    expect(
      validateComponentSlotConfiguration({
        templateKey: 'card',
        slots: {
          content: { enabled: false },
        },
      }).issues,
    ).toContain('componentSlotRequired:content');

    expect(
      validateComponentSlotConfiguration({
        templateKey: 'card',
        slots: {
          content: { enabled: true },
          sidebar: { enabled: true },
        },
      }).issues,
    ).toContain('componentSlotUnsupported:sidebar');
  });

  it('resolves sparse overrides in variant then size then state order', () => {
    const resolved = resolveComponentVisualProperties({
      templateDefaults: {
        surface: {
          background: { source: 'value', value: '#ffffff' },
          foreground: { source: 'value', value: '#111111' },
        },
      },
      base: {
        radius: {
          radius: { source: 'value', value: '0.5rem' },
        },
      },
      overrides: {
        variants: {
          primary: {
            surface: {
              background: { source: 'value', value: '#222222' },
            },
          },
        },
        sizes: {
          lg: {
            spacing: {
              paddingX: { source: 'value', value: '2rem' },
            },
          },
        },
        states: {
          disabled: {
            surface: {
              background: { source: 'value', value: '#333333' },
            },
          },
        },
      },
      variantKey: 'primary',
      sizeKey: 'lg',
      stateKey: 'disabled',
    });

    expect(resolved.surface?.background).toEqual({
      source: 'value',
      value: '#333333',
    });
    expect(resolved.surface?.foreground).toEqual({
      source: 'value',
      value: '#111111',
    });
    expect(resolved.spacing?.paddingX).toEqual({
      source: 'value',
      value: '2rem',
    });
    expect(resolved.radius?.radius).toEqual({
      source: 'value',
      value: '0.5rem',
    });
  });

  it('resets one override property back to inherited behavior', () => {
    const override = {
      surface: {
        background: { source: 'value' as const, value: '#333333' },
        foreground: { source: 'value' as const, value: '#ffffff' },
      },
    };

    const reset = resetComponentVisualOverrideProperty(
      override,
      'surface',
      'background',
    );
    const resolved = resolveComponentVisualProperties({
      base: {
        surface: {
          background: { source: 'value', value: '#111111' },
        },
      },
      overrides: {
        variants: { primary: reset },
        sizes: {},
        states: {},
      },
      variantKey: 'primary',
    });

    expect(reset.surface?.background).toBeUndefined();
    expect(reset.surface?.foreground).toEqual({
      source: 'value',
      value: '#ffffff',
    });
    expect(resolved.surface?.background).toEqual({
      source: 'value',
      value: '#111111',
    });
  });

  it('normalizes stored V1 records and keeps legacy downstream compatibility', () => {
    const buttonSeed = mvpComponentContractSeeds.find(
      (seed) => seed.type === 'button',
    );

    const normalized = parseStoredComponentContractV2({
      contractVersion: 1,
      key: 'marketingCta',
      name: 'Marketing CTA',
      templateKey: 'button',
      category: 'action',
      contract: buttonSeed,
    });
    const legacy = toLegacyComponentContract(normalized);

    expect(normalized.key).toBe('marketingCta');
    expect(normalized.templateKey).toBe('button');
    expect(legacy.type).toBe('button');
    expect(legacy.name).toBe('Marketing CTA');
    expect(legacy.purpose).toEqual(normalized.purpose);
    expect(legacy.accessibility).toEqual(normalized.accessibility);
    expect(legacy.tokenBindings).toEqual(normalized.tokenBindings);
  });
});
