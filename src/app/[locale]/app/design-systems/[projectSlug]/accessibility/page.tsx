import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { SaveAccessibilityReportButton } from '@/features/accessibility/SaveAccessibilityReportButton';
import { getAccessibilityCenterPageData } from '@/features/accessibility/accessibility-center.queries';
import {
  createAccessibilityCenterReport,
  type AccessibilityCenterIssue,
  type AccessibilityCenterReport,
} from '@/features/accessibility/accessibility-center.utils';

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

  const report = createAccessibilityCenterReport(
    pageData.colorTokenSet?.tokens ?? [],
  );

  const labels = createAccessibilityCenterLabels(t);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/design-systems"
          className="text-action-primary text-sm font-semibold"
        >
          {t('backToProjects')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/tokens?set=color`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openTokensEditor')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/themes`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openThemesEditor')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/components`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openComponentsRegistry')}
        </Link>
      </div>

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
      contentPrimaryOnAppBackground: t('pairs.contentPrimaryOnAppBackground'),
      contentSecondaryOnAppBackground: t(
        'pairs.contentSecondaryOnAppBackground',
      ),
      contentPrimaryOnPrimarySurface: t('pairs.contentPrimaryOnPrimarySurface'),
      contentSecondaryOnPrimarySurface: t(
        'pairs.contentSecondaryOnPrimarySurface',
      ),
      contentInverseOnPrimaryAction: t('pairs.contentInverseOnPrimaryAction'),
      dangerTextOnPrimarySurface: t('pairs.dangerTextOnPrimarySurface'),
    },
    issueCodes: {
      missingForegroundColor: t('issues.codes.missingForegroundColor'),
      missingBackgroundColor: t('issues.codes.missingBackgroundColor'),
      contrastWarning: t('issues.codes.contrastWarning'),
      contrastFail: t('issues.codes.contrastFail'),
      tokenResolutionError: t('issues.codes.tokenResolutionError'),
      invalidColorTokenSet: t('issues.codes.invalidColorTokenSet'),
    },
    issueFixes: {
      missingForegroundColor: t('issues.fixes.missingForegroundColor'),
      missingBackgroundColor: t('issues.fixes.missingBackgroundColor'),
      contrastWarning: t('issues.fixes.contrastWarning'),
      contrastFail: t('issues.fixes.contrastFail'),
      tokenResolutionError: t('issues.fixes.tokenResolutionError'),
      invalidColorTokenSet: t('issues.fixes.invalidColorTokenSet'),
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
          value={String(
            report.issues.filter((issue) => issue.severity === 'critical')
              .length,
          )}
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
          {report.issues.map((issue, index) => (
            <IssueCard
              key={`${issue.code}-${issue.pairId ?? issue.tokenPath ?? index}`}
              issue={issue}
              labels={labels}
            />
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
  issue,
  labels,
}: {
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

          {issue.tokenPath ? (
            <p className="text-content-secondary mt-1 font-mono text-xs break-words">
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
              <dt className="font-semibold">Foreground</dt>
              <dd className="font-mono break-words">
                {issue.foregroundTokenPath}
              </dd>
            </div>
          ) : null}

          {issue.backgroundTokenPath ? (
            <div>
              <dt className="font-semibold">Background</dt>
              <dd className="font-mono break-words">
                {issue.backgroundTokenPath}
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
            key={pair.pair.id}
            className="border-border-subtle bg-background-subtle rounded-2xl border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{labels.pairs[pair.pair.id]}</h3>
                <p className="text-content-tertiary mt-1 text-xs">
                  {pair.pair.foregroundTokenPath} /{' '}
                  {pair.pair.backgroundTokenPath}
                </p>
              </div>

              <span className="border-border-subtle rounded-full border px-3 py-1 text-xs font-semibold">
                {pair.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <ColorValue
                label={t('pairs.foreground')}
                value={pair.foreground}
              />
              <ColorValue
                label={t('pairs.background')}
                value={pair.background}
              />
            </div>

            <p className="text-content-secondary mt-4 text-sm">
              {pair.contrast?.ratio
                ? t('pairs.ratio', {
                    ratio: pair.contrast.ratio,
                    required: pair.contrast.requiredRatio,
                  })
                : t('pairs.noRatio')}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ColorValue({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-border-subtle rounded-xl border p-3">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </p>

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
