import { describe, expect, it } from 'vitest';
import { designTokenSchema, designTokenSetSchema } from './design-token.schema';

describe('designTokenSchema', () => {
  it('accepts a valid design token', () => {
    expect(
      designTokenSchema.parse({
        path: 'color.action.primary',
        type: 'color',
        value: '#ff8731',
        description: {
          en: 'Primary action color',
          fr: 'Couleur d’action principale',
        },
      }),
    ).toMatchObject({
      path: 'color.action.primary',
      type: 'color',
      value: '#ff8731',
      status: 'draft',
    });
  });

  it('accepts and preserves a composite typography value', () => {
    expect(
      designTokenSchema.parse({
        path: 'typography.body.base',
        type: 'typography',
        value: {
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
      }).value,
    ).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0em',
    });
  });

  it('normalizes JSON-string typography values created by the previous editor', () => {
    const token = designTokenSchema.parse({
      path: 'typography.body.base',
      type: 'typography',
      value: JSON.stringify({
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontWeight: 600,
      }),
    });

    expect(token.value).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: 600,
    });
  });

  it('normalizes legacy atomic typography seed values by path', () => {
    const token = designTokenSchema.parse({
      path: 'typography.fontWeight.semibold',
      type: 'typography',
      value: 600,
    });

    expect(token.value).toEqual({
      fontWeight: 600,
    });
  });

  it('rejects object values for non-typography tokens', () => {
    expect(
      designTokenSchema.safeParse({
        path: 'spacing.4',
        type: 'spacing',
        value: { fontSize: '1rem' },
      }).success,
    ).toBe(false);
  });

  it('rejects an invalid token path', () => {
    expect(
      designTokenSchema.safeParse({
        path: 'color action primary',
        type: 'color',
        value: '#ff8731',
      }).success,
    ).toBe(false);
  });

  it('accepts a valid token set', () => {
    expect(
      designTokenSetSchema.safeParse({
        type: 'spacing',
        name: 'Spacing',
        tokens: [
          {
            path: 'spacing.4',
            type: 'spacing',
            value: '1rem',
          },
        ],
      }).success,
    ).toBe(true);
  });

  it('accepts an empty authored token set', () => {
    expect(
      designTokenSetSchema.safeParse({
        type: 'spacing',
        name: 'Spacing',
        tokens: [],
      }).success,
    ).toBe(true);
  });
});
