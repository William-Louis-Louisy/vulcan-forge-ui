import { describe, expect, it } from 'vitest';
import { examplesPageMessages } from './examples-page-messages';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe('examplesPageMessages', () => {
  it('keeps English and French message shapes aligned', () => {
    expect(flattenKeys(examplesPageMessages.en).sort()).toEqual(
      flattenKeys(examplesPageMessages.fr).sort(),
    );
  });

  it('keeps the public example explicit about fictional data', () => {
    expect(
      examplesPageMessages.en.ExamplesPage.hero.disclosure.toLowerCase(),
    ).toContain('fictional');
    expect(
      examplesPageMessages.fr.ExamplesPage.hero.disclosure.toLowerCase(),
    ).toContain('fictiv');
  });

  it('keeps the demo project unnamed to avoid product-name confusion', () => {
    expect(JSON.stringify(examplesPageMessages)).not.toContain('Aurora');
  });

  it('keeps the walkthrough centered on five connected workflow stages', () => {
    expect(
      Object.keys(examplesPageMessages.en.ExamplesPage.workflow.steps),
    ).toEqual(['token', 'theme', 'component', 'accessibility', 'delivery']);
  });

  it('explains AI-assisted development through reusable project context', () => {
    expect(
      Object.keys(examplesPageMessages.en.ExamplesPage.aiDevelopment.rules),
    ).toEqual(['tokens', 'components', 'accessibility', 'reuse']);
    expect(
      examplesPageMessages.fr.ExamplesPage.aiDevelopment.description.toLowerCase(),
    ).toContain('assistant ia');
  });

  it('documents the six beta delivery formats', () => {
    const englishFormats =
      examplesPageMessages.en.ExamplesPage.delivery.formatLabels;

    expect(Object.keys(englishFormats)).toEqual([
      'css',
      'tailwind',
      'typescript',
      'reactNative',
      'markdown',
      'aiInstructions',
    ]);
  });
});
