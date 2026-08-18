import { describe, expect, it } from 'vitest';
import type { ComponentContract, DesignTokenSet } from './index';
import {
  parseComponentTokenSets,
  resolveComponentTokenBindings,
} from './component-token-bindings';

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
      path: 'color.background.default',
      type: 'color',
      value: '{color.primitive.blue.500}',
      reference: '{color.primitive.blue.500}',
      status: 'ready',
    },
  ],
};

describe('component token binding domain', () => {
  it('parses authored token sets before binding resolution', () => {
    expect(
      parseComponentTokenSets([
        colorTokenSet,
        {
          type: 'unknown',
          name: 'Invalid',
          tokens: [],
        },
      ]),
    ).toEqual({
      tokenSets: [colorTokenSet],
      invalidTokenSetsCount: 1,
    });
  });

  it('resolves valid bindings through the canonical token resolver', () => {
    const result = resolveComponentTokenBindings({
      bindings: [
        {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.background.default',
        },
      ],
      tokenSets: [colorTokenSet],
    });

    expect(result.missingBindings).toEqual([]);
    expect(result.bindings.background?.resolvedValue).toBe('#2563eb');
  });

  it('preserves the historical raw-value fallback for broken references', () => {
    const reference = '{color.primitive.missing}';
    const tokenSet: DesignTokenSet = {
      type: 'color',
      name: 'Colors',
      tokens: [
        {
          path: 'color.background.broken',
          type: 'color',
          value: reference,
          reference,
          status: 'ready',
        },
      ],
    };

    const result = resolveComponentTokenBindings({
      bindings: [
        {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.background.broken',
        },
      ],
      tokenSets: [tokenSet],
    });

    expect(result.bindings.background).toMatchObject({
      value: reference,
      resolvedValue: reference,
      isResolved: true,
    });
  });

  it('reports a binding whose token type does not match', () => {
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
});
