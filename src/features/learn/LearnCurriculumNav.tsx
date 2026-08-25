import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  getLearnChapterHref,
  learnChapters,
  type LearnChapter,
} from './learn-curriculum';

type LearnCurriculumNavProps = {
  variant?: 'cards' | 'compact';
};

export function LearnCurriculumNav({
  variant = 'cards',
}: LearnCurriculumNavProps) {
  const t = useTranslations('LearnPage.curriculum');

  if (variant === 'compact') {
    return (
      <nav aria-label={t('navigationLabel')}>
        <ol className="border-border-subtle divide-border-subtle divide-y border-y">
          {learnChapters.map((chapter) => (
            <li key={chapter.key}>
              <CompactChapterRow chapter={chapter} />
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label={t('navigationLabel')}>
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {learnChapters.map((chapter) => (
          <li key={chapter.key} className="min-w-0">
            <ChapterCard chapter={chapter} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ChapterCard({ chapter }: { chapter: LearnChapter }) {
  const t = useTranslations('LearnPage.curriculum');
  const href = getLearnChapterHref(chapter);
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="text-action-accent font-mono text-xs font-semibold tracking-[0.12em] uppercase">
          {t('chapterLabel', {
            number: String(chapter.number).padStart(2, '0'),
          })}
        </p>
        <ChapterStatus chapter={chapter} />
      </div>

      <h3 className="mt-8 text-xl font-semibold tracking-tight">
        {t(`chapters.${chapter.key}.title`)}
      </h3>
      <p className="text-content-secondary mt-3 text-sm leading-6">
        {t(`chapters.${chapter.key}.description`)}
      </p>

      {href ? (
        <div className="text-content-primary mt-8 flex items-center gap-2 text-sm font-semibold">
          <span>{t('statuses.published')}</span>
          <ArrowRightIcon aria-hidden="true" size={15} weight="bold" />
        </div>
      ) : null}
    </>
  );

  const className =
    'border-border-subtle bg-surface-primary block h-full min-h-64 border p-5 sm:p-6';

  return href ? (
    <Link
      href={href}
      className={`${className} hover:border-border-strong hover:bg-surface-secondary focus-visible:outline-border-focus transition focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

function CompactChapterRow({ chapter }: { chapter: LearnChapter }) {
  const t = useTranslations('LearnPage.curriculum');
  const href = getLearnChapterHref(chapter);
  const rowContent = (
    <>
      <span className="text-content-tertiary w-8 shrink-0 font-mono text-xs">
        {String(chapter.number).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {t(`chapters.${chapter.key}.title`)}
      </span>
      <ChapterStatus chapter={chapter} />
      {href ? (
        <ArrowRightIcon aria-hidden="true" className="shrink-0" size={14} />
      ) : null}
    </>
  );
  const className = 'flex min-h-12 items-center gap-3 px-3 py-2.5';

  return href ? (
    <Link
      href={href}
      className={`${className} hover:bg-surface-secondary focus-visible:outline-border-focus transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]`}
    >
      {rowContent}
    </Link>
  ) : (
    <div className={className}>{rowContent}</div>
  );
}

function ChapterStatus({ chapter }: { chapter: LearnChapter }) {
  const t = useTranslations('LearnPage.curriculum');
  const className =
    chapter.status === 'published'
      ? 'border-action-success/30 bg-action-success/10 text-action-success'
      : chapter.status === 'next'
        ? 'border-action-accent/30 bg-action-accent/10 text-action-accent'
        : 'border-border-subtle bg-background-sunken text-content-tertiary';

  return (
    <span
      className={`${className} shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase`}
    >
      {t(`statuses.${chapter.status}`)}
    </span>
  );
}
