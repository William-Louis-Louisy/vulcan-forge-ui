import {
  generateCssVariablesExport,
  type CssVariablesExportTheme,
  type CssVariablesExportSkippedToken,
  type CssVariablesExportThemeResolutionIssue,
} from './css-variables-export';
import type { DesignToken } from '@/domain/design-system';

export type ReactNativeThemeExportInput = {
  projectName: string;
  tokens: readonly DesignToken[];
  themes?: readonly CssVariablesExportTheme[];
  includeDeprecated?: boolean;
};

export type ReactNativeThemeExportResult = {
  fileName: string;
  content: string;
  tokens: Record<string, unknown>;
  themes: Record<string, Record<string, unknown>>;
  skippedTokens: CssVariablesExportSkippedToken[];
  themeResolutionIssues: CssVariablesExportThemeResolutionIssue[];
};

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toCamelCase(value: string): string {
  const normalizedValue = toKebabCase(value);

  return normalizedValue.replace(/-([a-z0-9])/g, (_, character: string) =>
    character.toUpperCase(),
  );
}

function createReactNativeFileName(projectName: string): string {
  return `${toKebabCase(projectName) || 'design-system'}-react-native-theme.ts`;
}

function pathToObjectKey(pathSegment: string): string {
  const normalizedSegment = toCamelCase(pathSegment);

  return /^\d/.test(normalizedSegment)
    ? `_${normalizedSegment}`
    : normalizedSegment;
}

function setNestedValue({
  target,
  path,
  value,
}: {
  target: Record<string, unknown>;
  path: string;
  value: unknown;
}) {
  const segments = path.split('.').map(pathToObjectKey);
  let currentTarget = target;

  segments.forEach((segment, index) => {
    const isLeaf = index === segments.length - 1;

    if (isLeaf) {
      currentTarget[segment] = value;
      return;
    }

    const existingValue = currentTarget[segment];

    if (
      !existingValue ||
      typeof existingValue !== 'object' ||
      Array.isArray(existingValue)
    ) {
      currentTarget[segment] = {};
    }

    currentTarget = currentTarget[segment] as Record<string, unknown>;
  });
}

function createTokensObject({
  projectName,
  tokens,
  includeDeprecated,
}: {
  projectName: string;
  tokens: readonly DesignToken[];
  includeDeprecated: boolean;
}) {
  const cssVariablesExport = generateCssVariablesExport({
    projectName,
    tokens,
    includeDeprecated,
  });

  const resolvedTokens: Record<string, unknown> = {};

  cssVariablesExport.variables
    .filter((variable) => variable.scope === ':root')
    .forEach((variable) => {
      setNestedValue({
        target: resolvedTokens,
        path: variable.path,
        value: variable.value,
      });
    });

  return {
    tokens: resolvedTokens,
    skippedTokens: cssVariablesExport.skippedTokens,
  };
}

function createThemesObject({
  projectName,
  tokens,
  themes,
  includeDeprecated,
}: {
  projectName: string;
  tokens: readonly DesignToken[];
  themes: readonly CssVariablesExportTheme[];
  includeDeprecated: boolean;
}) {
  const cssVariablesExport = generateCssVariablesExport({
    projectName,
    tokens,
    themes,
    includeDeprecated,
  });

  return {
    themes: themes.reduce<Record<string, Record<string, unknown>>>(
      (themeMap, theme) => {
        const themeTokens: Record<string, unknown> = {};

        cssVariablesExport.variables
          .filter(
            (variable) => variable.scope === ':root' && theme.mode === 'light',
          )
          .concat(
            cssVariablesExport.variables.filter(
              (variable) => variable.scope === `[data-theme="${theme.mode}"]`,
            ),
          )
          .filter((variable) => {
            const isThemeRole = [
              'color.background',
              'color.surface',
              'color.content',
              'color.muted',
              'color.accent',
            ].includes(variable.path);

            return isThemeRole;
          })
          .forEach((variable) => {
            setNestedValue({
              target: themeTokens,
              path: variable.path,
              value: variable.value,
            });
          });

        themeMap[theme.mode] = themeTokens;

        return themeMap;
      },
      {},
    ),
    themeResolutionIssues: cssVariablesExport.themeResolutionIssues,
  };
}

function serializeAsConst(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function generateReactNativeThemeExport({
  projectName,
  tokens,
  themes = [],
  includeDeprecated = false,
}: ReactNativeThemeExportInput): ReactNativeThemeExportResult {
  const resolvedTokenResult = createTokensObject({
    projectName,
    tokens,
    includeDeprecated,
  });

  const resolvedThemeResult = createThemesObject({
    projectName,
    tokens,
    themes,
    includeDeprecated,
  });

  const themeMap = resolvedThemeResult.themes;

  const content = [
    `// ${projectName} — React Native theme`,
    '// generated by VulcanForgeUI · do not edit manually',
    '',
    `export const tokens = ${serializeAsConst(resolvedTokenResult.tokens)} as const;`,
    '',
    `export const themes = ${serializeAsConst(themeMap)} as const;`,
    '',
    'export type ThemeMode = keyof typeof themes;',
    '',
    'export const lightTheme = themes.light ?? {};',
    'export const darkTheme = themes.dark ?? {};',
    '',
    'export function getTheme(mode: ThemeMode) {',
    '  return themes[mode];',
    '}',
    '',
    'export const reactNativeTheme = {',
    '  tokens,',
    '  themes,',
    '  lightTheme,',
    '  darkTheme,',
    '  getTheme,',
    '} as const;',
    '',
    'export type ReactNativeTokens = typeof tokens;',
    'export type ReactNativeThemes = typeof themes;',
    'export type ReactNativeTheme = typeof reactNativeTheme;',
    '',
    'export default reactNativeTheme;',
  ].join('\n');

  return {
    fileName: createReactNativeFileName(projectName),
    content,
    tokens: resolvedTokenResult.tokens,
    themes: themeMap,
    skippedTokens: resolvedTokenResult.skippedTokens,
    themeResolutionIssues: resolvedThemeResult.themeResolutionIssues,
  };
}
