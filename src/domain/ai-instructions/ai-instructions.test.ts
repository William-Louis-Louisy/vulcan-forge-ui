import { describe, expect, it } from 'vitest';
import { generateAiInstructions } from './ai-instructions';
import type { ComponentContract, DesignToken } from '@/domain/design-system';

const tokens: DesignToken[] = [
  {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '{color.primitive.accent.primary}',
    reference: '{color.primitive.accent.primary}',
    status: 'ready',
  },
  {
    path: 'spacing.4',
    type: 'spacing',
    value: '1rem',
    status: 'ready',
  },
  {
    path: 'color.legacy.brand',
    type: 'color',
    value: '#000000',
    status: 'deprecated',
  },
];

const components: ComponentContract[] = [
  {
    type: 'button',
    name: 'Button',
    purpose: {
      en: 'Triggers an important user action.',
      fr: 'Déclenche une action importante de l’utilisateur.',
    },
    status: 'ready',
    anatomy: ['root', 'label', 'icon'],
    variants: [
      {
        key: 'primary',
        label: {
          en: 'Primary',
          fr: 'Principal',
        },
      },
    ],
    states: [
      {
        key: 'disabled',
        label: {
          en: 'Disabled',
          fr: 'Désactivé',
        },
      },
    ],
    accessibility: [
      {
        key: 'accessible-name',
        severity: 'critical',
        description: {
          en: 'Buttons must expose an accessible name.',
          fr: 'Les boutons doivent exposer un nom accessible.',
        },
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Do not use a button as a navigation link.',
        fr: 'Ne pas utiliser un bouton comme lien de navigation.',
      },
    ],
  },
  {
    type: 'alert',
    name: 'Alert',
    purpose: {
      en: 'Communicates important feedback.',
    },
    status: 'draft',
    anatomy: ['root', 'title', 'description'],
    variants: [],
    states: [],
    accessibility: [],
    forbiddenPatterns: [],
  },
];

const baseInput = {
  project: {
    name: 'Aurora System',
    description: 'A pragmatic design system.',
    defaultLocale: 'en',
    supportedLocales: ['en', 'fr'],
  },
  tokens,
  components,
} as const;

describe('generateAiInstructions', () => {
  it('generates English AI instructions', () => {
    const result = generateAiInstructions({
      ...baseInput,
      locale: 'en',
      strictness: 'strict',
    });

    expect(result.fileName).toBe('aurora-system-ai-instructions-en.md');
    expect(result.content).toContain('# Aurora System — AI instructions');
    expect(result.content).toContain('## Anti-hallucination rules');
    expect(result.content).toContain('## Token rules');
    expect(result.content).toContain('## Component rules');
    expect(result.content).toContain('## Accessibility rules');
    expect(result.content).toContain('## Forbidden patterns');
    expect(result.content).toContain('Do not invent tokens');
    expect(result.content).toContain('color.semantic.action.primary');
    expect(result.content).toContain('Button.accessible-name');
    expect(result.content).not.toContain('color.legacy.brand');
  });

  it('generates French AI instructions', () => {
    const result = generateAiInstructions({
      ...baseInput,
      locale: 'fr',
      fallbackLocale: 'en',
      strictness: 'balanced',
    });

    expect(result.fileName).toBe('aurora-system-ai-instructions-fr.md');
    expect(result.content).toContain('# Aurora System — Instructions IA');
    expect(result.content).toContain('## Règles anti-hallucination');
    expect(result.content).toContain('## Règles de tokens');
    expect(result.content).toContain(
      'Déclenche une action importante de l’utilisateur.',
    );
    expect(result.content).toContain(
      'Les boutons doivent exposer un nom accessible.',
    );
  });

  it('changes tone according to strictness', () => {
    const balanced = generateAiInstructions({
      ...baseInput,
      locale: 'en',
      strictness: 'balanced',
    });

    const veryStrict = generateAiInstructions({
      ...baseInput,
      locale: 'en',
      strictness: 'veryStrict',
    });

    expect(balanced.content).toContain('allow careful implementation choices');
    expect(veryStrict.content).toContain('Use only explicit model data');
  });

  it('can include only selected sections while always keeping anti-hallucination rules', () => {
    const result = generateAiInstructions({
      ...baseInput,
      locale: 'en',
      strictness: 'strict',
      sections: ['tokenRules'],
    });

    expect(result.content).toContain('## Anti-hallucination rules');
    expect(result.content).toContain('## Token rules');
    expect(result.content).not.toContain('## Component rules');
    expect(result.content).not.toContain('## Accessibility rules');
    expect(result.content).not.toContain('## Forbidden patterns');
  });

  it('tracks missing translations when fallback is used', () => {
    const result = generateAiInstructions({
      ...baseInput,
      locale: 'fr',
      fallbackLocale: 'en',
      strictness: 'strict',
    });

    expect(result.missingTranslations).toContainEqual({
      path: 'components.alert.purpose',
      requestedLocale: 'fr',
      fallbackLocale: 'en',
    });

    expect(result.content).toContain('## Traductions manquantes');
  });
});
