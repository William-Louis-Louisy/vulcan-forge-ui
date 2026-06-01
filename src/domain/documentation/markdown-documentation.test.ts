import { describe, expect, it } from 'vitest';
import { generateMarkdownDocumentation } from './markdown-documentation';
import type { MarkdownDocumentationInput } from './markdown-documentation';
import type { ComponentContract, DesignToken } from '@/domain/design-system';

const tokens: DesignToken[] = [
  {
    path: 'color.primitive.accent.primary',
    type: 'color',
    value: '#ff8731',
    status: 'ready',
    description: {
      en: 'Primary accent color.',
      fr: 'Couleur d’accent principale.',
    },
  },
  {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '{color.primitive.accent.primary}',
    reference: '{color.primitive.accent.primary}',
    status: 'ready',
    description: {
      en: 'Main action color.',
    },
  },
];

const components: ComponentContract[] = [
  {
    type: 'button',
    name: 'Button',
    purpose: {
      en: 'Triggers an action.',
      fr: 'Déclenche une action.',
    },
    status: 'ready',
    anatomy: ['root', 'label'],
    variants: [
      {
        key: 'primary',
        label: {
          en: 'Primary',
          fr: 'Primaire',
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
        en: 'Do not use buttons for navigation.',
        fr: 'Ne pas utiliser les boutons pour la navigation.',
      },
    ],
  },
];

const baseInput = {
  project: {
    name: 'Vulcan DS',
    description: 'A pragmatic design system.',
    defaultLocale: 'en',
    supportedLocales: ['en', 'fr'],
  },
  tokens,
  themes: [
    {
      mode: 'light',
      name: 'Light',
      tokens: {
        color: {
          background: '#ffffff',
        },
      },
    },
    {
      mode: 'dark',
      name: 'Dark',
      tokens: {
        color: {
          background: '#070707',
        },
      },
    },
  ],
  components,
  accessibility: {
    score: 92,
    status: 'healthy',
    contrastPairs: [
      {
        pair: {
          id: 'contentPrimaryOnAppBackground',
          foregroundTokenPath: 'color.semantic.content.primary',
          backgroundTokenPath: 'color.semantic.background.app',
          textSize: 'normal',
        },
        foreground: '#111827',
        background: '#ffffff',
        status: 'pass',
        contrast: {
          foreground: '#111827',
          background: '#ffffff',
          ratio: 17.74,
          requiredRatio: 4.5,
          status: 'pass',
          textSize: 'normal',
          isValid: true,
          error: null,
        },
        issues: [],
      },
    ],
  },
} satisfies Omit<
  MarkdownDocumentationInput,
  'locale' | 'fallbackLocale' | 'sections'
>;

describe('generateMarkdownDocumentation', () => {
  it('generates English Markdown documentation', () => {
    const result = generateMarkdownDocumentation({
      ...baseInput,
      locale: 'en',
    });

    expect(result.markdown).toContain('# Vulcan DS');
    expect(result.markdown).toContain('## Overview');
    expect(result.markdown).toContain('## Tokens');
    expect(result.markdown).toContain('Primary accent color.');
    expect(result.markdown).toContain('## Themes');
    expect(result.markdown).toContain('## Components');
    expect(result.markdown).toContain('Triggers an action.');
    expect(result.markdown).toContain('## Accessibility');
  });

  it('generates French Markdown documentation', () => {
    const result = generateMarkdownDocumentation({
      ...baseInput,
      locale: 'fr',
      fallbackLocale: 'en',
    });

    expect(result.markdown).toContain('## Vue d’ensemble');
    expect(result.markdown).toContain('## Tokens');
    expect(result.markdown).toContain('Couleur d’accent principale.');
    expect(result.markdown).toContain('Déclenche une action.');
    expect(result.markdown).toContain('## Accessibilité');
  });

  it('tracks missing translations when fallback is used', () => {
    const result = generateMarkdownDocumentation({
      ...baseInput,
      locale: 'fr',
      fallbackLocale: 'en',
    });

    expect(result.missingTranslations).toContainEqual({
      path: 'tokens.color.semantic.action.primary.description',
      requestedLocale: 'fr',
      fallbackLocale: 'en',
    });

    expect(result.markdown).toContain('## Traductions manquantes');
  });

  it('can include only selected sections', () => {
    const result = generateMarkdownDocumentation({
      ...baseInput,
      locale: 'en',
      sections: ['tokens'],
    });

    expect(result.markdown).toContain('## Tokens');
    expect(result.markdown).not.toContain('## Themes');
    expect(result.markdown).not.toContain('## Components');
    expect(result.markdown).not.toContain('## Accessibility');
  });
});
