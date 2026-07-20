import type { ReactNode } from 'react';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';
import {
  AccessibilityIssuesWorkspaceClient,
  type AccessibilityIssuesClientLabels,
} from './AccessibilityIssuesWorkspaceClient';

type AccessibilityIssuesLabels = AccessibilityIssuesClientLabels & {
  details: AccessibilityIssuesClientLabels['details'] & {
    ratioValue: (ratio: string, required: string) => string;
  };
};

type AccessibilityIssuesWorkspaceProps = {
  projectSlug: string;
  issues: AccessibilityCenterIssue[];
  labels: AccessibilityIssuesLabels;
  children?: ReactNode;
};

export function AccessibilityIssuesWorkspace({
  projectSlug,
  issues,
  labels,
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
    <AccessibilityIssuesWorkspaceClient
      projectSlug={projectSlug}
      issues={issues}
      ratioLabels={ratioLabels}
      labels={{
        ...labels,
        details: {
          tokenPath: labels.details.tokenPath,
          foreground: labels.details.foreground,
          background: labels.details.background,
          foregroundValue: labels.details.foregroundValue,
          backgroundValue: labels.details.backgroundValue,
          ratio: labels.details.ratio,
        },
      }}
    >
      {children}
    </AccessibilityIssuesWorkspaceClient>
  );
}
