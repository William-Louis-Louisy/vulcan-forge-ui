'use client';

import { useState } from 'react';
import { EmptyState } from '@/components/ui';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';

export type AccessibilityIssuesClientLabels = {
  title: string;
  detailTitle: string;
  count: string;
  emptyTitle: string;
  emptyDescription: string;
  pairs: Record<NonNullable<AccessibilityCenterIssue['pairId']>, string>;
  issueCodes: Record<AccessibilityCenterIssue['code'], string>;
  issueFixes: Record<AccessibilityCenterIssue['code'], string>;
  severities: Record<AccessibilityCenterIssue['severity'], string>;
  details: {
    tokenPath: string;
    foreground: string;
    background: string;
    foregroundValue: string;
    backgroundValue: string;
    ratio: string;
  };
};

type AccessibilityIssuesWorkspaceClientProps = {
  issues: AccessibilityCenterIssue[];
  ratioLabels: Record<string, string>;
  labels: AccessibilityIssuesClientLabels;
};

export function AccessibilityIssuesWorkspaceClient({
  issues,
  ratioLabels,
  labels,
}: AccessibilityIssuesWorkspaceClientProps) {
  const [selectedIssueId, setSelectedIssueId] = useState(issues[0]?.id ?? null);
  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? issues[0] ?? null;

  if (issues.length === 0) {
    return (
      <section className="border-border-subtle bg-surface-primary rounded-md border p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-tight">{labels.title}</h2>
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
    <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <div className="border-border-subtle bg-surface-primary min-w-0 rounded-md border">
        <header className="border-border-subtle flex items-center justify-between gap-4 border-b px-4 py-3">
          <h2 className="text-sm font-semibold tracking-tight">{labels.title}</h2>
          <span className="text-content-tertiary text-xs font-semibold">
            {labels.count}
          </span>
        </header>

        <div className="divide-border-subtle divide-y">
          {issues.map((issue) => {
            const isSelected = issue.id === selectedIssue?.id;
            const pairLabel = issue.pairId ? labels.pairs[issue.pairId] : null;
            const affectedPath =
              issue.tokenPath ??
              issue.foregroundTokenPath ??
              issue.backgroundTokenPath ??
              pairLabel;

            return (
              <button
                key={issue.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedIssueId(issue.id)}
                className={[
                  'grid w-full min-w-0 gap-3 px-4 py-3 text-left transition sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center',
                  'focus-visible:outline-border-focus focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                  isSelected
                    ? 'bg-action-primary/5'
                    : 'hover:bg-background-subtle',
                ].join(' ')}
              >
                <SeverityBadge issue={issue} labels={labels} />

                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {labels.issueCodes[issue.code]}
                  </span>
                  {affectedPath ? (
                    <span className="text-content-tertiary mt-1 block truncate font-mono text-xs">
                      {affectedPath}
                    </span>
                  ) : null}
                </span>

                {issue.themeName ? (
                  <span className="text-content-tertiary text-xs font-semibold">
                    {issue.themeName}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {selectedIssue ? (
        <IssueDetail
          issue={selectedIssue}
          ratioLabel={ratioLabels[selectedIssue.id] ?? null}
          labels={labels}
        />
      ) : null}
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

function IssueDetail({
  issue,
  ratioLabel,
  labels,
}: {
  issue: AccessibilityCenterIssue;
  ratioLabel: string | null;
  labels: AccessibilityIssuesClientLabels;
}) {
  const pairLabel = issue.pairId ? labels.pairs[issue.pairId] : null;

  return (
    <aside
      aria-live="polite"
      className="border-border-subtle bg-background-sunken min-w-0 rounded-md border p-4 xl:sticky xl:top-4"
    >
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

      {pairLabel ? (
        <p className="text-content-secondary mt-3 text-sm">{pairLabel}</p>
      ) : null}

      {issue.themeName ? (
        <p className="text-content-tertiary mt-1 text-xs font-semibold">
          {issue.themeName}
        </p>
      ) : null}

      <p className="text-content-secondary mt-4 text-sm leading-6">
        {labels.issueFixes[issue.code]}
      </p>

      <dl className="border-border-subtle mt-4 grid min-w-0 gap-3 border-t pt-4 text-xs">
        <DetailRow label={labels.details.tokenPath} value={issue.tokenPath} />
        <DetailRow
          label={labels.details.foreground}
          value={issue.foregroundTokenPath}
        />
        <DetailRow
          label={labels.details.foregroundValue}
          value={issue.foregroundValue}
        />
        <DetailRow
          label={labels.details.background}
          value={issue.backgroundTokenPath}
        />
        <DetailRow
          label={labels.details.backgroundValue}
          value={issue.backgroundValue}
        />
        <DetailRow label={labels.details.ratio} value={ratioLabel} />
      </dl>
    </aside>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <dt className="text-content-tertiary font-semibold">{label}</dt>
      <dd className="text-content-secondary mt-1 break-words font-mono">
        {value}
      </dd>
    </div>
  );
}
