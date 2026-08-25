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
    status: 'next',
  },
  {
    key: 'designTokens',
    number: 2,
    slug: 'design-tokens',
    status: 'planned',
  },
  { key: 'themes', number: 3, slug: 'themes', status: 'planned' },
  { key: 'components', number: 4, slug: 'components', status: 'planned' },
  {
    key: 'accessibility',
    number: 5,
    slug: 'accessibility',
    status: 'planned',
  },
  {
    key: 'documentationDelivery',
    number: 6,
    slug: 'documentation-and-delivery',
    status: 'planned',
  },
  {
    key: 'aiReady',
    number: 7,
    slug: 'ai-ready-design-systems',
    status: 'planned',
  },
];

export function getLearnChapterHref(chapter: LearnChapter): string | null {
  return chapter.status === 'published' ? `/learn/${chapter.slug}` : null;
}
