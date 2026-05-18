import { describe, expect, it } from 'vitest';
import { createDesignSystemSchema } from './create-design-system.schema';

describe('createDesignSystemSchema', () => {
  it('accepts a valid multi-step payload', () => {
    expect(
      createDesignSystemSchema.parse({
        name: 'Core Product UI',
        description: 'Design system for the core product.',
        platforms: ['web', 'mobile'],
        defaultLocale: 'fr',
        supportedLocales: ['en', 'fr'],
        visualDirection: 'editorial',
        accessibilityTarget: 'wcag_aa',
      }),
    ).toEqual({
      name: 'Core Product UI',
      description: 'Design system for the core product.',
      platforms: ['web', 'mobile'],
      defaultLocale: 'fr',
      supportedLocales: ['en', 'fr'],
      visualDirection: 'editorial',
      accessibilityTarget: 'wcag_aa',
    });
  });

  it('normalizes an empty description to null', () => {
    expect(
      createDesignSystemSchema.parse({
        name: 'Core Product UI',
        description: '',
        platforms: ['web'],
        defaultLocale: 'en',
        supportedLocales: ['en'],
        visualDirection: 'minimal',
        accessibilityTarget: 'wcag_aa',
      }),
    ).toEqual({
      name: 'Core Product UI',
      description: null,
      platforms: ['web'],
      defaultLocale: 'en',
      supportedLocales: ['en'],
      visualDirection: 'minimal',
      accessibilityTarget: 'wcag_aa',
    });
  });

  it('rejects payload without target platform', () => {
    expect(
      createDesignSystemSchema.safeParse({
        name: 'Core Product UI',
        description: '',
        platforms: [],
        defaultLocale: 'en',
        supportedLocales: ['en'],
        visualDirection: 'minimal',
        accessibilityTarget: 'wcag_aa',
      }).success,
    ).toBe(false);
  });

  it('rejects unsupported locales', () => {
    expect(
      createDesignSystemSchema.safeParse({
        name: 'Core Product UI',
        description: '',
        platforms: ['web'],
        defaultLocale: 'es',
        supportedLocales: ['en'],
        visualDirection: 'minimal',
        accessibilityTarget: 'wcag_aa',
      }).success,
    ).toBe(false);
  });

  it('rejects unsupported visual directions', () => {
    expect(
      createDesignSystemSchema.safeParse({
        name: 'Core Product UI',
        description: '',
        platforms: ['web'],
        defaultLocale: 'en',
        supportedLocales: ['en'],
        visualDirection: 'cyberpunk',
        accessibilityTarget: 'wcag_aa',
      }).success,
    ).toBe(false);
  });

  it('rejects unsupported accessibility targets', () => {
    expect(
      createDesignSystemSchema.safeParse({
        name: 'Core Product UI',
        description: '',
        platforms: ['web'],
        defaultLocale: 'en',
        supportedLocales: ['en'],
        visualDirection: 'minimal',
        accessibilityTarget: 'none',
      }).success,
    ).toBe(false);
  });
});
