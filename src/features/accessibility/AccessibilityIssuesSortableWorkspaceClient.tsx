'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Select } from '@/components/ui';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';
import {
  AccessibilityIssuesWorkspaceClient,
  type AccessibilityIssuesClientLabels,
} from './AccessibilityIssuesWorkspaceClient';

type AccessibilityIssueSortKey = 'severity' | 'scope' | 'rule';

type AccessibilityIssuesSortableWorkspaceClientProps = {
  projectSlug: string;
  issues: AccessibilityCenterIssue[];
  ratioLabels: Record<string, string>;
  labels: AccessibilityIssuesClientLabels;
  header?: ReactNode;
  beforeIssues?: ReactNode;
  children?: ReactNode;
};

const severityRank: Record<AccessibilityCenterIssue['severity'], number> = {
  critical: 0,
  warning: 1,
};

function compareText(left: string, right: string) {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function sortIssues(
  issues: AccessibilityCenterIssue[],
  sortKey: AccessibilityIssueSortKey,
  labels: AccessibilityIssuesClientLabels,
) {
  return [...issues].sort((left, right) => {
    let result = 0;

    if (sortKey === 'severity') {
      result = severityRank[left.severity] - severityRank[right.severity];
    } else if (sortKey === 'scope') {
      result = compareText(
        labels.scopes[left.scope],
        labels.scopes[right.scope],
      );
    } else {
      result = compareText(
        labels.issueCodes[left.code],
        labels.issueCodes[right.code],
      );
    }

    if (result !== 0) {
      return result;
    }

    return compareText(
      labels.issueCodes[left.code],
      labels.issueCodes[right.code],
    );
  });
}

export function AccessibilityIssuesSortableWorkspaceClient({
  projectSlug,
  issues,
  ratioLabels,
  labels,
  header,
  beforeIssues,
  children,
}: AccessibilityIssuesSortableWorkspaceClientProps) {
  const t = useTranslations('AccessibilityCenterPage');
  const [sortKey, setSortKey] = useState<AccessibilityIssueSortKey | ''>('');
  const sortedIssues = useMemo(
    () => (sortKey ? sortIssues(issues, sortKey, labels) : issues),
    [issues, labels, sortKey],
  );
  const sortOptions = useMemo(
    () => [
      { value: 'severity', label: t('issues.sort.options.severity') },
      { value: 'scope', label: t('issues.sort.options.scope') },
      { value: 'rule', label: t('issues.sort.options.rule') },
    ],
    [t],
  );
  const sortControl =
    issues.length > 1 ? (
      <div className="flex min-w-0 justify-end">
        <div className="w-full sm:w-52">
          <label
            htmlFor="accessibility-issues-sort"
            className="text-content-tertiary text-xs font-semibold"
          >
            {t('issues.sort.label')}
          </label>
          <Select
            id="accessibility-issues-sort"
            value={sortKey}
            options={sortOptions}
            placeholder={t('issues.sort.label')}
            onValueChange={(value) =>
              setSortKey(value as AccessibilityIssueSortKey)
            }
            className="mt-1 w-full"
          />
        </div>
      </div>
    ) : null;

  return (
    <AccessibilityIssuesWorkspaceClient
      projectSlug={projectSlug}
      issues={sortedIssues}
      ratioLabels={ratioLabels}
      labels={labels}
      header={header}
      beforeIssues={
        beforeIssues || sortControl ? (
          <div className="grid min-w-0 gap-4">
            {beforeIssues}
            {sortControl}
          </div>
        ) : undefined
      }
    >
      {children}
    </AccessibilityIssuesWorkspaceClient>
  );
}
