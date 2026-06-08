import {
  resolveDesignTokens,
  tokenReferenceToPath,
  type DesignToken,
  type ThemeSeed,
} from '@/domain/design-system';

export type CssVariablesExportTheme = Pick<
  ThemeSeed,
  'mode' | 'name' | 'tokens'
>;

export type CssVariablesExportSkippedReason =
  | 'deprecated'
  | 'resolutionError'
  | 'unsupportedValue';

export type CssVariablesExportSkippedToken = {
  path: string;
  reason: CssVariablesExportSkippedReason;
};

export type CssVariableDefinition = {
  path: string;
  name: string;
  value: string;
  scope: ':root' | `[data-theme="${CssVariablesExportTheme['mode']}"]`;
};

export type CssVariablesExportInput = {
  projectName: string;
  tokens: readonly DesignToken[];
  themes?: readonly CssVariablesExportTheme[];
  includeDeprecated?: boolean;
};

export type CssVariablesExportResult = {
  fileName: string;
  content: string;
  variables: CssVariableDefinition[];
  skippedTokens: CssVariablesExportSkippedToken[];
  themeResolutionIssues: CssVariablesExportThemeResolutionIssue[];
};

export type CssVariablesExportThemeResolutionIssue = {
  themeMode: CssVariablesExportTheme['mode'];
  themeName: string;
  path: string;
  referencePath: string;
  reason: 'tokenNotFound' | 'tokenUnresolved' | 'unsupportedValue';
};

type FlattenedThemeToken = {
  path: string;
  value: string;
};

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tokenPathToCssVariableName(path: string): string {
  const segments = path
    .split('.')
    .map(toKebabCase)
    .filter((segment) => segment.length > 0);

  return `--${segments.join('-')}`;
}

function stringifyCssValue(value: DesignToken['value']): string | null {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  return null;
}

function createCssFileName(projectName: string): string {
  return `${toKebabCase(projectName) || 'design-system'}-tokens.css`;
}

function groupVariablesByType(variables: CssVariableDefinition[]) {
  return variables.reduce<Record<string, CssVariableDefinition[]>>(
    (groups, variable) => {
      const [type = 'tokens'] = variable.path.split('.');

      groups[type] = [...(groups[type] ?? []), variable];

      return groups;
    },
    {},
  );
}

function renderCssDeclarations(variables: readonly CssVariableDefinition[]) {
  return variables
    .map((variable) => `  ${variable.name}: ${variable.value};`)
    .join('\n');
}

function renderRootVariables(variables: readonly CssVariableDefinition[]) {
  if (variables.length === 0) {
    return '';
  }

  const groupedVariables = groupVariablesByType([...variables]);
  const sections = Object.entries(groupedVariables).map(
    ([groupName, groupVariables]) =>
      [`  /* ${groupName} */`, renderCssDeclarations(groupVariables)].join(
        '\n',
      ),
  );

  return [':root {', sections.join('\n\n'), '}'].join('\n');
}

function renderThemeVariables({
  theme,
  variables,
}: {
  theme: CssVariablesExportTheme;
  variables: readonly CssVariableDefinition[];
}) {
  if (variables.length === 0) {
    return '';
  }

  const selector =
    theme.mode === 'light' ? ':root' : `[data-theme="${theme.mode}"]`;

  return [
    `${selector} {`,
    `  /* theme · ${theme.name} */`,
    renderCssDeclarations(variables),
    '}',
  ].join('\n');
}

function flattenThemeTokens(
  tokens: Record<string, unknown>,
  prefix: string[] = [],
): FlattenedThemeToken[] {
  return Object.entries(tokens).flatMap(([key, value]) => {
    const nextPath = [...prefix, key];

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return [
        {
          path: nextPath.join('.'),
          value: String(value),
        },
      ];
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenThemeTokens(value as Record<string, unknown>, nextPath);
    }

    return [];
  });
}

function stringifyThemeValue(value: unknown): string | null {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  return null;
}

function createResolvedTokenValueLookup(tokens: readonly DesignToken[]) {
  const resolution = resolveDesignTokens(tokens);

  return new Map(
    resolution.tokens
      .filter((token) => token.isResolved)
      .map((token) => [token.path, token.resolvedValue]),
  );
}

function createThemeVariables({
  theme,
  tokens,
}: {
  theme: CssVariablesExportTheme;
  tokens: readonly DesignToken[];
}): {
  variables: CssVariableDefinition[];
  themeResolutionIssues: CssVariablesExportThemeResolutionIssue[];
} {
  const scope = (
    theme.mode === 'light' ? ':root' : `[data-theme="${theme.mode}"]`
  ) as CssVariableDefinition['scope'];

  const resolvedTokenValueByPath = createResolvedTokenValueLookup(tokens);
  const themeResolutionIssues: CssVariablesExportThemeResolutionIssue[] = [];

  const variables = flattenThemeTokens(theme.tokens).flatMap((token) => {
    const referencePath = tokenReferenceToPath(token.value);

    const resolvedThemeValue = referencePath
      ? resolvedTokenValueByPath.get(referencePath)
      : token.value;

    if (referencePath && resolvedThemeValue === undefined) {
      themeResolutionIssues.push({
        themeMode: theme.mode,
        themeName: theme.name,
        path: token.path,
        referencePath,
        reason: 'tokenNotFound',
      });

      return [];
    }

    const value = stringifyThemeValue(resolvedThemeValue);

    if (!value) {
      themeResolutionIssues.push({
        themeMode: theme.mode,
        themeName: theme.name,
        path: token.path,
        referencePath: referencePath ?? token.path,
        reason: referencePath ? 'tokenUnresolved' : 'unsupportedValue',
      });

      return [];
    }

    return [
      {
        path: token.path,
        name: tokenPathToCssVariableName(token.path),
        value,
        scope,
      },
    ];
  });

  return {
    variables,
    themeResolutionIssues,
  };
}

function createTokenVariables({
  tokens,
  includeDeprecated = false,
}: {
  tokens: readonly DesignToken[];
  includeDeprecated?: boolean;
}): {
  variables: CssVariableDefinition[];
  skippedTokens: CssVariablesExportSkippedToken[];
} {
  const resolution = resolveDesignTokens(tokens);
  const skippedTokens: CssVariablesExportSkippedToken[] = [];

  const variables = resolution.tokens.flatMap((resolvedToken) => {
    const sourceToken = tokens.find(
      (token) => token.path === resolvedToken.path,
    );

    if (!sourceToken) {
      return [];
    }

    if (!includeDeprecated && sourceToken.status === 'deprecated') {
      skippedTokens.push({
        path: sourceToken.path,
        reason: 'deprecated',
      });

      return [];
    }

    if (!resolvedToken.isResolved) {
      skippedTokens.push({
        path: sourceToken.path,
        reason: 'resolutionError',
      });

      return [];
    }

    const value = stringifyCssValue(resolvedToken.resolvedValue);

    if (!value) {
      skippedTokens.push({
        path: sourceToken.path,
        reason: 'unsupportedValue',
      });

      return [];
    }

    return [
      {
        path: resolvedToken.path,
        name: tokenPathToCssVariableName(resolvedToken.path),
        value,
        scope: ':root' as const,
      },
    ];
  });

  return {
    variables,
    skippedTokens,
  };
}

export function generateCssVariablesExport({
  projectName,
  tokens,
  themes = [],
  includeDeprecated = false,
}: CssVariablesExportInput): CssVariablesExportResult {
  const { variables: tokenVariables, skippedTokens } = createTokenVariables({
    tokens,
    includeDeprecated,
  });

  const themeVariablesByTheme = themes.map((theme) => {
    const result = createThemeVariables({
      theme,
      tokens,
    });

    return {
      theme,
      variables: result.variables,
      themeResolutionIssues: result.themeResolutionIssues,
    };
  });

  const content = [
    `/* ${projectName} — CSS variables */`,
    '/* generated by VulcanForgeUI · do not edit manually */',
    '',
    renderRootVariables(tokenVariables),
    ...themeVariablesByTheme.map(renderThemeVariables),
  ]
    .filter((section) => section.trim().length > 0)
    .join('\n\n')
    .trim();

  return {
    fileName: createCssFileName(projectName),
    content,
    variables: [
      ...tokenVariables,
      ...themeVariablesByTheme.flatMap(({ variables }) => variables),
    ],
    skippedTokens,
    themeResolutionIssues: themeVariablesByTheme.flatMap(
      ({ themeResolutionIssues }) => themeResolutionIssues,
    ),
  };
}
