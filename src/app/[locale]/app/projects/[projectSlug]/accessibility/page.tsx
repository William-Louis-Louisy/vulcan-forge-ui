import { auth } from '@/auth';
import { Notice } from '@/components/ui';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import {
  createAccessibilityCenterReport,
  type AccessibilityCenterIssue,
  type AccessibilityCenterReport,
} from '@/features/accessibility/accessibility-center.utils';
import { AccessibilityIssuesWorkspace } from '@/features/accessibility/AccessibilityIssuesWorkspace';
import { SaveAccessibilityReportButton } from '@/features/accessibility/SaveAccessibilityReportButton';
import { getAccessibilityCenterPageData } from '@/features/accessibility/accessibility-center.queries';

type AccessibilityCenterPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

type AccessibilityCenterTranslator = Awaited<
  ReturnType<typeof getTranslations>
>;

type AccessibilityCenterLabels = {
  pairs: Record<NonNullable<AccessibilityCenterIssue['pairId']>, string>;
  issueCodes: Record<AccessibilityCenterIssue['code'], string>;
  issueFixes: Record<AccessibilityCenterIssue['code'], string>;
  severities: Record<AccessibilityCenterIssue['severity'], string>;
};

export default async function AccessibilityCenterPage({
  params,
}: AccessibilityCenterPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('AccessibilityCenterPage');
  const pageData = await getAccessibilityCenterPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const report = createAccessibilityCenterReport({
    colorTokenSetTokens: pageData.colorTokenSet?.tokens ?? [],
    themes: pageData.themes,
  });
  const labels = createAccessibilityCenterLabels(t);

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <header className="border-border-subtle bg-background-app shrink-0 border-b px-4 py-4 md:px-6 xl:px-7 xl:py-5">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
              {t('eyebrow')}
            </p>
            <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.015em]">
              {t('title', { projectName: pageData.project.name })}
            </h1>
            <p className="text-content-tertiary mt-1 max-w-3xl text-sm leading-6">
              {t('description')}
            </p>
          </div>

          <SaveAccessibilityReportButton
            locale={locale}
            projectSlug={pageData.project.slug}
          />
        </div>
      </header>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="grid min-w-0 gap-4 p-4 md:p-6 xl:p-7">
          <Notice
            tone="warning"
            title={t('auditNotice.title')}
            className="rounded-md py-3"
          >
            {t('auditNotice.description')}
          </Notice>

          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <ScoreCard t={t} report={report} />
            <LatestAccessibilityReportCard
              t={t}
              locale={locale}
              latestReport={pageData.latestAccessibilityReport}
            />
          </div>

          <AccessibilityIssuesWorkspace
            issues={report.issues}
            labels={{
              title: t('issues.title'),
              detailTitle: t('issues.detailTitle'),
              count: t('issues.count', { count: report.issues.length }),
              emptyTitle: t('issues.emptyTitle'),
              emptyDescription: t('issues.emptyDescription'),
              pairs: labels.pairs,
              issueCodes: labels.issueCodes,
              issueFixes: labels.issueFixes,
              severities: labels.severities,
              details: {
                tokenPath: t('issueDetails.tokenPath'),
                foreground: t('issueDetails.foreground'),
                background: t('issueDetails.background'),
                foregroundValue: t('issueDetails.foregroundValue'),
                backgroundValue: t('issueDetails.backgroundValue'),
                ratio: t('issueDetails.ratio'),
                ratioValue: (ratio, required) =>
                  t('issueDetails.ratioValue', { ratio, required }),
              },
            }}
          />

          <ContrastPairsPanel t={t} report={report} labels={labels} />
        </div>
      </main>
    </section>
  );
}

function createAccessibilityCenterLabels(
  t: AccessibilityCenterTranslator,
): AccessibilityCenterLabels {
  return {
    pairs: {
      contentOnBackground: t('pairs.contentOnBackground'),
      contentOnSurface: t('pairs.contentOnSurface'),
      mutedOnBackground: t('pairs.mutedOnBackground'),
      mutedOnSurface: t('pairs.mutedOnSurface'),
      accentOnBackground: t('pairs.accentOnBackground'),
      accentOnSurface: t('pairs.accentOnSurface'),
    },
    issueCodes: {
      missingForegroundColor: t('issues.codes.missingForegroundColor'),
      missingBackgroundColor: t('issues.codes.missingBackgroundColor'),
      contrastWarning: t('issues.codes.contrastWarning'),
      contrastFail: t('issues.codes.contrastFail'),
      tokenResolutionError: t('issues.codes.tokenResolutionError'),
      invalidColorTokenSet: t('issues.codes.invalidColorTokenSet'),
      missingThemes: t('issues.codes.missingThemes'),
    },
    issueFixes: {
      missingForegroundColor: t('issues.fixes.missingForegroundColor'),
      missingBackgroundColor: t('issues.fixes.missingBackgroundColor'),
      contrastWarning: t('issues.fixes.contrastWarning'),
      contrastFail: t('issues.fixes.contrastFail'),
      tokenResolutionError: t('issues.fixes.tokenResolutionError'),
      invalidColorTokenSet: t('issues.fixes.invalidColorTokenSet'),
      missingThemes: t('issues.fixes.missingThemes'),
    },
    severities: {
      warning: t('severity.warning'),
      critical: t('severity.critical'),
    },
  };
}

function ScoreCard({
  t,
  report,
}: {
  t: AccessibilityCenterTranslator;
  report: AccessibilityCenterReport;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary min-w-0 rounded-md border p-4 sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div>
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {t('score.eyebrow')}
          </p>
          <div className="mt-1 flex items-end gap-1.5">
            <span className="text-4xl font-semibold tracking-tight">
              {report.score}
            </span>
            <span className="text-content-tertiary pb-1 text-sm">/100</span>
          </div>
        </div>

        <span
          className={[
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            report.status === 'healthy'
              ? 'bg-action-success/10 text-action-success'
              : report.status === 'critical'
                ? 'bg-action-danger/10 text-action-danger'
                : 'bg-action-warning/10 text-action-warning',
          ].join(' ')}
        >
          {t(`score.status.${report.status}`)}
        </span>
      </div>

      <p className="text-content-secondary mt-3 text-xs leading-5">
        {t('score.description')}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        <ScoreMetric
          label={t('score.totalIssues')}
          value={String(report.issues.length)}
        />
        <ScoreMetric
          label={t('score.criticalIssues')}
          value={String(report.summary.criticalIssues)}
        />
        <ScoreMetric
          label={t('score.passedPairs')}
          value={String(report.summary.passedPairs)}
        />
        <ScoreMetric
          label={t('score.failedPairs')}
          value={String(report.summary.failedPairs)}
        />
      </div>
    </article>
  );
}

function ScoreMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle bg-background-subtle min-w-0 rounded-md border p-3">
      <p className="text-content-tertiary truncate text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function LatestAccessibilityReportCard({
  t,
  locale,
  latestReport,
}: {
  t: AccessibilityCenterTranslator;
  locale: Locale;
  latestReport: {
    id: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    issues: unknown;
    createdAt: Date;
  } | null;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary min-w-0 rounded-md border p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold tracking-tight">
          {t('latestReport.title')}
        </h2>
        {latestReport ? (
          <span className="text-content-tertiary text-xs font-semibold">
            {latestReport.createdAt.toLocaleDateString(locale)}
          </span>
        ) : null}
      </div>

      {latestReport ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <ReportMetric
            label={t('latestReport.score')}
            value={`${latestReport.score}/100`}
          />
          <ReportMetric
            label={t('latestReport.status')}
            value={t(`latestReport.statuses.${latestReport.status}`)}
          />
          <ReportMetric
            label={t('latestReport.savedAt')}
            value={latestReport.createdAt.toLocaleDateString(locale)}
          />
        </div>
      ) : (
        <p className="text-content-secondary mt-4 text-sm leading-6">
          {t('latestReport.empty')}
        </p>
      )}
    </article>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle bg-background-subtle min-w-0 rounded-md border p-3">
      <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

function ContrastPairsPanel({
  t,
  report,
  labels,
}: {
  t: AccessibilityCenterTranslator;
  report: AccessibilityCenterReport;
  labels: AccessibilityCenterLabels;
}) {
  return (
    <section className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
      <header className="border-border-subtle border-b px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">
          {t('pairs.title')}
        </h2>
        <p className="text-content-secondary mt-1 text-xs leading-5">
          {t('pairs.description')}
        </p>
      </header>

      <div className="grid gap-2 p-3 sm:hidden">
        {report.contrastPairs.map((pair) => (
          <ContrastPairSummary
            key={pair.id}
            t={t}
            pair={pair}
            label={labels.pairs[pair.pairId] ?? pair.pairId}
          />
        ))}
      </div>

      <div className="hidden min-w-0 overflow-x-auto sm:block">
        <table className="w-full min-w-[42rem] border-collapse text-left text-xs">
          <thead className="bg-background-subtle text-content-tertiary">
            <tr>
              <th className="px-4 py-2 font-semibold">{t('pairs.title')}</th>
              <th className="px-4 py-2 font-semibold">{t('pairs.foreground')}</th>
              <th className="px-4 py-2 font-semibold">{t('pairs.background')}</th>
              <th className="px-4 py-2 font-semibold">{t('issueDetails.ratio')}</th>
            </tr>
          </thead>
          <tbody>
            {report.contrastPairs.map((pair) => (
              <tr
                key={pair.id}
                className="border-border-subtle border-t first:border-t-0"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold">
                    {labels.pairs[pair.pairId] ?? pair.pairId}
                  </p>
                  <p className="text-content-tertiary mt-1">{pair.themeName}</p>
                </td>
                <td className="px-4 py-3 font-mono">
                  {pair.foregroundValue ?? '—'}
                </td>
                <td className="px-4 py-3 font-mono">
                  {pair.backgroundValue ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <PairStatus t={t} pair={pair} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContrastPairSummary({
  t,
  pair,
  label,
}: {
  t: AccessibilityCenterTranslator;
  pair: AccessibilityCenterReport['contrastPairs'][number];
  label: string;
}) {
  return (
    <article className="border-border-subtle bg-background-subtle rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{label}</h3>
          <p className="text-content-tertiary mt-1 text-xs">{pair.themeName}</p>
        </div>
        <PairStatus t={t} pair={pair} />
      </div>
    </article>
  );
}

function PairStatus({
  t,
  pair,
}: {
  t: AccessibilityCenterTranslator;
  pair: AccessibilityCenterReport['contrastPairs'][number];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={[
          'rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold',
          pair.status === 'pass'
            ? 'bg-action-success/10 text-action-success'
            : pair.status === 'fail'
              ? 'bg-action-danger/10 text-action-danger'
              : 'bg-action-warning/10 text-action-warning',
        ].join(' ')}
      >
        {t(`pairs.status.${pair.status}`)}
      </span>
      <span className="text-content-secondary font-mono text-xs font-semibold">
        {pair.ratio !== null ? `${pair.ratio.toFixed(2)}:1` : '—'}
      </span>
    </div>
  );
}
