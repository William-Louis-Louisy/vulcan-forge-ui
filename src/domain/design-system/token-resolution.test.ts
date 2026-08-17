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

  it('resolves references inside typography composites', () => {
    const result = resolveDesignTokens([
      {
        path: 'spacing.scale.4',
        type: 'spacing',
        value: '16px',
        status: 'ready',
      },
      {
        path: 'typography.body.md',
        type: 'typography',
        value: {
          fontFamily: 'Inter',
          fontSize: '{spacing.scale.4}',
          lineHeight: '1.5',
        },
        status: 'ready',
      },
    ]);

    expect(
      getResolvedTokenByPath({
        path: 'typography.body.md',
        result,
      }),
    ).toMatchObject({
      resolvedValue: {
        fontFamily: 'Inter',
        fontSize: '16px',
        lineHeight: '1.5',
      },
      resolvedReferencePath: null,
      isResolved: true,
      errors: [],
    });
  });

  it('resolves alias chains inside typography composites', () => {
    const result = resolveDesignTokens([
      {
        path: 'spacing.base',
        type: 'spacing',
        value: '16px',
        status: 'ready',
      },
      {
        path: 'spacing.scale.4',
        type: 'spacing',
        value: '{spacing.base}',
        reference: '{spacing.base}',
        status: 'ready',
      },
      {
        path: 'typography.body.md',
        type: 'typography',
        value: {
          fontSize: '{spacing.scale.4}',
        },
        status: 'ready',
      },
    ]);

    expect(
      getResolvedTokenByPath({
        path: 'typography.body.md',
        result,
      }),
    ).toMatchObject({
      resolvedValue: {
        fontSize: '16px',
      },
      isResolved: true,
      errors: [],
    });
  });

  it('reports missing references inside typography composites', () => {
    const result = resolveDesignTokens([
      {
        path: 'typography.body.md',
        type: 'typography',
        value: {
          fontFamily: 'Inter',
          fontSize: '{spacing.missing}',
        },
        status: 'ready',
      },
    ]);

    expect(result.errors).toEqual([
      {
        code: 'tokenNotFound',
        tokenPath: 'typography.body.md',
        referencePath: 'spacing.missing',
        chain: ['typography.body.md'],
      },
    ]);
    expect(result.tokens[0]).toMatchObject({
      resolvedValue: {
        fontFamily: 'Inter',
        fontSize: '{spacing.missing}',
      },
      isResolved: false,
    });
  });

  it('reports circular references inside typography composites', () => {
    const result = resolveDesignTokens([
      {
        path: 'spacing.a',
        type: 'spacing',
        value: '{spacing.b}',
        reference: '{spacing.b}',
        status: 'ready',
      },
      {
        path: 'spacing.b',
        type: 'spacing',
        value: '{spacing.a}',
        reference: '{spacing.a}',
        status: 'ready',
      },
      {
        path: 'typography.body.md',
        type: 'typography',
        value: {
          fontSize: '{spacing.a}',
        },
        status: 'ready',
      },
    ]);

    expect(
      getResolvedTokenByPath({
        path: 'typography.body.md',
        result,
      }),
    ).toMatchObject({
      resolvedValue: {
        fontSize: '{spacing.a}',
      },
      isResolved: false,
      errors: [
        {
          code: 'circularReference',
          tokenPath: 'typography.body.md',
          referencePath: 'spacing.a',
          chain: [
            'typography.body.md',
            'spacing.a',
            'spacing.b',
            'spacing.a',
          ],
        },
      ],
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
