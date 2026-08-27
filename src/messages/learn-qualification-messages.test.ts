import { describe, expect, it } from 'vitest';
import { learnMessages } from './learn-messages';
import { learnDesignSystemsMessages } from './learn-design-systems-messages';
import { learnDesignTokensMessages } from './learn-design-tokens-messages';
import { learnThemesMessages } from './learn-themes-messages';
import { learnComponentsMessages } from './learn-components-messages';
import { learnAccessibilityMessages } from './learn-accessibility-messages';
import { learnDocumentationDeliveryMessages } from './learn-documentation-delivery-messages';
import { learnAiReadyDesignSystemsMessages } from './learn-ai-ready-design-systems-messages';
import { learnQualificationMessages } from './learn-qualification-messages';
import { learnQualificationFollowupMessages } from './learn-qualification-followup-messages';
import { qualifyFrenchLearnTypography } from './learn-french-typography';
import { mergeMessages, type MessageObject } from './merge-messages';

function buildQualifiedFrenchLearnMessages(): MessageObject {
  const messages = [
    learnMessages.fr,
    learnDesignSystemsMessages.fr,
    learnDesignTokensMessages.fr,
    learnThemesMessages.fr,
    learnComponentsMessages.fr,
    learnAccessibilityMessages.fr,
    learnDocumentationDeliveryMessages.fr,
    learnAiReadyDesignSystemsMessages.fr,
    learnQualificationMessages.fr,
    learnQualificationFollowupMessages.fr,
  ].reduce<MessageObject>(mergeMessages, {});

  return qualifyFrenchLearnTypography(messages);
}

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flatMap(collectStrings);
  }

  return [];
}

function getPage(
  messages: MessageObject,
  key: string,
): Record<string, unknown> {
  const page = messages[key];

  if (typeof page !== 'object' || page === null || Array.isArray(page)) {
    throw new Error(`Missing Learn page messages: ${key}`);
  }

  return page as Record<string, unknown>;
}

function getCheckpointItems(page: Record<string, unknown>): string[] {
  const checkpoint = page.checkpoint;

  if (
    typeof checkpoint !== 'object' ||
    checkpoint === null ||
    Array.isArray(checkpoint)
  ) {
    return [];
  }

  const items = (checkpoint as Record<string, unknown>).items;

  if (typeof items !== 'object' || items === null || Array.isArray(items)) {
    return [];
  }

  return Object.values(items).filter(
    (item): item is string => typeof item === 'string',
  );
}

describe('French Learn qualification', () => {
  const messages = buildQualifiedFrenchLearnMessages();
  const allText = collectStrings(messages).join('\n');

  it('reflects the completed seven-chapter curriculum', () => {
    const learnPage = getPage(messages, 'LearnPage');
    const curriculum = learnPage.curriculum as Record<string, unknown>;

    expect(curriculum.description).toContain('désormais disponible');
    expect(curriculum.description).not.toContain('publiés progressivement');

    for (const pageKey of [
      'LearnDesignSystemsPage',
      'LearnDesignTokensPage',
      'LearnThemesPage',
      'LearnComponentsPage',
      'LearnAccessibilityPage',
      'LearnDocumentationDeliveryPage',
    ]) {
      const page = getPage(messages, pageKey);
      const continueSection = page.continue as Record<string, unknown>;

      expect(continueSection.status).toBe('Disponible');
    }
  });

  it('uses the qualified French terminology for recurring editorial calques', () => {
    expect(allText).not.toMatch(
      /\b(?:checklist|workflow|workspace|preview|seed|mapping|mappings|binding|bindings|guidance|fallback|strictness|first-class|authoring|discovery|purpose|patterns)\b/i,
    );
    expect(allText).not.toContain('source de vérité');

    const components = getPage(messages, 'LearnComponentsPage');
    const structuredSource = components.structuredSource as Record<
      string,
      unknown
    >;
    const structuredItems = structuredSource.items as Record<string, string>;

    expect(structuredItems.ai).toContain('demandent aux assistants');
    expect(structuredItems.ai).not.toContain('imposent aux assistants');
  });

  it('normalizes French guillemets, high punctuation and units', () => {
    expect(allText).not.toMatch(/«[ \u00A0]/);
    expect(allText).not.toMatch(/[ \u00A0]»/);
    expect(allText).not.toMatch(/[ \u00A0][?:;!]/);

    const designSystems = getPage(messages, 'LearnDesignSystemsPage');
    const openingProblem = designSystems.openingProblem as Record<
      string,
      unknown
    >;
    const cards = openingProblem.cards as Record<
      string,
      Record<string, string>
    >;
    const firstCard = cards.first;
    const secondCard = cards.second;

    if (!firstCard || !secondCard) {
      throw new Error('Missing Design Systems opening-problem cards');
    }

    expect(firstCard.padding).toBe(
      'Espacement intérieur\u202f: 12 × 16\u202fpx',
    );
    expect(secondCard.padding).toBe(
      'Espacement intérieur\u202f: 8 × 24\u202fpx',
    );
  });

  it('keeps checkpoint lists as comma-led prose rather than semicolon chains', () => {
    for (const pageKey of [
      'LearnDesignSystemsPage',
      'LearnDesignTokensPage',
      'LearnThemesPage',
      'LearnComponentsPage',
      'LearnAccessibilityPage',
      'LearnDocumentationDeliveryPage',
      'LearnAiReadyDesignSystemsPage',
    ]) {
      const items = getCheckpointItems(getPage(messages, pageKey));

      expect(items.every((item) => !item.trimEnd().endsWith(';'))).toBe(true);
    }
  });

  it('localizes pedagogical contrast ratios without changing the underlying product rule', () => {
    const accessibility = getPage(messages, 'LearnAccessibilityPage');
    const openingProblem = accessibility.openingProblem as Record<
      string,
      unknown
    >;
    const correct = openingProblem.correct as Record<string, unknown>;
    const drifted = openingProblem.drifted as Record<string, unknown>;
    const contrast = accessibility.contrast as Record<string, unknown>;
    const rows = contrast.rows as Record<string, Record<string, string>>;
    const passRow = rows.pass;
    const warningRow = rows.warning;
    const failRow = rows.fail;

    if (!passRow || !warningRow || !failRow) {
      throw new Error('Missing Accessibility contrast rows');
    }

    expect(correct.ratio).toBe('8,89:1');
    expect(drifted.ratio).toBe('1,97:1');
    expect(passRow.range).toBe('≥ 4,5:1');
    expect(warningRow.range).toBe('3,0–4,49:1');
    expect(failRow.range).toBe('< 3,0:1');
  });
});
