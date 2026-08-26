export const learnChapterKeys = [
  'designSystems',
  'designTokens',
  'themes',
  'components',
  'accessibility',
  'documentationDelivery',
  'aiReady',
] as const;

export type LearnChapterKey = (typeof learnChapterKeys)[number];
export type LearnChapterStatus = 'next' | 'planned' | 'published';

export type LearnChapter = {
  key: LearnChapterKey;
  number: number;
  slug: string;
  status: LearnChapterStatus;
};

export const learnChapters: readonly LearnChapter[] = [
  {
    key: 'designSystems',
    number: 1,
    slug: 'design-systems',
    status: 'published',
  },
  {
    key: 'designTokens',
    number: 2,
    slug: 'design-tokens',
    status: 'published',
  },
  { key: 'themes', number: 3, slug: 'themes', status: 'published' },
  { key: 'components', number: 4, slug: 'components', status: 'published' },
  {
    key: 'accessibility',
    number: 5,
    slug: 'accessibility',
    status: 'published',
  },
  {
    key: 'documentationDelivery',
    number: 6,
    slug: 'documentation-and-delivery',
    status: 'published',
  },
  {
    key: 'aiReady',
    number: 7,
    slug: 'ai-ready-design-systems',
    status: 'next',
  },
];

export function getLearnChapterHref(chapter: LearnChapter): string | null {
  return chapter.status === 'published' ? `/learn/${chapter.slug}` : null;
}
