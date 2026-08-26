import { describe, expect, it } from 'vitest';
import { learnDocumentationDeliveryMessages } from './learn-documentation-delivery-messages';

function flattenKeys(
  value: Record<string, unknown>,
  prefix = '',
): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
      return flattenKeys(child as Record<string, unknown>, path);
    }

    return [path];
  });
}

describe('learnDocumentationDeliveryMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    const en =
      learnDocumentationDeliveryMessages.en.LearnDocumentationDeliveryPage;
    const fr =
      learnDocumentationDeliveryMessages.fr.LearnDocumentationDeliveryPage;

    expect(flattenKeys(fr).sort()).toEqual(flattenKeys(en).sort());
  });

  it('uses the current semantic action decision across code-oriented outputs', () => {
    const page =
      learnDocumentationDeliveryMessages.en.LearnDocumentationDeliveryPage;

    expect(page.oneDecision.tokenPath).toBe('color.semantic.action.primary');
    expect(page.oneDecision.tokenValue).toBe('#FF8731');
    expect(page.oneDecision.formats.css.snippet).toBe(
      '--color-semantic-action-primary: #FF8731;',
    );
    expect(page.oneDecision.formats.tailwind.snippet).toContain(
      'var(--color-semantic-action-primary)',
    );
    expect(page.oneDecision.formats.typescript.snippet).toContain('#FF8731');
    expect(page.oneDecision.formats.native.snippet).toContain('#FF8731');
  });

  it('teaches the current documentation and export boundaries', () => {
    const page =
      learnDocumentationDeliveryMessages.en.LearnDocumentationDeliveryPage;

    expect(page.documentation.sections.overview).toContain('Overview');
    expect(page.documentation.sections.tokens).toContain('Tokens');
    expect(page.documentation.sections.themes).toContain('Themes');
    expect(page.documentation.sections.components).toContain('Components');
    expect(page.documentation.sections.accessibility).toContain('Accessibility');
    expect(page.diagnostics.items.deprecated).toContain('excluded by default');
    expect(page.diagnostics.items.resolution).toContain('Unresolved token references');
    expect(page.snapshot.notSync).toContain('does not currently push updates');
    expect(page.productBridge.formats).toContain('CSS Variables');
    expect(page.productBridge.formats).toContain('Tailwind v4');
    expect(page.productBridge.formats).toContain('TypeScript Theme');
    expect(page.productBridge.formats).toContain('React Native Theme');
    expect(page.productBridge.formats).toContain('Markdown Documentation');
  });

  it('keeps AI Instructions deferred to the final curriculum chapter', () => {
    const page =
      learnDocumentationDeliveryMessages.en.LearnDocumentationDeliveryPage;

    expect(page.productBridge.deferred).toContain('Chapter 07');
    expect(page.continue.title).toBe('AI-ready Design Systems');
  });

  it('uses French narrow no-break spaces inside guillemets', () => {
    const title =
      learnDocumentationDeliveryMessages.fr.LearnDocumentationDeliveryPage
        .misconception.title;

    expect(title).toContain('« Généré depuis une source unique »');
    expect(title).toContain('« tous les consommateurs restent synchronisés »');
  });
});
