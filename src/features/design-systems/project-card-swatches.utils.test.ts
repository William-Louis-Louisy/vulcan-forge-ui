import { describe, expect, it } from 'vitest';

import { createProjectCardSwatches } from './project-card-swatches.utils';

describe('createProjectCardSwatches', () => {
  it('returns fallback swatches when no token sets are provided', () => {
    expect(createProjectCardSwatches([])).toEqual([
      '#ffffff',
      '#070707',
      '#FF8731',
      '#586644',
    ]);
  });

  it('extracts direct project swatches from real token paths', () => {
    expect(
      createProjectCardSwatches([
        {
          tokens: [
            { path: 'color.primitive.neutral.0', value: '#ffffff' },
            { path: 'color.primitive.neutral.950', value: '#070707' },
            { path: 'color.primitive.accent.primary', value: '#FF8731' },
            { path: 'color.primitive.accent.secondary', value: '#586644' },
          ],
        },
      ]),
    ).toEqual(['#070707', '#ffffff', '#FF8731', '#586644']);
  });

  it('resolves semantic token references from real token paths', () => {
    expect(
      createProjectCardSwatches([
        {
          tokens: [
            { path: 'color.primitive.neutral.0', value: '#ffffff' },
            { path: 'color.primitive.neutral.950', value: '#070707' },
            { path: 'color.primitive.accent.primary', value: '#FF8731' },
            { path: 'color.primitive.accent.secondary', value: '#586644' },
            {
              path: 'color.semantic.background.app',
              value: '{color.primitive.neutral.950}',
              reference: '{color.primitive.neutral.950}',
            },
            {
              path: 'color.semantic.action.primary',
              value: '{color.primitive.accent.primary}',
              reference: '{color.primitive.accent.primary}',
            },
          ],
        },
      ]),
    ).toEqual(['#070707', '#ffffff', '#FF8731', '#586644']);
  });

  it('resolves token references stored as bracket strings', () => {
    expect(
      createProjectCardSwatches([
        {
          tokens: [
            { path: 'color.stone.50', value: '#FAF8F3' },
            { path: 'color.bg.app', value: '{color.stone.50}' },
          ],
        },
      ])[0],
    ).toBe('#FAF8F3');
  });
});
