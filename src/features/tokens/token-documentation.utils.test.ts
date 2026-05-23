import { describe, expect, it } from 'vitest';
import { getTokenDocumentationDescription } from './token-documentation.utils';

describe('getTokenDocumentationDescription', () => {
  it('returns localized token descriptions for documentation exports', () => {
    expect(
      getTokenDocumentationDescription({
        locale: 'fr',
        row: {
          id: 'color.action.primary',
          path: 'color.action.primary',
          type: 'color',
          value: '#ff8731',
          rawValue: '#ff8731',
          description: {
            en: 'Primary action color',
            fr: 'Couleur principale des actions',
          },
          isColorValue: true,
          validationStatus: 'valid',
          errorMessages: [],
        },
      }),
    ).toBe('Couleur principale des actions');
  });

  it('uses fallback descriptions for documentation exports', () => {
    expect(
      getTokenDocumentationDescription({
        locale: 'fr',
        row: {
          id: 'color.action.primary',
          path: 'color.action.primary',
          type: 'color',
          value: '#ff8731',
          rawValue: '#ff8731',
          description: {
            en: 'Primary action color',
          },
          isColorValue: true,
          validationStatus: 'valid',
          errorMessages: [],
        },
      }),
    ).toBe('Primary action color');
  });
});
