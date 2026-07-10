import {
  parseComponentTokenSets,
  createComponentTokenOptions,
  getComponentPreviewBinding,
  resolveComponentTokenBindings,
  normalizeComponentPreviewTokenRole,
  createComponentPreviewSemanticPalette,
  createComponentTokenBindingResolution,
} from './component-token-bindings.utils';
import { describe, expect, it } from 'vitest';
import type { ComponentContract, DesignTokenSet } from '@/domain/design-system';

const colorTokenSet: DesignTokenSet = {
  type: 'color',
  name: 'Colors',
  tokens: [
    {
      path: 'color.primitive.blue.500',
      type: 'color',
      value: '#2563eb',
      status: 'ready',
    },
    {
      path: 'color.primitive.green.500',
      type: 'color',
      value: '#16a34a',
      status: 'ready',
    },
    {
      path: 'color.background.default',
      type: 'color',
      value: '{color.primitive.blue.500}',
      reference: '{color.primitive.blue.500}',
      status: 'ready',
    },
    {
      path: 'color.semantic.action.primary',
      type: 'color',
      value: '{color.primitive.blue.500}',
      reference: '{color.primitive.blue.500}',
      status: 'ready',
    },
    {
      path: 'color.semantic.status.success',
      type: 'color',
      value: '{color.primitive.green.500}',
      reference: '{color.primitive.green.500}',
      status: 'ready',
    },
  ],
};

const radiusTokenSet: DesignTokenSet = {
  type: 'radius',
  name: 'Radius',
  tokens: [
    {
      path: 'radius.md',
      type: 'radius',
      value: '0.5rem',
      status: 'ready',
    },
  ],
};

describe('component-token-bindings utils', () => {
  it('parses valid token sets', () => {
    expect(
      parseComponentTokenSets([
        {
          type: colorTokenSet.type,
          name: colorTokenSet.name,
          tokens: colorTokenSet.tokens,
        },
      ]),
    ).toEqual({
      tokenSets: [colorTokenSet],
      invalidTokenSetsCount: 0,
    });
  });

  it('counts invalid token sets', () => {
    expect(
      parseComponentTokenSets([
        {
          type: 'color',
          name: 'Colors',
          tokens: [],
        },
      ]),
    ).toEqual({
      tokenSets: [],
      invalidTokenSetsCount: 1,
    });
  });

  it('resolves component token bindings', () => {
    const result = resolveComponentTokenBindings({
      bindings: [
        {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.background.default',
        },
        {
          key: 'radius',
          tokenType: 'radius',
          tokenPath: 'radius.md',
        },
      ],
      tokenSets: [colorTokenSet, radiusTokenSet],
    });

    expect(result.missingBindings).toEqual([]);
    expect(result.bindings.background?.resolvedValue).toBe('#2563eb');
    expect(result.bindings.radius?.resolvedValue).toBe('0.5rem');
  });

  it('reports missing bindings when the token path is not found', () => {
    const missingBinding: ComponentContract['tokenBindings'][number] = {
      key: 'paddingX',
      tokenType: 'spacing',
      tokenPath: 'spacing.4',
    };

    const result = resolveComponentTokenBindings({
      bindings: [missingBinding],
      tokenSets: [colorTokenSet, radiusTokenSet],
    });

    expect(result.bindings).toEqual({});
    expect(result.missingBindings).toEqual([missingBinding]);
  });

  it('reports missing bindings when the token type does not match', () => {
    const binding: ComponentContract['tokenBindings'][number] = {
      key: 'background',
      tokenType: 'radius',
      tokenPath: 'color.background.default',
    };

    const result = resolveComponentTokenBindings({
      bindings: [binding],
      tokenSets: [colorTokenSet],
    });

    expect(result.bindings).toEqual({});
    expect(result.missingBindings).toEqual([binding]);
  });

  it('creates a full binding resolution from raw token sets', () => {
    const result = createComponentTokenBindingResolution({
      bindings: [
        {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.background.default',
        },
      ],
      rawTokenSets: [
        {
          type: colorTokenSet.type,
          name: colorTokenSet.name,
          tokens: colorTokenSet.tokens,
        },
      ],
    });

    expect(result.invalidTokenSetsCount).toBe(0);
    expect(result.bindings.background?.resolvedValue).toBe('#2563eb');
  });

  it('normalizes common visual role aliases', () => {
    expect(normalizeComponentPreviewTokenRole('background-color')).toBe(
      'background',
    );
    expect(normalizeComponentPreviewTokenRole('borderRadius')).toBe('radius');
    expect(normalizeComponentPreviewTokenRole('padding-inline')).toBe(
      'paddingX',
    );
  });

  it('finds a resolved binding through its normalized preview role', () => {
    const resolution = createComponentTokenBindingResolution({
      bindings: [
        {
          key: 'background-color',
          tokenType: 'color',
          tokenPath: 'color.background.default',
        },
      ],
      rawTokenSets: [
        {
          type: colorTokenSet.type,
          name: colorTokenSet.name,
          tokens: colorTokenSet.tokens,
        },
      ],
    });

    expect(
      getComponentPreviewBinding(resolution, 'background')?.resolvedValue,
    ).toBe('#2563eb');
  });

  it('creates semantic action and status palettes with missing tone metadata', () => {
    const palette = createComponentPreviewSemanticPalette([
      {
        type: colorTokenSet.type,
        name: colorTokenSet.name,
        tokens: colorTokenSet.tokens,
      },
    ]);

    expect(palette.action.primary).toBe('#2563eb');
    expect(palette.status.success).toBe('#16a34a');
    expect(palette.missingStatusTones).toEqual([
      'info',
      'warning',
      'danger',
    ]);
  });

  it('creates token options from raw token sets', () => {
    expect(
      createComponentTokenOptions([
        {
          type: colorTokenSet.type,
          name: colorTokenSet.name,
          tokens: colorTokenSet.tokens,
        },
      ]),
    ).toEqual(
      colorTokenSet.tokens.map((token) => ({
        type: token.type,
        path: token.path,
        label: token.path,
      })),
    );
  });
});
