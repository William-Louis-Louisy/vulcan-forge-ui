import { describe, expect, it } from 'vitest';
import { qualifyFrenchLearnTypography } from './learn-french-typography';

const narrowNoBreakSpace = '\u202F';

describe('qualifyFrenchLearnTypography', () => {
  it('keeps French guillemets and high punctuation attached to their text', () => {
    const result = qualifyFrenchLearnTypography({
      quote: '« Exemple français »',
      punctuation: 'Question ? Réponse : oui ; évidemment !',
    });

    expect(result.quote).toBe(
      `«${narrowNoBreakSpace}Exemple français${narrowNoBreakSpace}»`,
    );
    expect(result.punctuation).toBe(
      `Question${narrowNoBreakSpace}? Réponse${narrowNoBreakSpace}: oui${narrowNoBreakSpace}; évidemment${narrowNoBreakSpace}!`,
    );
  });

  it('keeps short numeric units together', () => {
    const result = qualifyFrenchLearnTypography({
      spacing: 'Rayon de 14 px · durée de 150 ms',
    });

    expect(result.spacing).toBe(
      `Rayon de 14${narrowNoBreakSpace}px · durée de 150${narrowNoBreakSpace}ms`,
    );
  });

  it('does not rewrite code punctuation or compact ratios', () => {
    const result = qualifyFrenchLearnTypography({
      css: '--color-action: #FF8731;',
      ratio: '4,5:1',
      token: '{color.semantic.action.primary}',
    });

    expect(result).toEqual({
      css: '--color-action: #FF8731;',
      ratio: '4,5:1',
      token: '{color.semantic.action.primary}',
    });
  });
});
