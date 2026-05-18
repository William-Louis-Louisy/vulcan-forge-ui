import { describe, expect, it } from 'vitest';
import { createDesignSystemSlug } from './design-system-slug';

describe('createDesignSystemSlug', () => {
  it('creates a lowercase URL-safe slug', () => {
    expect(createDesignSystemSlug('My Design System')).toBe('my-design-system');
  });

  it('removes accents and apostrophes', () => {
    expect(createDesignSystemSlug('Système d’interface')).toBe(
      'systeme-dinterface',
    );
  });

  it('returns a fallback slug when the name cannot produce one', () => {
    expect(createDesignSystemSlug('---')).toBe('design-system');
  });
});
