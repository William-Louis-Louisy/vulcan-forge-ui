import { auth } from '@/auth';
import {
  ColorValueSwatch,
  Notice,
  ProjectWorkspaceHeader,
} from '@/components/ui';
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
import { AccessibilityScoreExplanation } from '@/features/accessibility/AccessibilityScoreExplanation';
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
    defaultLocale: pageData.project.defaultLocale,
    supportedLocales: pageData.project.supportedLocales,
    tokenSets: pageData.tokenSets,
    componentContracts: pageData.componentContracts,
  });
  const labels = createAccessibilityCenterLabels(t);

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <AccessibilityIssuesWorkspace
        projectSlug={pageData.project.slug}
        issues={report.issues}
        header={
          <ProjectWorkspaceHeader
            variant="bar"
            title={t('workspaceTitle')}
            description={t('description')}
            projectName={pageData.project.name}
            actions={
              <SaveAccessibilityReportButton
                locale={locale}
                projectSlug={pageData.project.slug}
              />
            }
          />
        }
        beforeIssues={
          <div className="grid min-w-0 gap-4">
            <Notice
              tone="warning"
              title={t('auditNotice.title')}
              className="rounded-md py-3"
            >
              {t('auditNotice.description')}
            </Notice>

            <ValidationSummaryCard
              t={t}
              locale={locale}
              report={report}
              latestReport={pageData.latestAccessibilityReport}
            />
          </div>
        }
        labels={{
          title: t('issues.title'),
          detailTitle: t('issues.detailTitle'),
          count: t('issues.count', { count: report.issues.length }),
          emptyTitle: t('issues.emptyTitle'),
          emptyDescription: t('issues.emptyDescription'),
          automatic: t('issues.automatic'),
          recommendation: t('issues.recommendation'),
          columns: {
            severity: t('issues.columns.severity'),
            scope: t('issues.columns.scope'),
            rule: t('issues.columns.rule'),
            affected: t('issues.columns.affected'),
          },
          actions: {
            openTokens: t('issues.actions.openTokens'),
            openThemes: t('issues.actions.openThemes'),
            openComponents: t('issues.actions.openComponents'),
          },
          scopes: {
            themeContrast: t('issues.scopes.themeContrast'),
            tokenResolution: t('issues.scopes.tokenResolution'),
            tokenSet: t('issues.scopes.tokenSet'),
            theme: t('issues.scopes.theme'),
            tokenDocumentation: t('issues.scopes.tokenDocumentation'),
            componentContract: t('issues.scopes.componentContract'),
            componentBinding: t('issues.scopes.componentBinding'),
          },
          pairs: labels.pairs,
          issueCodes: labels.issueCodes,
          issueFixes: labels.issueFixes,
          severities: labels.severities,
          details: {
            tokenPath: t('issueDetails.tokenPath'),
            tokenSet: t('issueDetails.tokenSet'),
            component: t('issueDetails.component'),
            componentType: t('issueDetails.componentType'),
            affectedField: t('issueDetails.affectedField'),
            affectedCount: t('issueDetails.affectedCount'),
            missingLocales: t('issueDetails.missingLocales'),
            bindingKey: t('issueDetails.bindingKey'),
            expectedTokenType: t('issueDetails.expectedTokenType'),
            actualTokenType: t('issueDetails.actualTokenType'),
            foreground: t('issueDetails.foreground'),
            background: t('issueDetails.background'),
            foregroundValue: t('issueDetails.foregroundValue'),
            backgroundValue: t('issueDetails.backgroundValue'),
            ratio: t('issueDetails.ratio'),
            fields: {
              description: t('issueDetails.fields.description'),
              tokenSet: t('issueDetails.fields.tokenSet'),
              contract: t('issueDetails.fields.contract'),
              purpose: t('issueDetails.fields.purpose'),
              anatomy: t('issueDetails.fields.anatomy'),
              variants: t('issueDetails.fields.variants'),
              sizes: t('issueDetails.fields.sizes'),
              states: t('issueDetails.fields.states'),
              accessibility: t('issueDetails.fields.accessibility'),
              focusVisible: t('issueDetails.fields.focusVisible'),
              tokenBindings: t('issueDetails.fields.tokenBindings'),
            },
            ratioValue: (ratio, required) =>
              t('issueDetails.ratioValue', { ratio, required }),
          },
        }}
      >
        <ContrastPairsPanel t={t} report={report} labels={labels} />
      </AccessibilityIssuesWorkspace>
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
      infoOnBackground: t('pairs.infoOnBackground'),
      infoOnSurface: t('pairs.infoOnSurface'),
      successOnBackground: t('pairs.successOnBackground'),
      successOnSurface: t('pairs.successOnSurface'),
      warningOnBackground: t('pairs.warningOnBackground'),
      warningOnSurface: t('pairs.warningOnSurface'),
      dangerOnBackground: t('pairs.dangerOnBackground'),
      dangerOnSurface: t('pairs.dangerOnSurface'),
    },
    issueCodes: {
      missingForegroundColor: t('issues.codes.missingForegroundColor'),
      missingBackgroundColor: t('issues.codes.missingBackgroundColor'),
      contrastWarning: t('issues.codes.contrastWarning'),
      contrastFail: t('issues.codes.contrastFail'),
      tokenResolutionError: t('issues.codes.tokenResolutionError'),
      invalidColorTokenSet: t('issues.codes.invalidColorTokenSet'),
      missingThemes: t('issues.codes.missingThemes'),
      missingTokenDescription: t('issues.codes.missingTokenDescription'),
      invalidTokenSet: t('issues.codes.invalidTokenSet'),
      invalidComponentContract: t('issues.codes.invalidComponentContract'),
      missingComponentLocalization: t(
        'issues.codes.missingComponentLocalization',
      ),
      missingComponentAccessibilityRules: t(
        'issues.codes.missingComponentAccessibilityRules',
      ),
      missingComponentFocusVisibleState: t(
        'issues.codes.missingComponentFocusVisibleState',
      ),
      unresolvedComponentTokenBinding: t(
        'issues.codes.unresolvedComponentTokenBinding',
      ),
      componentTokenTypeMismatch: t('issues.codes.componentTokenTypeMismatch'),
    },
    issueFixes: {
      missingForegroundColor: t('issues.fixes.missingForegroundColor'),
      missingBackgroundColor: t('issues.fixes.missingBackgroundColor'),
      contrastWarning: t('issues.fixes.contrastWarning'),
      contrastFail: t('issues.fixes.contrastFail'),
      tokenResolutionError: t('issues.fixes.tokenResolutionError'),
      invalidColorTokenSet: t('issues.fixes.invalidColorTokenSet'),
      missingThemes: t('issues.fixes.missingThemes'),
      missingTokenDescription: t('issues.fixes.missingTokenDescription'),
      invalidTokenSet: t('issues.fixes.invalidTokenSet'),
      invalidComponentContract: t('issues.fixes.invalidComponentContract'),
      missingComponentLocalization: t(
        'issues.fixes.missingComponentLocalization',
      ),
      missingComponentAccessibilityRules: t(
        'issues.fixes.missingComponentAccessibilityRules',
      ),
      missingComponentFocusVisibleState: t(
        'issues.fixes.missingComponentFocusVisibleState',
      ),
      unresolvedComponentTokenBinding: t(
        'issues.fixes.unresolvedComponentTokenBinding',
      ),
      componentTokenTypeMismatch: t('issues.fixes.componentTokenTypeMismatch'),
    },
    severities: {
      warning: t('severity.warning'),
      critical: t('severity.critical'),
    },
  };
}

function ValidationSummaryCard({
  t,
  locale,
  report,
  latestReport,
}: {
  t: AccessibilityCenterTranslator;
  locale: Locale;
  report: AccessibilityCenterReport;
  latestReport: {
    id: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    issues: unknown;
    createdAt: Date;
  } | null;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
      <header className="border-border-subtle flex min-w-0 items-center justify-between gap-4 border-b px-4 py-2.5">
        <h2 className="text-sm font-semibold tracking-tight">
          {t('score.validationSummary')}
        </h2>
        <span
          className={[
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
            report.status === 'healthy'
              ? 'bg-action-success/10 text-action-success'
              : report.status === 'critical'
                ? 'bg-action-danger/10 text-action-danger'
                : 'bg-action-warning/10 text-action-warning',
          ].join(' ')}
        >
          {t(`score.status.${report.status}`)}
        </span>
      </header>

      <div className="grid min-w-0 gap-3 p-3 sm:p-4 md:grid-cols-[8.5rem_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
              {t('score.eyebrow')}
            </p>
            <AccessibilityScoreExplanation
              breakdown={report.scoreBreakdown}
              labels={{
                trigger: t('score.help.trigger'),
                title: t('score.help.title'),
                description: t('score.help.description'),
                formula: t('score.help.formula'),
                baseScore: t('score.help.baseScore'),
                criticalIssues: t('score.help.criticalIssues', {
                  count: report.scoreBreakdown.criticalIssues,
                }),
                warningIssues: t('score.help.warningIssues', {
                  count: report.scoreBreakdown.warningIssues,
                }),
                totalPenalty: t('score.help.totalPenalty'),
                currentScore: t('score.help.currentScore'),
                floorNotice: t('score.help.floorNotice', {
                  score: report.scoreBreakdown.rawScore,
                }),
                disclaimer: t('score.help.disclaimer'),
                close: t('score.help.close'),
              }}
            />
          </div>
          <div className="mt-1 flex items-end gap-1.5">
            <span className="text-4xl font-semibold tracking-tight">
              {report.score}
            </span>
            <span className="text-content-tertiary pb-1 text-sm">/100</span>
          </div>
          <p className="text-content-secondary mt-2 text-xs leading-5">
            {t('score.description')}
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4">
          <ValidationMetric
            label={t('score.automatedChecks')}
            value={String(report.issues.length)}
          />
          <ValidationMetric
            label={t('score.contrastChecks')}
            value={`${report.summary.passedPairs}/${report.summary.pairCount}`}
          />
          <ValidationMetric
            label={t('score.criticalIssues')}
            value={String(report.summary.criticalIssues)}
          />
          <ValidationMetric
            label={t('score.warningIssues')}
            value={String(report.summary.warningIssues)}
          />
        </div>
      </div>

      <div className="border-border-subtle grid min-w-0 gap-3 border-t px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{t('latestReport.title')}</p>
          <p className="text-content-tertiary mt-1 text-xs">
            {latestReport
              ? t('latestReport.description')
              : t('latestReport.empty')}
          </p>
        </div>

        {latestReport ? (
          <>
            <span className="text-content-secondary text-xs font-semibold">
              {latestReport.score}/100 ·{' '}
              {t(`latestReport.statuses.${latestReport.status}`)}
            </span>
            <span className="text-content-tertiary text-xs font-semibold">
              {latestReport.createdAt.toLocaleDateString(locale)}
            </span>
          </>
        ) : null}
      </div>
    </article>
  );
}

function ValidationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle bg-background-subtle min-w-0 rounded-md border p-2.5">
      <p className="text-content-tertiary truncate text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
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
              <th className="px-4 py-2 font-semibold">
                {t('pairs.foreground')}
              </th>
              <th className="px-4 py-2 font-semibold">
                {t('pairs.background')}
              </th>
              <th className="px-4 py-2 font-semibold">
                {t('issueDetails.ratio')}
              </th>
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
                <td className="px-4 py-3">
                  <ColorValueSwatch
                    label={t('pairs.foreground')}
                    value={pair.foregroundValue}
                  />
                </td>
                <td className="px-4 py-3">
                  <ColorValueSwatch
                    label={t('pairs.background')}
                    value={pair.backgroundValue}
                  />
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

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <ColorValueSwatch
          label={t('pairs.foreground')}
          value={pair.foregroundValue}
        />
        <ColorValueSwatch
          label={t('pairs.background')}
          value={pair.backgroundValue}
        />
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
