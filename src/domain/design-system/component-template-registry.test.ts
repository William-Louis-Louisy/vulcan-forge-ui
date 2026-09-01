import { describe, expect, it } from 'vitest';
import {
  componentTemplateDefinitions,
  createComponentContractFromTemplate,
  getComponentTemplateDefinition,
  getComponentTemplateRendererKey,
  migrateLegacyComponentToRegisteredTemplate,
  resolveStoredComponentTemplateContract,
} from './component-template-registry';
import { componentContractV2Schema } from './component-contract-v2.schema';
import { mvpComponentContractSeeds } from './mvp-seed-templates';

describe('componentTemplateDefinitions', () => {
  it('registers the five Wave A templates with typed defaults', () => {
    expect(componentTemplateDefinitions.map((template) => template.key)).toEqual([
      'button',
      'textField',
      'card',
      'alert',
      'dialog',
    ]);

    for (const template of componentTemplateDefinitions) {
      expect(componentContractV2Schema.safeParse(template.defaultContract).success).toBe(
        true,
      );
      expect(template.defaultContract.templateKey).toBe(template.key);
      expect(template.defaultContract.category).toBe(template.category);
      expect(template.rendererKey).toBe(template.key);
    }
  });

  it('captures constrained vs full capability profiles instead of exposing every group uniformly', () => {
    expect(getComponentTemplateDefinition('button')?.capabilities).toMatchObject({
      dimensions: 'constrained',
      spacing: 'full',
      layout: 'constrained',
      overflow: 'none',
    });
    expect(getComponentTemplateDefinition('card')?.capabilities.overflow).toBe(
      'full',
    );
    expect(getComponentTemplateDefinition('dialog')?.capabilities.overflow).toBe(
      'full',
    );
  });

  it('keeps renderer selection attached to the template rather than Component identity', () => {
    const component = createComponentContractFromTemplate({
      templateKey: 'button',
      key: 'marketingCta',
      name: 'Marketing CTA',
    });

    expect(component.key).toBe('marketingCta');
    expect(component.templateKey).toBe('button');
    expect(getComponentTemplateRendererKey(component.templateKey)).toBe('button');
  });
});

describe('createComponentContractFromTemplate', () => {
  it('creates multiple first-class identities from the same template without coupling identity to renderer', () => {
    const primaryCta = createComponentContractFromTemplate({
      templateKey: 'button',
      key: 'primaryCta',
      name: 'Primary CTA',
    });
    const checkoutAction = createComponentContractFromTemplate({
      templateKey: 'button',
      key: 'checkoutAction',
      name: 'Checkout Action',
    });

    expect(primaryCta.key).not.toBe(checkoutAction.key);
    expect(primaryCta.templateKey).toBe('button');
    expect(checkoutAction.templateKey).toBe('button');
    expect(primaryCta.variants).toEqual(checkoutAction.variants);
    expect(primaryCta.slots.label).toEqual({ enabled: true });
  });

  it('preserves template defaults while allowing identity, category and status overrides', () => {
    const component = createComponentContractFromTemplate({
      templateKey: 'card',
      key: 'pricingCard',
      name: 'Pricing Card',
      category: 'dataDisplay',
      status: 'draft',
    });

    expect(component).toMatchObject({
      key: 'pricingCard',
      name: 'Pricing Card',
      templateKey: 'card',
      category: 'dataDisplay',
      status: 'draft',
    });
    expect(component.slots.content).toEqual({ enabled: true });
    expect(component.slots.header).toEqual({ enabled: true });
    expect(component.slots.footer).toEqual({ enabled: true });
  });
});

describe('template migration adapters', () => {
  it.each(mvpComponentContractSeeds)(
    'migrates the legacy $type seed through its registered template',
    (legacyContract) => {
      const result = migrateLegacyComponentToRegisteredTemplate(legacyContract);

      expect(result.template.key).toBe(legacyContract.type);
      expect(result.contract.templateKey).toBe(legacyContract.type);
      expect(result.contract.name).toBe(legacyContract.name);
      expect(result.contract.purpose).toEqual(legacyContract.purpose);
      expect(result.contract.accessibility).toEqual(legacyContract.accessibility);
      expect(result.contract.forbiddenPatterns).toEqual(
        legacyContract.forbiddenPatterns,
      );
    },
  );

  it('preserves custom legacy token bindings during registered-template migration', () => {
    const legacyButton = mvpComponentContractSeeds.find(
      (contract) => contract.type === 'button',
    );

    expect(legacyButton).toBeDefined();

    const result = migrateLegacyComponentToRegisteredTemplate({
      ...legacyButton,
      tokenBindings: [
        ...(legacyButton?.tokenBindings ?? []),
        {
          key: 'customBrandRole',
          tokenType: 'color',
          tokenPath: 'color.primitive.accent.secondary',
        },
      ],
    });

    expect(result.contract.tokenBindings).toContainEqual({
      key: 'customBrandRole',
      tokenType: 'color',
      tokenPath: 'color.primitive.accent.secondary',
    });
  });

  it('normalizes a stored V1 record and resolves missing slots from the registered template', () => {
    const legacyCard = mvpComponentContractSeeds.find(
      (contract) => contract.type === 'card',
    );

    expect(legacyCard).toBeDefined();

    const result = resolveStoredComponentTemplateContract({
      contractVersion: 1,
      key: 'featureCard',
      name: 'Feature Card',
      templateKey: 'card',
      category: 'layout',
      contract: legacyCard,
    });

    expect(result.template.key).toBe('card');
    expect(result.contract).toMatchObject({
      key: 'featureCard',
      name: 'Feature Card',
      templateKey: 'card',
    });
    expect(result.contract.slots).toEqual({
      header: { enabled: true },
      content: { enabled: true },
      footer: { enabled: true },
    });
  });

  it('rejects unknown template keys at the registry boundary', () => {
    expect(() =>
      resolveStoredComponentTemplateContract({
        contractVersion: 2,
        key: 'mystery',
        name: 'Mystery',
        templateKey: 'mystery',
        category: 'other',
        contract: {
          version: 2,
          key: 'mystery',
          name: 'Mystery',
          templateKey: 'mystery',
          category: 'other',
          status: 'draft',
          purpose: {},
          anatomy: [],
          variants: [],
          sizes: [],
          states: [],
          tokenBindings: [],
          accessibility: [],
          forbiddenPatterns: [],
          visual: {},
          slots: {},
          overrides: {
            variants: {},
            sizes: {},
            states: {},
          },
        },
      }),
    ).toThrow('Unsupported Component template: mystery');
  });
});
