import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import {
  detachComponentTokenBindings,
  detachThemeTokenReferences,
  findTokenDependencies,
  removeTokenByPath,
} from './delete-token.utils';

const tokens: DesignToken[] = [
  {
    path: 'color.primitive.blue.500',
    type: 'color',
    value: '#2563eb',
    status: 'ready',
  },
  {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '{color.primitive.blue.500}',
    reference: '{color.primitive.blue.500}',
    status: 'ready',
  },
];

describe('delete-token utils', () => {
  it('removes an unreferenced token', () => {
    const result = removeTokenByPath({
      tokens,
      tokenPath: 'color.semantic.action.primary',
    });

    expect(result).toEqual({
      status: 'success',
      tokens: [tokens[0]],
    });
  });

  it('returns tokenNotFound for an unknown path', () => {
    expect(
      removeTokenByPath({ tokens, tokenPath: 'color.primitive.missing' }),
    ).toEqual({
      status: 'error',
      error: 'tokenNotFound',
    });
  });

  it('finds token, theme and component dependencies', () => {
    const dependencies = findTokenDependencies({
      tokenPath: 'color.primitive.blue.500',
      tokenSets: [{ tokens }],
      themes: [
        {
          name: 'Light',
          tokens: {
            color: {
              accent: '{color.primitive.blue.500}',
            },
          },
        },
      ],
      componentContracts: [
        {
          name: 'Button',
          contract: {
            type: 'button',
            name: 'Button',
            purpose: { en: 'Triggers an action.' },
            tokenBindings: [
              {
                key: 'background',
                tokenType: 'color',
                tokenPath: 'color.primitive.blue.500',
              },
            ],
          },
        },
      ],
    });

    expect(dependencies).toEqual([
      {
        kind: 'token',
        label: 'color.semantic.action.primary',
      },
      {
        kind: 'theme',
        label: 'Light · color.accent',
      },
      {
        kind: 'component',
        label: 'Button · background',
      },
    ]);
  });

  it('detaches a deleted token from theme mappings while preserving siblings', () => {
    const result = detachThemeTokenReferences({
      tokenPath: 'color.primitive.blue.500',
      tokens: {
        color: {
          background: '{color.primitive.neutral.0}',
          accent: '{color.primitive.blue.500}',
        },
      },
    });

    expect(result).toEqual({
      removedCount: 1,
      value: {
        color: {
          background: '{color.primitive.neutral.0}',
        },
      },
    });
  });

  it('detaches matching component bindings while preserving the contract', () => {
    const result = detachComponentTokenBindings({
      tokenPath: 'color.primitive.blue.500',
      contract: {
        type: 'button',
        name: 'Button',
        purpose: { en: 'Triggers an action.' },
        tokenBindings: [
          {
            key: 'background',
            tokenType: 'color',
            tokenPath: 'color.primitive.blue.500',
          },
          {
            key: 'radius',
            tokenType: 'radius',
            tokenPath: 'radius.md',
          },
        ],
      },
    });

    expect(result.removedCount).toBe(1);
    expect(result.value).toMatchObject({
      type: 'button',
      name: 'Button',
      tokenBindings: [
        {
          key: 'radius',
          tokenType: 'radius',
          tokenPath: 'radius.md',
        },
      ],
    });
  });
});
