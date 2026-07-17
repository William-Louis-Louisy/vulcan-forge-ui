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
  issues: AccessibilityCenterIssue[];
  labels: AccessibilityIssuesLabels;
};

export function AccessibilityIssuesWorkspace({
  issues,
  labels,
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

  const { ratioValue: _ratioValue, ...serializableDetails } = labels.details;

  return (
    <AccessibilityIssuesWorkspaceClient
      issues={issues}
      ratioLabels={ratioLabels}
      labels={{
        ...labels,
        details: serializableDetails,
      }}
    />
  );
}
