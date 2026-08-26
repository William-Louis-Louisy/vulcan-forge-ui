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

  it('publishes chapters 01 through 05 while chapter 06 becomes the next lesson', () => {
    expect(learnChapters.map((chapter) => chapter.status)).toEqual([
      'published',
      'published',
      'published',
      'published',
      'published',
      'next',
      'planned',
    ]);
    expect(learnChapters.map(getLearnChapterHref)).toEqual([
      '/learn/design-systems',
      '/learn/design-tokens',
      '/learn/themes',
      '/learn/components',
      '/learn/accessibility',
      null,
      null,
    ]);
  });

  it('builds a chapter href only after a chapter becomes published', () => {
    const chapter = learnChapters[5];

    expect(chapter).toBeDefined();
    expect(getLearnChapterHref({ ...chapter!, status: 'published' })).toBe(
      '/learn/documentation-and-delivery',
    );
  });
});
