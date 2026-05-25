import { describe, expect, it } from 'vitest';
import type { DesignToken } from './design-token.schema';
import {
  getResolvedTokenByPath,
  isTokenReference,
  pathToTokenReference,
  resolveDesignTokens,
  tokenReferenceToPath,
} from './token-resolution';

const tokens = [
  {
    path: 'color.primitive.accent.primary',
    type: 'color',
    value: '#ff8731',
    status: 'ready',
  },
  {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '{color.primitive.accent.primary}',
    reference: '{color.primitive.accent.primary}',
    status: 'ready',
  },
] satisfies DesignToken[];

describe('token reference helpers', () => {
  it('converts a token path to a token reference', () => {
    expect(pathToTokenReference('color.primitive.accent.primary')).toBe(
      '{color.primitive.accent.primary}',
    );
  });

  it('extracts a token path from a token reference', () => {
    expect(tokenReferenceToPath('{color.primitive.accent.primary}')).toBe(
      'color.primitive.accent.primary',
    );
  });

  it('detects token references', () => {
    expect(isTokenReference('{color.primitive.accent.primary}')).toBe(true);
    expect(isTokenReference('#ff8731')).toBe(false);
  });
});

describe('resolveDesignTokens', () => {
  it('resolves primitive tokens to their own value', () => {
    const result = resolveDesignTokens(tokens);

    expect(
      getResolvedTokenByPath({
        path: 'color.primitive.accent.primary',
        result,
      }),
    ).toMatchObject({
      path: 'color.primitive.accent.primary',
      rawValue: '#ff8731',
      resolvedValue: '#ff8731',
      isResolved: true,
      errors: [],
    });
  });

  it('resolves semantic aliases to primitive token values', () => {
    const result = resolveDesignTokens(tokens);

    expect(
      getResolvedTokenByPath({
        path: 'color.semantic.action.primary',
        result,
      }),
    ).toMatchObject({
      path: 'color.semantic.action.primary',
      rawValue: '{color.primitive.accent.primary}',
      resolvedValue: '#ff8731',
      resolvedReferencePath: 'color.primitive.accent.primary',
      resolutionChain: [
        'color.semantic.action.primary',
        'color.primitive.accent.primary',
      ],
      isResolved: true,
      errors: [],
    });
  });

  it('resolves nested aliases', () => {
    const result = resolveDesignTokens([
      {
        path: 'color.primitive.accent.primary',
        type: 'color',
        value: '#ff8731',
        status: 'ready',
      },
      {
        path: 'color.semantic.action.primary',
        type: 'color',
        value: '{color.primitive.accent.primary}',
        reference: '{color.primitive.accent.primary}',
        status: 'ready',
      },
      {
        path: 'color.component.button.background',
        type: 'color',
        value: '{color.semantic.action.primary}',
        reference: '{color.semantic.action.primary}',
        status: 'ready',
      },
    ]);

    expect(
      getResolvedTokenByPath({
        path: 'color.component.button.background',
        result,
      }),
    ).toMatchObject({
      resolvedValue: '#ff8731',
      resolutionChain: [
        'color.component.button.background',
        'color.semantic.action.primary',
        'color.primitive.accent.primary',
      ],
      isResolved: true,
    });
  });

  it('returns an error when a reference target does not exist', () => {
    const result = resolveDesignTokens([
      {
        path: 'color.semantic.action.primary',
        type: 'color',
        value: '{color.primitive.missing}',
        reference: '{color.primitive.missing}',
        status: 'ready',
      },
    ]);

    expect(result.errors).toEqual([
      {
        code: 'tokenNotFound',
        tokenPath: 'color.semantic.action.primary',
        referencePath: 'color.primitive.missing',
        chain: ['color.semantic.action.primary'],
      },
    ]);

    expect(result.tokens[0]).toMatchObject({
      isResolved: false,
      resolvedValue: '{color.primitive.missing}',
    });
  });

  it('detects circular references', () => {
    const result = resolveDesignTokens([
      {
        path: 'color.semantic.a',
        type: 'color',
        value: '{color.semantic.b}',
        reference: '{color.semantic.b}',
        status: 'ready',
      },
      {
        path: 'color.semantic.b',
        type: 'color',
        value: '{color.semantic.a}',
        reference: '{color.semantic.a}',
        status: 'ready',
      },
    ]);

    expect(result.errors).toEqual([
      {
        code: 'circularReference',
        tokenPath: 'color.semantic.a',
        referencePath: 'color.semantic.a',
        chain: ['color.semantic.a', 'color.semantic.b', 'color.semantic.a'],
      },
      {
        code: 'circularReference',
        tokenPath: 'color.semantic.b',
        referencePath: 'color.semantic.b',
        chain: ['color.semantic.b', 'color.semantic.a', 'color.semantic.b'],
      },
    ]);
  });
});
