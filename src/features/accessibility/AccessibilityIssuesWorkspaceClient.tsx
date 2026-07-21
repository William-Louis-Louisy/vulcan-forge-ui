'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { AppLink } from '@/components/navigation/AppLink';
import { ColorValueSwatch, EmptyState } from '@/components/ui';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';

const issueDetailControlIds =
  'accessibility-issue-detail accessibility-issue-detail-rail';

export type AccessibilityIssuesClientLabels = {
  title: string;
  detailTitle: string;
  count: string;
  emptyTitle: string;
  emptyDescription: string;
  automatic: string;
  recommendation: string;
  columns: {
    severity: string;
    scope: string;
    rule: string;
    affected: string;
  };
  actions: {
    openTokens: string;
    openThemes: string;
    openComponents: string;
  };
  scopes: Record<AccessibilityCenterIssue['scope'], string>;
  pairs: Record<NonNullable<AccessibilityCenterIssue['pairId']>, string>;
  issueCodes: Record<AccessibilityCenterIssue['code'], string>;
  issueFixes: Record<AccessibilityCenterIssue['code'], string>;
  severities: Record<AccessibilityCenterIssue['severity'], string>;
  details: {
    tokenPath: string;
    tokenSet: string;
    component: string;
    componentType: string;
    affectedField: string;
    affectedCount: string;
    missingLocales: string;
    bindingKey: string;
    expectedTokenType: string;
    actualTokenType: string;
    foreground: string;
    background: string;
    foregroundValue: string;
    backgroundValue: string;
    ratio: string;
    fields: Record<
      NonNullable<AccessibilityCenterIssue['affectedField']>,
      string
    >;
  };
};

type AccessibilityIssuesWorkspaceClientProps = {
  projectSlug: string;
  issues: AccessibilityCenterIssue[];
  ratioLabels: Record<string, string>;
  labels: AccessibilityIssuesClientLabels;
  header?: ReactNode;
  beforeIssues?: ReactNode;
  children?: ReactNode;
};

type IssueDetailVariant = 'compact' | 'rail';

function getAffectedLabel(
  issue: AccessibilityCenterIssue,
  labels: AccessibilityIssuesClientLabels,
) {
  const pairLabel = issue.pairId ? labels.pairs[issue.pairId] : null;

  if (issue.componentName && issue.bindingKey) {
    return `${issue.componentName} · ${issue.bindingKey}`;
  }

  return (
    issue.tokenPath ??
    issue.componentName ??
    issue.tokenSetName ??
    issue.foregroundTokenPath ??
    issue.backgroundTokenPath ??
    pairLabel ??
    issue.themeName ??
    '—'
  );
}

export function AccessibilityIssuesWorkspaceClient({
  projectSlug,
  issues,
  ratioLabels,
  labels,
  header,
  beforeIssues,
  children,
}: AccessibilityIssuesWorkspaceClientProps) {
  const [selectedIssueId, setSelectedIssueId] = useState(issues[0]?.id ?? null);
  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? issues[0] ?? null;

  return (
    <div
      data-accessibility-layout-slot="workspace"
      className={[
        'flex min-h-0 min-w-0 flex-1 flex-col',
        'xl:grid xl:h-full xl:overflow-hidden',
        selectedIssue ? 'xl:grid-cols-[minmax(0,1fr)_23rem]' : 'xl:grid-cols-1',
      ].join(' ')}
    >
      <section
        data-accessibility-layout-slot="main"
        className="flex min-h-0 min-w-0 flex-col xl:overflow-hidden"
      >
        {header ? (
          <div data-accessibility-layout-slot="header" className="shrink-0">
            {header}
          </div>
        ) : null}

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="grid min-w-0 gap-4 p-4 md:p-6 xl:p-7">
            {beforeIssues ? (
              <div
                data-accessibility-layout-slot="before-issues"
                className="min-w-0"
              >
                {beforeIssues}
              </div>
            ) : null}

            <div
              data-accessibility-layout-slot="issues"
              className="order-1 min-w-0"
            >
              <IssuesPanel
                issues={issues}
                selectedIssue={selectedIssue}
                labels={labels}
                onSelectIssue={setSelectedIssueId}
              />
            </div>

            {selectedIssue ? (
              <div
                data-accessibility-layout-slot="detail-compact"
                className="order-2 min-w-0 xl:hidden"
              >
                <IssueDetail
                  id="accessibility-issue-detail"
                  variant="compact"
                  projectSlug={projectSlug}
                  issue={selectedIssue}
                  ratioLabel={ratioLabels[selectedIssue.id] ?? null}
                  labels={labels}
                />
              </div>
            ) : null}

            {children ? (
              <div
                data-accessibility-layout-slot="secondary"
                className="order-3 min-w-0"
              >
                {children}
              </div>
            ) : null}
          </div>
        </main>
      </section>

      {selectedIssue ? (
        <IssueDetail
          id="accessibility-issue-detail-rail"
          variant="rail"
          projectSlug={projectSlug}
          issue={selectedIssue}
          ratioLabel={ratioLabels[selectedIssue.id] ?? null}
          labels={labels}
        />
      ) : null}
    </div>
  );
}

function IssuesPanel({
  issues,
  selectedIssue,
  labels,
  onSelectIssue,
}: {
  issues: AccessibilityCenterIssue[];
  selectedIssue: AccessibilityCenterIssue | null;
  labels: AccessibilityIssuesClientLabels;
  onSelectIssue: (issueId: string) => void;
}) {
  if (issues.length === 0) {
    return (
      <section className="border-border-subtle bg-surface-primary rounded-md border p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-tight">
            {labels.title}
          </h2>
          <span className="text-content-tertiary text-xs font-semibold">
            {labels.count}
          </span>
        </div>
        <EmptyState
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          className="mt-4 rounded-md p-6"
        />
      </section>
    );
  }

  return (
    <section className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
      <header className="border-border-subtle flex items-center justify-between gap-4 border-b px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">{labels.title}</h2>
        <span className="text-content-tertiary text-xs font-semibold">
          {labels.count}
        </span>
      </header>

      <div className="divide-border-subtle divide-y lg:hidden">
        {issues.map((issue) => {
          const isSelected = issue.id === selectedIssue?.id;

          return (
            <button
              key={issue.id}
              type="button"
              aria-pressed={isSelected}
              aria-controls={issueDetailControlIds}
              onClick={() => onSelectIssue(issue.id)}
              className={[
                'grid w-full min-w-0 gap-3 px-4 py-3 text-left transition',
                'focus-visible:outline-border-focus focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                isSelected
                  ? 'bg-action-primary/5'
                  : 'hover:bg-background-subtle',
              ].join(' ')}
            >
              <span className="flex flex-wrap items-center gap-2">
                <SeverityBadge issue={issue} labels={labels} />
                <span className="border-border-subtle bg-background-subtle text-content-secondary rounded-full border px-2 py-1 text-[0.6875rem] font-semibold">
                  {labels.scopes[issue.scope]}
                </span>
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {labels.issueCodes[issue.code]}
                </span>
                <span className="text-content-tertiary mt-1 block font-mono text-xs break-words">
                  {getAffectedLabel(issue, labels)}
                </span>
              </span>

              <IssueColorSwatches issue={issue} labels={labels} />
            </button>
          );
        })}
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block">
        <table className="w-full min-w-[48rem] border-collapse text-left text-xs">
          <thead className="bg-background-subtle text-content-tertiary">
            <tr>
              <th className="px-4 py-2 font-semibold">
                {labels.columns.severity}
              </th>
              <th className="px-4 py-2 font-semibold">
                {labels.columns.scope}
              </th>
              <th className="px-4 py-2 font-semibold">{labels.columns.rule}</th>
              <th className="px-4 py-2 font-semibold">
                {labels.columns.affected}
              </th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const isSelected = issue.id === selectedIssue?.id;

              return (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue.id)}
                  className={[
                    'border-border-subtle cursor-pointer border-t transition',
                    isSelected
                      ? 'bg-action-primary/5'
                      : 'hover:bg-background-subtle',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 align-top">
                    <SeverityBadge issue={issue} labels={labels} />
                  </td>
                  <td className="text-content-secondary px-4 py-3 align-top font-semibold">
                    {labels.scopes[issue.scope]}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-controls={issueDetailControlIds}
                      onClick={() => onSelectIssue(issue.id)}
                      className="text-content-primary focus-visible:outline-border-focus rounded-sm text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {labels.issueCodes[issue.code]}
                    </button>
                    {issue.themeName ? (
                      <p className="text-content-tertiary mt-1 text-xs font-semibold">
                        {issue.themeName}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-content-secondary max-w-md font-mono text-xs break-words">
                      {getAffectedLabel(issue, labels)}
                    </p>
                    <IssueColorSwatches
                      issue={issue}
                      labels={labels}
                      className="mt-2"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SeverityBadge({
  issue,
  labels,
}: {
  issue: AccessibilityCenterIssue;
  labels: AccessibilityIssuesClientLabels;
}) {
  return (
    <span
      className={[
        'w-fit shrink-0 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold',
        issue.severity === 'critical'
          ? 'border-action-danger/30 bg-action-danger/10 text-action-danger'
          : 'border-action-warning/30 bg-action-warning/10 text-action-warning',
      ].join(' ')}
    >
      {labels.severities[issue.severity]}
    </span>
  );
}

function IssueColorSwatches({
  issue,
  labels,
  className,
}: {
  issue: AccessibilityCenterIssue;
  labels: AccessibilityIssuesClientLabels;
  className?: string;
}) {
  if (!issue.foregroundValue && !issue.backgroundValue) {
    return null;
  }

  return (
    <div
      className={['flex min-w-0 flex-wrap items-center gap-3', className]
        .filter(Boolean)
        .join(' ')}
    >
      {issue.foregroundValue ? (
        <ColorValueSwatch
          label={labels.details.foregroundValue}
          value={issue.foregroundValue}
          size="sm"
        />
      ) : null}
      {issue.backgroundValue ? (
        <ColorValueSwatch
          label={labels.details.backgroundValue}
          value={issue.backgroundValue}
          size="sm"
        />
      ) : null}
    </div>
  );
}

function getIssueSource({
  projectSlug,
  issue,
  labels,
}: {
  projectSlug: string;
  issue: AccessibilityCenterIssue;
  labels: AccessibilityIssuesClientLabels;
}) {
  if (
    issue.scope === 'componentContract' ||
    issue.scope === 'componentBinding'
  ) {
    return {
      href: `/app/projects/${projectSlug}/components`,
      label: labels.actions.openComponents,
    };
  }

  if (issue.scope === 'theme' || issue.scope === 'themeContrast') {
    return {
      href: `/app/projects/${projectSlug}/themes`,
      label: labels.actions.openThemes,
    };
  }

  return {
    href: `/app/projects/${projectSlug}/tokens`,
    label: labels.actions.openTokens,
  };
}

function IssueDetail({
  id,
  variant,
  projectSlug,
  issue,
  ratioLabel,
  labels,
}: {
  id: string;
  variant: IssueDetailVariant;
  projectSlug: string;
  issue: AccessibilityCenterIssue;
  ratioLabel: string | null;
  labels: AccessibilityIssuesClientLabels;
}) {
  const pairLabel = issue.pairId ? labels.pairs[issue.pairId] : null;
  const source = getIssueSource({ projectSlug, issue, labels });
  const affectedField = issue.affectedField
    ? labels.details.fields[issue.affectedField]
    : null;
  const missingLocales =
    issue.missingLocales && issue.missingLocales.length > 0
      ? issue.missingLocales.map((locale) => locale.toUpperCase()).join(', ')
      : null;
  const isRail = variant === 'rail';

  return (
    <aside
      id={id}
      aria-live="polite"
      data-accessibility-layout-slot={isRail ? 'detail-rail' : undefined}
      className={
        isRail
          ? 'border-border-subtle bg-background-sunken hidden h-full min-h-0 min-w-0 overflow-y-auto border-l xl:block'
          : 'border-border-subtle bg-background-sunken min-w-0 rounded-md border p-4'
      }
    >
      <div className={isRail ? 'p-4 xl:p-5' : undefined}>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
              {labels.detailTitle}
            </p>
            <h3 className="mt-1 text-base font-semibold tracking-tight">
              {labels.issueCodes[issue.code]}
            </h3>
          </div>
          <SeverityBadge issue={issue} labels={labels} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="border-border-subtle bg-surface-primary text-content-secondary rounded-full border px-2 py-1 text-[0.6875rem] font-semibold">
            {labels.automatic}
          </span>
          <span className="border-border-subtle bg-surface-primary text-content-secondary rounded-full border px-2 py-1 text-[0.6875rem] font-semibold">
            {labels.scopes[issue.scope]}
          </span>
        </div>

        {pairLabel ? (
          <p className="text-content-secondary mt-3 text-sm">{pairLabel}</p>
        ) : null}

        {issue.themeName ? (
          <p className="text-content-tertiary mt-1 text-xs font-semibold">
            {issue.themeName}
          </p>
        ) : null}

        <div className="border-border-subtle mt-4 border-t pt-4">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
            {labels.recommendation}
          </p>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.issueFixes[issue.code]}
          </p>
        </div>

        <dl className="border-border-subtle mt-4 grid min-w-0 gap-3 border-t pt-4 text-xs">
          <DetailRow label={labels.details.tokenPath} value={issue.tokenPath} />
          <DetailRow
            label={labels.details.tokenSet}
            value={issue.tokenSetName}
          />
          <DetailRow
            label={labels.details.component}
            value={issue.componentName}
          />
          <DetailRow
            label={labels.details.componentType}
            value={issue.componentType}
          />
          <DetailRow
            label={labels.details.affectedField}
            value={affectedField}
          />
          <DetailRow
            label={labels.details.affectedCount}
            value={issue.affectedCount}
          />
          <DetailRow
            label={labels.details.missingLocales}
            value={missingLocales}
          />
          <DetailRow
            label={labels.details.bindingKey}
            value={issue.bindingKey}
          />
          <DetailRow
            label={labels.details.expectedTokenType}
            value={issue.expectedTokenType}
          />
          <DetailRow
            label={labels.details.actualTokenType}
            value={issue.actualTokenType}
          />
          <DetailRow
            label={labels.details.foreground}
            value={issue.foregroundTokenPath}
          />
          <ColorDetailRow
            label={labels.details.foregroundValue}
            value={issue.foregroundValue}
          />
          <DetailRow
            label={labels.details.background}
            value={issue.backgroundTokenPath}
          />
          <ColorDetailRow
            label={labels.details.backgroundValue}
            value={issue.backgroundValue}
          />
          <DetailRow label={labels.details.ratio} value={ratioLabel} />
        </dl>

        <AppLink
          href={source.href}
          className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary focus-visible:outline-border-focus mt-4 inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {source.label}
        </AppLink>
      </div>
    </aside>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <div className="min-w-0">
      <dt className="text-content-tertiary font-semibold">{label}</dt>
      <dd className="text-content-secondary mt-1 font-mono break-words">
        {value}
      </dd>
    </div>
  );
}

function ColorDetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <dt className="text-content-tertiary font-semibold">{label}</dt>
      <dd className="mt-1">
        <ColorValueSwatch label={label} value={value} />
      </dd>
    </div>
  );
}
