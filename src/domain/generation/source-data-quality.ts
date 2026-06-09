import type { AiInstructionsInput } from '@/domain/ai-instructions';
import type { MarkdownDocumentationInput } from '@/domain/documentation';
import type { ComponentContract, DesignToken } from '@/domain/design-system';

export type SourceDataQualitySeverity = 'info' | 'warning' | 'critical';

export type SourceDataQualityArea =
  | 'project'
  | 'tokens'
  | 'themes'
  | 'components'
  | 'accessibility';

export type SourceDataQualityIssueCode =
  | 'missingProjectDescription'
  | 'missingTokens'
  | 'missingTokenDescriptions'
  | 'missingThemes'
  | 'missingAccessibilityReport'
  | 'missingAccessibilityContrastPairs'
  | 'missingComponents'
  | 'componentMissingAnatomy'
  | 'componentMissingVariants'
  | 'componentMissingStates'
  | 'componentMissingAccessibilityRules'
  | 'componentMissingForbiddenPatterns';

export type SourceDataQualityIssue = {
  id: string;
  code: SourceDataQualityIssueCode;
  severity: SourceDataQualitySeverity;
  area: SourceDataQualityArea;
  path: string;
  label: string | null;
  count: number | null;
};

export type SourceDataQualityStatus = 'ready' | 'partial' | 'insufficient';

export type SourceDataQualityReport = {
  status: SourceDataQualityStatus;
  issues: SourceDataQualityIssue[];
  summary: {
    total: number;
    critical: number;
    warning: number;
    info: number;
  };
};

type BaseGenerationInput = {
  project: {
    description: string | null;
  };
  tokens: readonly DesignToken[];
  components: readonly ComponentContract[];
};

function hasText(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function createIssue({
  code,
  severity,
  area,
  path,
  label = null,
  count = null,
}: {
  code: SourceDataQualityIssueCode;
  severity: SourceDataQualitySeverity;
  area: SourceDataQualityArea;
  path: string;
  label?: string | null;
  count?: number | null;
}): SourceDataQualityIssue {
  return {
    id: `${area}:${code}:${path}`,
    code,
    severity,
    area,
    path,
    label,
    count,
  };
}

function createSummary(
  issues: readonly SourceDataQualityIssue[],
): SourceDataQualityReport['summary'] {
  return {
    total: issues.length,
    critical: issues.filter((issue) => issue.severity === 'critical').length,
    warning: issues.filter((issue) => issue.severity === 'warning').length,
    info: issues.filter((issue) => issue.severity === 'info').length,
  };
}

function createStatus(
  summary: SourceDataQualityReport['summary'],
): SourceDataQualityStatus {
  if (summary.critical > 0) {
    return 'insufficient';
  }

  if (summary.warning > 0 || summary.info > 0) {
    return 'partial';
  }

  return 'ready';
}

function createReport(
  issues: SourceDataQualityIssue[],
): SourceDataQualityReport {
  const summary = createSummary(issues);

  return {
    status: createStatus(summary),
    issues,
    summary,
  };
}

function createBaseSourceDataIssues(
  input: BaseGenerationInput,
): SourceDataQualityIssue[] {
  const issues: SourceDataQualityIssue[] = [];

  if (!hasText(input.project.description)) {
    issues.push(
      createIssue({
        code: 'missingProjectDescription',
        severity: 'info',
        area: 'project',
        path: 'project.description',
      }),
    );
  }

  if (input.tokens.length === 0) {
    issues.push(
      createIssue({
        code: 'missingTokens',
        severity: 'critical',
        area: 'tokens',
        path: 'tokens',
      }),
    );
  }

  const tokensWithoutDescription = input.tokens.filter(
    (token) => !token.description,
  );

  if (tokensWithoutDescription.length > 0) {
    issues.push(
      createIssue({
        code: 'missingTokenDescriptions',
        severity: 'warning',
        area: 'tokens',
        path: 'tokens.description',
        count: tokensWithoutDescription.length,
      }),
    );
  }

  if (input.components.length === 0) {
    issues.push(
      createIssue({
        code: 'missingComponents',
        severity: 'critical',
        area: 'components',
        path: 'components',
      }),
    );

    return issues;
  }

  input.components.forEach((component) => {
    const componentPath = `components.${component.type}`;

    if (component.anatomy.length === 0) {
      issues.push(
        createIssue({
          code: 'componentMissingAnatomy',
          severity: 'warning',
          area: 'components',
          path: `${componentPath}.anatomy`,
          label: component.name,
        }),
      );
    }

    if (component.variants.length === 0) {
      issues.push(
        createIssue({
          code: 'componentMissingVariants',
          severity: 'warning',
          area: 'components',
          path: `${componentPath}.variants`,
          label: component.name,
        }),
      );
    }

    if (component.states.length === 0) {
      issues.push(
        createIssue({
          code: 'componentMissingStates',
          severity: 'warning',
          area: 'components',
          path: `${componentPath}.states`,
          label: component.name,
        }),
      );
    }

    if (component.accessibility.length === 0) {
      issues.push(
        createIssue({
          code: 'componentMissingAccessibilityRules',
          severity: 'warning',
          area: 'components',
          path: `${componentPath}.accessibility`,
          label: component.name,
        }),
      );
    }

    if (component.forbiddenPatterns.length === 0) {
      issues.push(
        createIssue({
          code: 'componentMissingForbiddenPatterns',
          severity: 'info',
          area: 'components',
          path: `${componentPath}.forbiddenPatterns`,
          label: component.name,
        }),
      );
    }
  });

  return issues;
}

export function createDocumentationSourceDataQualityReport(
  input: Omit<
    MarkdownDocumentationInput,
    'locale' | 'fallbackLocale' | 'sections'
  >,
): SourceDataQualityReport {
  const issues = createBaseSourceDataIssues(input);

  if (input.themes.length === 0) {
    issues.push(
      createIssue({
        code: 'missingThemes',
        severity: 'warning',
        area: 'themes',
        path: 'themes',
      }),
    );
  }

  if (!input.accessibility) {
    issues.push(
      createIssue({
        code: 'missingAccessibilityReport',
        severity: 'warning',
        area: 'accessibility',
        path: 'accessibility',
      }),
    );
  } else if (input.accessibility.contrastPairs.length === 0) {
    issues.push(
      createIssue({
        code: 'missingAccessibilityContrastPairs',
        severity: 'warning',
        area: 'accessibility',
        path: 'accessibility.contrastPairs',
      }),
    );
  }

  return createReport(issues);
}

export function createAiInstructionsSourceDataQualityReport(
  input: Omit<
    AiInstructionsInput,
    'locale' | 'fallbackLocale' | 'strictness' | 'sections'
  >,
): SourceDataQualityReport {
  return createReport(createBaseSourceDataIssues(input));
}
