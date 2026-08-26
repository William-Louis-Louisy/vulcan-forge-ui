import { describe, expect, it } from 'vitest';
import {
  getLearnChapterHref,
  learnChapterKeys,
  learnChapters,
} from './learn-curriculum';

describe('learn curriculum', () => {
  it('keeps the accepted seven-chapter order', () => {
    expect(learnChapterKeys).toEqual([
      'designSystems',
      'designTokens',
      'themes',
      'components',
      'accessibility',
      'documentationDelivery',
      'aiReady',
    ]);
    expect(learnChapters.map((chapter) => chapter.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it('publishes all seven accepted Learn chapters', () => {
    expect(learnChapters.map((chapter) => chapter.status)).toEqual([
      'published',
      'published',
      'published',
      'published',
      'published',
      'published',
      'published',
    ]);
    expect(learnChapters.map(getLearnChapterHref)).toEqual([
      '/learn/design-systems',
      '/learn/design-tokens',
      '/learn/themes',
      '/learn/components',
      '/learn/accessibility',
      '/learn/documentation-and-delivery',
      '/learn/ai-ready-design-systems',
    ]);
  });

  it('keeps every published chapter addressable through its accepted slug', () => {
    for (const chapter of learnChapters) {
      expect(getLearnChapterHref(chapter)).toBe(`/learn/${chapter.slug}`);
    }
  });
});
