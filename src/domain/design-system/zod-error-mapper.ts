import type { ZodError, ZodIssue } from 'zod';

export type LocalizedValidationIssue = {
  path: string;
  messageKey: string;
};

function pathToString(path: ZodIssue['path']) {
  return path.map(String).join('.');
}

export function zodIssueToMessageKey(issue: ZodIssue): string {
  if (issue.message && issue.message !== 'Invalid input') {
    return issue.message;
  }

  return issue.code;
}

export function zodErrorToLocalizedIssues(
  error: ZodError,
): LocalizedValidationIssue[] {
  return error.issues.map((issue) => ({
    path: pathToString(issue.path),
    messageKey: zodIssueToMessageKey(issue),
  }));
}
