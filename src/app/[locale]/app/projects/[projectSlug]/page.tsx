import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { AppLink } from '@/components/navigation/AppLink';
import { Badge } from '@/components/ui';
import type { AppLocale } from '@/domain/i18n';
import type { ExportLogFormat } from '@/features/exports/export-center.utils';
import {
  createProjectOverviewViewModel,
  type ProjectOverviewActivity,
  type ProjectOverviewNextAction,
  type ProjectOverviewViewModel,
} from '@/features/project-overview/project-overview.utils';
import { getProjectOverviewPageData } from '@/features/project-overview/project-overview.queries';
import {
  PreviewPanel,
  type PreviewPanelLabels,
} from '@/features/themes/PreviewPanel';
import { createPreviewThemes } from '@/features/themes/preview-panel.utils';
import { routing, type Locale } from '@/i18n/routing';

type ProjectOverviewPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

type ProjectOverviewTranslator = Awaited<ReturnType<typeof getTranslations>>;
type ThemesEditorTranslator = Awaited<ReturnType<typeof getTranslations>>;

export default async function ProjectOverviewPage({
  params,
}: ProjectOverviewPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const [t, themesT, pageData] = await Promise.all([
    getTranslations('ProjectOverviewPage'),
    getTranslations('ThemesEditorPage'),
    getProjectOverviewPageData({
      userId: session.user.id,
      projectSlug,
    }),
  ]);

  if (!pageData) {
    notFound();
  }

  const overview = createProjectOverviewViewModel(pageData);
  const colorTokenSet = pageData.tokenSets.find(
    (tokenSet) => tokenSet.type === 'color',
  );
  const previewThemes = createPreviewThemes({
    themes: pageData.themes,
    colorTokenSetTokens: colorTokenSet?.tokens ?? [],
  });

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="min-w-0 xl:overflow-y-auto">
          <ProjectHeader t={t} overview={overview} />

          <div className="grid min-w-0 gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10 xl:py-6">
            <HealthSummary t={t} overview={overview} />
            <NextActions t={t} actions={overview.nextActions} />

            <div className="grid min-w-0 gap-4 2xl:grid-cols-2">
              <TokensCoverage t={t} overview={overview} />
              <ThemesCoverage t={t} overview={overview} />
              <ComponentsCoverage t={t} overview={overview} />
              <ExportsCoverage
                t={t}
                locale={locale}
                overview={overview}
              />
            </div>

            <RecentActivity
              t={t}
              locale={locale}
              activities={overview.recentActivity}
            />
          </div>
        </div>

        <aside className="border-border-subtle bg-background-sunken hidden min-h-0 overflow-y-auto border-l xl:block">
          <PreviewPanel
            variant="rail"
            themes={previewThemes}
            labels={createPreviewPanelLabels(themesT)}
          />
        </aside>
      </div>
    </section>
  );
}

function ProjectHeader({
  t,
  overview,
}: {
  t: ProjectOverviewTranslator;
  overview: ProjectOverviewViewModel;
}) {
  return (
    <header className="border-border-subtle border-b px-4 pt-6 pb-4 sm:px-6 lg:px-8 xl:px-10 xl:pt-8">
      <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
        {t('eyebrow')}
      </p>

      <div className="mt-1 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold tracking-[-0.015em]">
            {overview.project.name}
          </h1>
          <p className="text-content-secondary mt-1 max-w-3xl text-sm leading-6">
            {overview.project.description ?? t('project.noDescription')}
          </p>
        </div>

        <AppLink
          href={`/app/projects/${overview.project.slug}/documentation`}
          className="border-border-default bg-surface-primary text-content-primary hover:bg-background-subtle inline-flex min-h-9 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t('project.openDocumentation')}
          <ArrowRightIcon aria-hidden="true" className="ml-1.5" size={13} />
        </AppLink>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {overview.project.platforms.map((platform) => (
          <Badge key={platform} size="sm">
            {t(`project.platforms.${platform}`)}
          </Badge>
        ))}
        {overview.project.supportedLocales.map((supportedLocale) => (
          <Badge key={supportedLocale} size="sm">
            {supportedLocale.toUpperCase()}
          </Badge>
        ))}
        {overview.project.visualDirection ? (
          <Badge size="sm" variant="accent">
            {overview.project.visualDirection}
          </Badge>
        ) : null}
        <Badge size="sm" variant="success">
          {t(`project.accessibility.${overview.project.accessibilityTarget}`)}
        </Badge>
      </div>
    </header>
  );
}

function HealthSummary({
  t,
  overview,
}: {
  t: ProjectOverviewTranslator;
  overview: ProjectOverviewViewModel;
}) {
  const healthTone = getHealthTone(overview.health.status);
  const healthBorderClass = {
    healthy: 'border-action-success',
    needsAttention: 'border-action-warning',
    critical: 'border-action-danger',
  }[overview.health.status];

  const tokenDetail =
    overview.tokens.invalid > 0
      ? t('health.metrics.tokens.invalid', {
          count: overview.tokens.invalid,
        })
      : overview.tokens.missingDescriptions > 0
        ? t('health.metrics.tokens.missingDescriptions', {
            count: overview.tokens.missingDescriptions,
          })
        : t('health.metrics.tokens.ready');
  const contrastIssues =
    overview.themes.warningPairs +
    overview.themes.failedPairs +
    overview.themes.missingPairs;
  const contrastDetail =
    contrastIssues > 0
      ? t('health.metrics.contrasts.issues', { count: contrastIssues })
      : t('health.metrics.contrasts.ready');
  const componentDetail =
    overview.components.draft > 0
      ? t('health.metrics.components.draft', {
          count: overview.components.draft,
        })
      : overview.components.invalid > 0
        ? t('health.metrics.components.invalid', {
            count: overview.components.invalid,
          })
        : t('health.metrics.components.ready');
  const exportDetail =
    overview.exports.staleFormats.length > 0
      ? t('health.metrics.exports.stale', {
          count: overview.exports.staleFormats.length,
        })
      : t('health.metrics.exports.generated', {
          count: overview.exports.generatedFormats,
          total: overview.exports.availableFormats,
        });

  return (
    <article className="border-border-subtle bg-surface-primary min-w-0 rounded-md border p-4 shadow-sm sm:p-5">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:items-center">
        <div
          className={`mx-auto flex size-25 items-center justify-center rounded-full border-[6px] ${healthBorderClass}`}
          aria-label={t('health.scoreLabel', { score: overview.health.score })}
        >
          <div className="text-center">
            <span className="block text-3xl font-semibold tracking-tight">
              {overview.health.score}
            </span>
            <span className="text-content-tertiary text-xs">/100</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {t('health.eyebrow')}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {t(`health.status.${overview.health.status}`)}
            </h2>
            <Badge size="sm" variant={healthTone}>
              {t('health.issueCount', { count: overview.health.issueCount })}
            </Badge>
          </div>
          <p className="text-content-secondary mt-1 text-sm leading-6">
            {t(`health.description.${overview.health.status}`, {
              critical: overview.health.criticalIssues,
              warnings: overview.health.warningIssues,
            })}
          </p>

          <div className="mt-4 grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4">
            <HealthMetric
              label={t('health.metrics.tokens.label')}
              value={String(overview.tokens.total)}
              detail={tokenDetail}
              tone={overview.tokens.invalid > 0 ? 'danger' : 'default'}
            />
            <HealthMetric
              label={t('health.metrics.contrasts.label')}
              value={`${overview.themes.passedPairs}/${overview.themes.contrastPairs}`}
              detail={contrastDetail}
              tone={contrastIssues > 0 ? 'warning' : 'success'}
            />
            <HealthMetric
              label={t('health.metrics.components.label')}
              value={String(overview.components.total)}
              detail={componentDetail}
              tone={overview.components.invalid > 0 ? 'danger' : 'default'}
            />
            <HealthMetric
              label={t('health.metrics.exports.label')}
              value={String(overview.exports.availableFormats)}
              detail={exportDetail}
              tone={
                overview.exports.staleFormats.length > 0 ? 'warning' : 'default'
              }
            />
          </div>
        </div>
      </div>

      <p className="text-content-tertiary mt-4 border-t border-dashed pt-3 text-xs leading-5">
        {t('health.disclaimer')}
      </p>
    </article>
  );
}

function HealthMetric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: 'default' | 'success' | 'warning' | 'danger';
}) {
  const detailClass = {
    default: 'text-content-tertiary',
    success: 'text-action-success',
    warning: 'text-action-warning',
    danger: 'text-action-danger',
  }[tone];

  return (
    <div className="border-border-subtle bg-background-subtle min-w-0 rounded-md border px-3 py-2.5">
      <p className="text-content-tertiary truncate text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-0.5 truncate text-xs font-semibold ${detailClass}`}>
        {detail}
      </p>
    </div>
  );
}

function NextActions({
  t,
  actions,
}: {
  t: ProjectOverviewTranslator;
  actions: ProjectOverviewNextAction[];
}) {
  return (
    <section className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
      <header className="border-border-subtle border-b px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">
          {t('nextActions.title')}
        </h2>
        <p className="text-content-secondary mt-1 text-xs leading-5">
          {t('nextActions.description')}
        </p>
      </header>

      {actions.length > 0 ? (
        <ul className="divide-border-subtle divide-y">
          {actions.map((action, index) => (
            <li key={action.id}>
              <AppLink
                href={action.href}
                className="hover:bg-background-subtle flex min-h-12 min-w-0 items-center gap-3 px-4 py-3 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
              >
                <span
                  aria-hidden="true"
                  className={[
                    'size-2 shrink-0 rounded-full',
                    index === 0 && action.code === 'criticalIssues'
                      ? 'bg-action-danger'
                      : 'bg-action-warning',
                  ].join(' ')}
                />
                <span className="min-w-0 flex-1 text-sm font-medium">
                  {t(`nextActions.items.${action.code}`, {
                    count: action.count,
                  })}
                </span>
                <span className="text-content-tertiary shrink-0 text-xs font-semibold">
                  {t(`nextActions.destinations.${getActionDestination(action)}`)}
                </span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="text-content-tertiary shrink-0"
                  size={14}
                />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-start gap-3 px-4 py-4">
          <CheckCircleIcon
            aria-hidden="true"
            className="text-action-success mt-0.5 shrink-0"
            size={18}
            weight="fill"
          />
          <div>
            <p className="text-sm font-semibold">{t('nextActions.emptyTitle')}</p>
            <p className="text-content-secondary mt-1 text-xs leading-5">
              {t('nextActions.emptyDescription')}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function TokensCoverage({
  t,
  overview,
}: {
  t: ProjectOverviewTranslator;
  overview: ProjectOverviewViewModel;
}) {
  return (
    <OverviewCard
      title={t('tokens.title')}
      description={t('tokens.description')}
      href={`/app/projects/${overview.project.slug}/tokens?set=color`}
      actionLabel={t('tokens.open')}
    >
      {overview.tokens.sets.length > 0 ? (
        <div className="grid gap-3">
          {overview.tokens.sets.map((tokenSet) => {
            const completion =
              tokenSet.total > 0
                ? Math.round((tokenSet.ready / tokenSet.total) * 100)
                : 0;

            return (
              <div key={tokenSet.type} className="min-w-0">
                <div className="flex min-w-0 items-center justify-between gap-3 text-xs">
                  <span className="truncate font-semibold">
                    {t(`tokens.types.${tokenSet.type}`)}
                  </span>
                  <span className="text-content-tertiary shrink-0">
                    {t('tokens.coverage', {
                      ready: tokenSet.ready,
                      total: tokenSet.total,
                    })}
                  </span>
                </div>
                <div className="bg-background-subtle mt-1.5 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-action-success h-full rounded-full"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                {tokenSet.invalid > 0 || tokenSet.missingDescriptions > 0 ? (
                  <p className="text-action-warning mt-1 text-[0.6875rem] font-medium">
                    {t('tokens.issues', {
                      invalid: tokenSet.invalid,
                      missing: tokenSet.missingDescriptions,
                    })}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <CardEmptyState message={t('tokens.empty')} />
      )}
    </OverviewCard>
  );
}

function ThemesCoverage({
  t,
  overview,
}: {
  t: ProjectOverviewTranslator;
  overview: ProjectOverviewViewModel;
}) {
  const contrastIssues =
    overview.themes.warningPairs +
    overview.themes.failedPairs +
    overview.themes.missingPairs;

  return (
    <OverviewCard
      title={t('themes.title')}
      description={t('themes.description')}
      href={`/app/projects/${overview.project.slug}/themes`}
      actionLabel={t('themes.open')}
    >
      {overview.themes.total > 0 ? (
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            {(['light', 'dark'] as const).map((mode) => {
              const isAvailable = overview.themes.modes.includes(mode);

              return (
                <div
                  key={mode}
                  className={[
                    'border-border-subtle rounded-md border p-3',
                    isAvailable
                      ? 'bg-background-subtle'
                      : 'border-dashed opacity-60',
                  ].join(' ')}
                >
                  <p className="text-sm font-semibold">
                    {t(`themes.modes.${mode}`)}
                  </p>
                  <p className="text-content-tertiary mt-1 text-xs">
                    {isAvailable
                      ? t('themes.configured')
                      : t('themes.notConfigured')}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-border-subtle flex items-center justify-between gap-4 border-t pt-3">
            <div>
              <p className="text-xs font-semibold">{t('themes.contrasts')}</p>
              <p className="text-content-tertiary mt-1 text-xs">
                {t('themes.contrastSummary', {
                  passed: overview.themes.passedPairs,
                  total: overview.themes.contrastPairs,
                })}
              </p>
            </div>
            <Badge
              size="sm"
              variant={contrastIssues > 0 ? 'warning' : 'success'}
            >
              {contrastIssues > 0
                ? t('themes.issues', { count: contrastIssues })
                : t('themes.allPass')}
            </Badge>
          </div>
        </div>
      ) : (
        <CardEmptyState message={t('themes.empty')} />
      )}
    </OverviewCard>
  );
}

function ComponentsCoverage({
  t,
  overview,
}: {
  t: ProjectOverviewTranslator;
  overview: ProjectOverviewViewModel;
}) {
  return (
    <OverviewCard
      title={t('components.title')}
      description={t('components.description')}
      href={`/app/projects/${overview.project.slug}/components`}
      actionLabel={t('components.open')}
    >
      {overview.components.items.length > 0 ? (
        <div className="grid gap-2">
          {overview.components.items.slice(0, 5).map((component) => (
            <div
              key={component.id}
              className="border-border-subtle flex min-w-0 items-center justify-between gap-3 border-b pb-2 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{component.name}</p>
                <p className="text-content-tertiary mt-0.5 text-xs">
                  {t(`components.types.${component.type}`)}
                </p>
              </div>
              <Badge
                size="sm"
                variant={getComponentStatusVariant(component.status)}
              >
                {t(`components.status.${component.status}`)}
              </Badge>
            </div>
          ))}

          <p className="text-content-tertiary pt-1 text-xs">
            {t('components.summary', {
              ready: overview.components.ready,
              draft: overview.components.draft,
              invalid: overview.components.invalid,
            })}
          </p>
        </div>
      ) : (
        <CardEmptyState message={t('components.empty')} />
      )}
    </OverviewCard>
  );
}

function ExportsCoverage({
  t,
  locale,
  overview,
}: {
  t: ProjectOverviewTranslator;
  locale: Locale;
  overview: ProjectOverviewViewModel;
}) {
  return (
    <OverviewCard
      title={t('exports.title')}
      description={t('exports.description')}
      href={`/app/projects/${overview.project.slug}/exports`}
      actionLabel={t('exports.open')}
    >
      <div className="grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          <ExportMetric
            label={t('exports.available')}
            value={overview.exports.availableFormats}
          />
          <ExportMetric
            label={t('exports.generated')}
            value={overview.exports.generatedFormats}
          />
          <ExportMetric
            label={t('exports.stale')}
            value={overview.exports.staleFormats.length}
            tone={overview.exports.staleFormats.length > 0 ? 'warning' : 'default'}
          />
        </div>

        {overview.exports.latestSuccessfulExports.length > 0 ? (
          <ul className="grid gap-2">
            {overview.exports.latestSuccessfulExports
              .slice(0, 4)
              .map((exportItem) => (
                <li
                  key={exportItem.format}
                  className="border-border-subtle flex min-w-0 items-center justify-between gap-3 border-t pt-2 text-xs"
                >
                  <span className="truncate font-semibold">
                    {t(`exports.formats.${exportItem.format}`)}
                  </span>
                  <span className="text-content-tertiary shrink-0">
                    {formatRelativeTime(exportItem.createdAt, locale)}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <CardEmptyState message={t('exports.empty')} compact />
        )}
      </div>
    </OverviewCard>
  );
}

function ExportMetric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'warning';
}) {
  return (
    <div className="bg-background-subtle rounded-md px-3 py-2 text-center">
      <p
        className={[
          'text-lg font-semibold',
          tone === 'warning' ? 'text-action-warning' : 'text-content-primary',
        ].join(' ')}
      >
        {value}
      </p>
      <p className="text-content-tertiary mt-0.5 truncate text-[0.6875rem] font-medium">
        {label}
      </p>
    </div>
  );
}

function RecentActivity({
  t,
  locale,
  activities,
}: {
  t: ProjectOverviewTranslator;
  locale: Locale;
  activities: ProjectOverviewActivity[];
}) {
  return (
    <section className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
      <header className="border-border-subtle border-b px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">
          {t('activity.title')}
        </h2>
        <p className="text-content-secondary mt-1 text-xs leading-5">
          {t('activity.description')}
        </p>
      </header>

      {activities.length > 0 ? (
        <ul className="divide-border-subtle divide-y">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex min-w-0 items-start gap-3 px-4 py-3"
            >
              <ActivityIcon activity={activity} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {getActivityLabel(t, activity)}
                </p>
                <p className="text-content-tertiary mt-0.5 text-xs">
                  {formatRelativeTime(activity.occurredAt, locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <CardEmptyState message={t('activity.empty')} />
      )}
    </section>
  );
}

function ActivityIcon({ activity }: { activity: ProjectOverviewActivity }) {
  if (activity.type === 'export' && activity.status === 'failed') {
    return (
      <XCircleIcon
        aria-hidden="true"
        className="text-action-danger mt-0.5 shrink-0"
        size={17}
        weight="fill"
      />
    );
  }

  if (
    activity.type === 'accessibilityReport' &&
    activity.status !== 'pass'
  ) {
    return (
      <WarningCircleIcon
        aria-hidden="true"
        className="text-action-warning mt-0.5 shrink-0"
        size={17}
        weight="fill"
      />
    );
  }

  return (
    <ClockCounterClockwiseIcon
      aria-hidden="true"
      className="text-content-tertiary mt-0.5 shrink-0"
      size={17}
    />
  );
}

function OverviewCard({
  title,
  description,
  href,
  actionLabel,
  children,
}: {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
      <header className="border-border-subtle flex min-w-0 items-start justify-between gap-4 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {description}
          </p>
        </div>
        <AppLink
          href={href}
          className="text-action-primary hover:text-action-primary/80 inline-flex shrink-0 items-center text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {actionLabel}
          <ArrowRightIcon aria-hidden="true" className="ml-1" size={12} />
        </AppLink>
      </header>
      <div className="min-w-0 p-4">{children}</div>
    </section>
  );
}

function CardEmptyState({
  message,
  compact = false,
}: {
  message: string;
  compact?: boolean;
}) {
  return (
    <p
      className={[
        'border-border-subtle text-content-tertiary rounded-md border border-dashed text-center text-xs leading-5',
        compact ? 'px-3 py-3' : 'px-4 py-6',
      ].join(' ')}
    >
      {message}
    </p>
  );
}

function getActionDestination(
  action: ProjectOverviewNextAction,
): 'accessibility' | 'tokens' | 'themes' | 'components' | 'exports' {
  switch (action.code) {
    case 'criticalIssues':
      return 'accessibility';
    case 'invalidTokens':
    case 'missingTokenDescriptions':
      return 'tokens';
    case 'contrastIssues':
    case 'missingThemes':
      return 'themes';
    case 'draftComponents':
    case 'missingComponents':
      return 'components';
    case 'staleExports':
    case 'missingExports':
      return 'exports';
  }
}

function getHealthTone(
  status: ProjectOverviewViewModel['health']['status'],
): 'success' | 'warning' | 'danger' {
  if (status === 'healthy') {
    return 'success';
  }

  return status === 'critical' ? 'danger' : 'warning';
}

function getComponentStatusVariant(
  status: ProjectOverviewViewModel['components']['items'][number]['status'],
): 'success' | 'warning' | 'default' {
  if (status === 'ready') {
    return 'success';
  }

  return status === 'draft' ? 'warning' : 'default';
}

function getActivityLabel(
  t: ProjectOverviewTranslator,
  activity: ProjectOverviewActivity,
): string {
  switch (activity.type) {
    case 'tokenSet':
      return t('activity.items.tokenSet', {
        name: activity.subject,
      });
    case 'theme':
      return t('activity.items.theme', { name: activity.subject });
    case 'component':
      return t('activity.items.component', { name: activity.subject });
    case 'accessibilityReport':
      return t('activity.items.accessibilityReport', {
        score: activity.score,
        status: t(`activity.status.${activity.status}`),
      });
    case 'export':
      return t('activity.items.export', {
        format: t(`exports.formats.${activity.format}`),
        status: t(`activity.status.${activity.status}`),
        locale: activity.locale?.toUpperCase() ?? t('activity.localeNeutral'),
      });
  }
}

function formatRelativeTime(value: string, locale: Locale): string {
  const date = new Date(value);
  const elapsedSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(elapsedSeconds);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (absoluteSeconds < 60) {
    return formatter.format(elapsedSeconds, 'second');
  }

  const elapsedMinutes = Math.round(elapsedSeconds / 60);

  if (Math.abs(elapsedMinutes) < 60) {
    return formatter.format(elapsedMinutes, 'minute');
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);

  if (Math.abs(elapsedHours) < 24) {
    return formatter.format(elapsedHours, 'hour');
  }

  const elapsedDays = Math.round(elapsedHours / 24);

  if (Math.abs(elapsedDays) < 7) {
    return formatter.format(elapsedDays, 'day');
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function createPreviewPanelLabels(
  t: ThemesEditorTranslator,
): PreviewPanelLabels {
  return {
    title: t('preview.title'),
    description: t('preview.description'),
    modeLabel: t('preview.modeLabel'),
    modes: {
      light: t('themes.light'),
      dark: t('themes.dark'),
    },
    empty: t('preview.empty'),
    components: {
      button: t('preview.components.button'),
      textField: t('preview.components.textField'),
      card: t('preview.components.card'),
      alert: t('preview.components.alert'),
    },
    button: {
      primary: t('preview.button.primary'),
      secondary: t('preview.button.secondary'),
    },
    textField: {
      label: t('preview.textField.label'),
      placeholder: t('preview.textField.placeholder'),
      helper: t('preview.textField.helper'),
    },
    card: {
      title: t('preview.card.title'),
      description: t('preview.card.description'),
      cta: t('preview.card.cta'),
    },
    alert: {
      title: t('preview.alert.title'),
      description: t('preview.alert.description'),
    },
  };
}
