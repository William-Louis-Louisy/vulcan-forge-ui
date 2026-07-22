import { describe, expect, it } from 'vitest';
import { tokenizeExportLine } from './ExportCodePreview';

function compactTokens(
  tokens: ReturnType<typeof tokenizeExportLine>,
): Array<[string, string]> {
  return tokens
    .filter((token) => token.value.length > 0)
    .map((token) => [token.kind, token.value]);
}

describe('tokenizeExportLine', () => {
  it('highlights CSS custom property names and values', () => {
    expect(
      compactTokens(
        tokenizeExportLine(
          'cssVariables',
          '  --color-action-primary: #c96442;',
        ),
      ),
    ).toEqual([
      ['plain', '  '],
      ['name', '--color-action-primary'],
      ['punctuation', ': '],
      ['value', '#c96442'],
      ['punctuation', ';'],
    ]);
  });

  it('highlights TypeScript keywords, property names and strings', () => {
    const tokens = compactTokens(
      tokenizeExportLine(
        'typescriptTheme',
        "export const theme = { accent: '#c96442' };",
      ),
    );

    expect(tokens).toContainEqual(['keyword', 'export']);
    expect(tokens).toContainEqual(['keyword', 'const']);
    expect(tokens).toContainEqual(['name', 'accent']);
    expect(tokens).toContainEqual(['value', "'#c96442'"]);
  });

  it('highlights Markdown headings and inline code', () => {
    expect(
      compactTokens(
        tokenizeExportLine('documentationMarkdown', '## Use `color.bg.app`'),
      ),
    ).toEqual([
      ['keyword', '## '],
      ['name', 'Use `color.bg.app`'],
    ]);

    expect(
      compactTokens(
        tokenizeExportLine(
          'documentationMarkdown',
          '- Use `color.bg.app` for page backgrounds.',
        ),
      ),
    ).toContainEqual(['value', '`color.bg.app`']);
  });
});
