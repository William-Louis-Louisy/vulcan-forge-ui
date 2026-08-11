import type { ReactNode } from 'react';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';
import type { AccessibilityIssuesClientLabels } from './AccessibilityIssuesWorkspaceClient';
import { AccessibilityIssuesSortableWorkspaceClient } from './AccessibilityIssuesSortableWorkspaceClient';

export type AccessibilityIssueSortLabels = {
  label: string;
  options: {
    severity: string;
    scope: string;
    rule: string;
  };
};

type AccessibilityIssuesLabels = AccessibilityIssuesClientLabels & {
  sort: AccessibilityIssueSortLabels;
  details: AccessibilityIssuesClientLabels['details'] & {
    ratioValue: (ratio: string, required: string) => string;
  };
};

type AccessibilityIssuesWorkspaceProps = {
  projectSlug: string;
  issues: AccessibilityCenterIssue[];
  labels: AccessibilityIssuesLabels;
  header?: ReactNode;
  beforeIssues?: ReactNode;
  children?: ReactNode;
};

export function AccessibilityIssuesWorkspace({
  projectSlug,
  issues,
  labels,
  header,
  beforeIssues,
  children,
}: AccessibilityIssuesWorkspaceProps) {
  const ratioLabels = Object.fromEntries(
    issues.flatMap((issue) => {
      if (issue.ratio === null || issue.requiredRatio === null) {
        return [];
      }

      return [
        [
          issue.id,
          labels.details.ratioValue(
            issue.ratio.toFixed(2),
            issue.requiredRatio.toFixed(1),
          ),
        ],
      ];
    }),
  );

  return (
    <AccessibilityIssuesSortableWorkspaceClient
      projectSlug={projectSlug}
      issues={issues}
      ratioLabels={ratioLabels}
      sortLabels={labels.sort}
      labels={{
        ...labels,
        details: {
          tokenPath: labels.details.tokenPath,
          tokenSet: labels.details.tokenSet,
          component: labels.details.component,
          componentType: labels.details.componentType,
          affectedField: labels.details.affectedField,
          affectedCount: labels.details.affectedCount,
          missingLocales: labels.details.missingLocales,
          bindingKey: labels.details.bindingKey,
          expectedTokenType: labels.details.expectedTokenType,
          actualTokenType: labels.details.actualTokenType,
          foreground: labels.details.foreground,
          background: labels.details.background,
          foregroundValue: labels.details.foregroundValue,
          backgroundValue: labels.details.backgroundValue,
          ratio: labels.details.ratio,
          fields: labels.details.fields,
        },
      }}
      header={header}
      beforeIssues={beforeIssues}
    >
      {children}
    </AccessibilityIssuesSortableWorkspaceClient>
  );
}
