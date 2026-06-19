import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import {
  createAccessibilityCenterReport,
  type AccessibilityCenterIssue,
  type AccessibilityCenterReport,
} from '@/features/accessibility/accessibility-center.utils';
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
    <section className="mx-auto max-w-7xl">
      <div className="mt-8">
        <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {t('title', { projectName: pageData.project.name })}
        </h1>

        <p className="text-content-secondary mt-4 max-w-3xl">
          {t('description')}
        </p>
      </div>

      <div className="border-action-warning/30 bg-action-warning/10 text-content-secondary shadow-soft mt-8 rounded-3xl border p-5 text-sm leading-6">
        <strong className="text-content-primary">
          {t('auditNotice.title')}
        </strong>{' '}
        {t('auditNotice.description')}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SaveAccessibilityReportButton
          locale={locale}
          projectSlug={pageData.project.slug}
        />

        <LatestAccessibilityReportCard
          t={t}
          latestReport={pageData.latestAccessibilityReport}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <ScoreCard t={t} report={report} />
        <IssuesPanel t={t} report={report} labels={labels} />
      </div>

      <ContrastPairsPanel t={t} report={report} labels={labels} />
    </section>
  );
}

function createAccessibilityCenterLabels(
  t: AccessibilityCenterTranslator,
): AccessibilityCenterLabels {
  return {
    pairs: {
      contentOnBackground: t('pairs.contentOnBackground'),
      mutedOnBackground: t('pairs.mutedOnBackground'),
      contentOnSurface: t('pairs.contentOnSurface'),
      accentOnBackground: t('pairs.accentOnBackground'),
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
    <article className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
        {t('score.eyebrow')}
      </p>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-6xl font-semibold tracking-tight">
          {report.score}
        </span>
        <span className="text-content-secondary pb-2">/100</span>
      </div>

      <p className="mt-4 text-lg font-semibold">
        {t(`score.status.${report.status}`)}
      </p>

      <p className="text-content-secondary mt-3 text-sm leading-6">
        {t('score.description')}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
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
    <div className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function IssuesPanel({
  t,
  report,
  labels,
}: {
  t: AccessibilityCenterTranslator;
  report: AccessibilityCenterReport;
  labels: AccessibilityCenterLabels;
}) {
  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            {t('issues.eyebrow')}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {t('issues.title')}
          </h2>
        </div>

        <p className="text-content-secondary text-sm">
          {t('issues.count', { count: report.issues.length })}
        </p>
      </div>

      {report.issues.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {report.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} labels={labels} t={t} />
          ))}
        </div>
      ) : (
        <div className="border-border-default mt-6 rounded-2xl border border-dashed p-8 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            {t('issues.emptyTitle')}
          </h3>
          <p className="text-content-secondary mx-auto mt-3 max-w-xl text-sm leading-6">
            {t('issues.emptyDescription')}
          </p>
        </div>
      )}
    </section>
  );
}

function IssueCard({
  t,
  issue,
  labels,
}: {
  t: AccessibilityCenterTranslator;
  issue: AccessibilityCenterIssue;
  labels: AccessibilityCenterLabels;
}) {
  const pairLabel = issue.pairId ? labels.pairs[issue.pairId] : null;

  return (
    <article className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {labels.issueCodes[issue.code]}
          </p>

          {pairLabel ? (
            <p className="text-content-secondary mt-1 text-sm">{pairLabel}</p>
          ) : null}

          {issue.themeName ? (
            <p className="text-content-tertiary mt-1 text-xs font-semibold tracking-[0.18em] uppercase">
              {issue.themeName}
            </p>
          ) : null}

          {issue.tokenPath ? (
            <p className="text-content-secondary wrap-break-words mt-1 font-mono text-xs">
              {issue.tokenPath}
            </p>
          ) : null}
        </div>

        <span
          className={[
            'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
            issue.severity === 'critical'
              ? 'border-action-danger/30 bg-action-danger/10 text-action-danger'
              : 'border-action-warning/30 bg-action-warning/10 text-action-warning',
          ].join(' ')}
        >
          {labels.severities[issue.severity]}
        </span>
      </div>

      <p className="text-content-secondary mt-4 text-sm leading-6">
        {labels.issueFixes[issue.code]}
      </p>

      {issue.foregroundTokenPath || issue.backgroundTokenPath ? (
        <dl className="text-content-tertiary mt-4 grid gap-2 text-xs">
          {issue.foregroundTokenPath ? (
            <div>
              <dt className="font-semibold">{t('issueDetails.foreground')}</dt>
              <dd className="wrap-break-words font-mono">
                {issue.foregroundTokenPath}
              </dd>
            </div>
          ) : null}

          {issue.backgroundTokenPath ? (
            <div>
              <dt className="font-semibold">{t('issueDetails.background')}</dt>
              <dd className="wrap-break-words font-mono">
                {issue.backgroundTokenPath}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {issue.foregroundValue || issue.backgroundValue ? (
        <dl className="text-content-tertiary mt-4 grid gap-2 text-xs">
          {issue.foregroundValue ? (
            <div>
              <dt className="font-semibold">
                {t('issueDetails.foregroundValue')}
              </dt>
              <dd className="wrap-break-words font-mono">
                {issue.foregroundValue}
              </dd>
            </div>
          ) : null}

          {issue.backgroundValue ? (
            <div>
              <dt className="font-semibold">
                {t('issueDetails.backgroundValue')}
              </dt>
              <dd className="wrap-break-words font-mono">
                {issue.backgroundValue}
              </dd>
            </div>
          ) : null}

          {issue.ratio !== null && issue.requiredRatio !== null ? (
            <div>
              <dt className="font-semibold">{t('issueDetails.ratio')}</dt>
              <dd className="wrap-break-words font-mono">
                {t('issueDetails.ratioValue', {
                  ratio: issue.ratio.toFixed(2),
                  required: issue.requiredRatio.toFixed(1),
                })}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </article>
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
    <section className="border-border-subtle bg-surface-primary shadow-soft mt-8 rounded-3xl border p-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t('pairs.title')}
      </h2>

      <p className="text-content-secondary mt-3 max-w-3xl text-sm leading-6">
        {t('pairs.description')}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {report.contrastPairs.map((pair) => (
          <article
            key={pair.id}
            className="border-border-subtle bg-background-subtle rounded-2xl border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
                  {pair.themeName}
                </p>

                <h3 className="mt-1 font-semibold">
                  {labels.pairs[pair.pairId]}
                </h3>

                <p className="text-content-tertiary mt-1 text-xs">
                  {pair.foregroundRole} / {pair.backgroundRole}
                </p>
              </div>

              <span className="border-border-subtle rounded-full border px-3 py-1 text-xs font-semibold">
                {t(`pairs.status.${pair.status}`)}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <ColorValue
                label={t('pairs.foreground')}
                value={pair.foregroundValue}
                tokenPath={pair.foregroundTokenPath}
              />

              <ColorValue
                label={t('pairs.background')}
                value={pair.backgroundValue}
                tokenPath={pair.backgroundTokenPath}
              />
            </div>

            <p className="text-content-secondary mt-4 text-sm">
              {pair.ratio !== null && pair.requiredRatio !== null
                ? t('pairs.ratio', {
                    ratio: pair.ratio.toFixed(2),
                    required: pair.requiredRatio.toFixed(1),
                  })
                : t('pairs.noRatio')}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ColorValue({
  label,
  value,
  tokenPath,
}: {
  label: string;
  value: string | null;
  tokenPath?: string | null;
}) {
  return (
    <div className="border-border-subtle rounded-xl border p-3">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </p>

      {tokenPath ? (
        <p className="text-content-tertiary mt-2 font-mono text-xs break-all">
          {tokenPath}
        </p>
      ) : null}

      <div className="mt-2 flex items-center gap-2">
        {value ? (
          <span
            role="img"
            aria-label={`${label}: ${value}`}
            className="border-border-subtle size-5 rounded-full border"
            style={{ backgroundColor: value }}
          />
        ) : null}

        <span className="text-content-secondary font-mono text-xs break-all">
          {value ?? '—'}
        </span>
      </div>
    </div>
  );
}

function LatestAccessibilityReportCard({
  t,
  latestReport,
}: {
  t: AccessibilityCenterTranslator;
  latestReport: {
    id: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    issues: unknown;
    createdAt: Date;
  } | null;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5">
      <h2 className="text-xl font-semibold tracking-tight">
        {t('latestReport.title')}
      </h2>

      {latestReport ? (
        <div className="mt-4 grid gap-3">
          <p className="text-content-secondary text-sm">
            {t('latestReport.description')}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="border-border-subtle bg-background-subtle rounded-2xl border p-3">
              <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
                {t('latestReport.score')}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {latestReport.score}
              </p>
            </div>

            <div className="border-border-subtle bg-background-subtle rounded-2xl border p-3">
              <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
                {t('latestReport.status')}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {t(`latestReport.statuses.${latestReport.status}`)}
              </p>
            </div>

            <div className="border-border-subtle bg-background-subtle rounded-2xl border p-3">
              <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
                {t('latestReport.savedAt')}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {latestReport.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-content-secondary mt-4 text-sm leading-6">
          {t('latestReport.empty')}
        </p>
      )}
    </article>
  );
}
