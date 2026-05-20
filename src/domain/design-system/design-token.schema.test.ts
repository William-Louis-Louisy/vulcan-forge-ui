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
});
