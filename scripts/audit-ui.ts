import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const repositoryRoot = process.cwd();
const sourceRoot = resolve(repositoryRoot, 'src');

type RuleId =
  | 'legacy-font'
  | 'native-select'
  | 'generic-color'
  | 'large-radius'
  | 'unlocalized-preview-copy';

type Rule = {
  id: RuleId;
  description: string;
  pattern: RegExp;
  appliesTo: (path: string) => boolean;
};

type AllowlistEntry = {
  rule: RuleId;
  path: string;
  reason: string;
};

type Violation = {
  rule: RuleId;
  path: string;
  line: number;
  excerpt: string;
};

const productionExtensions = new Set(['.css', '.ts', '.tsx']);

/**
 * Every exception represents intentional product data or a validated preview
 * surface. New entries require a concrete reason so the audit cannot silently
 * become a list of ignored visual debt.
 */
const allowlist: readonly AllowlistEntry[] = [
  {
    rule: 'generic-color',
    path: 'src/components/layout/ProductEditorPreview.tsx',
    reason:
      'The marketing miniature displays fixed token sample data rather than application chrome.',
  },
  {
    rule: 'large-radius',
    path: 'src/components/layout/ProductEditorPreview.tsx',
    reason:
      'The validated marketing miniature is an intentionally scaled editorial preview surface.',
  },
  {
    rule: 'large-radius',
    path: 'src/app/[locale]/(public)/(marketing)/page.tsx',
    reason:
      'The public hero preview uses the validated large editorial-surface treatment.',
  },
] as const;

const rules: readonly Rule[] = [
  {
    id: 'legacy-font',
    description: 'Legacy Geist references are forbidden.',
    pattern: /(?:\bGeist\b|--font-geist)/g,
    appliesTo: () => true,
  },
  {
    id: 'native-select',
    description: 'Visible native selects must use the shared Select primitive.',
    pattern: /<select\b/g,
    appliesTo: (path) => path.endsWith('.tsx'),
  },
  {
    id: 'generic-color',
    description:
      'Generic black, white and neutral Tailwind colors must use VulcanForge semantic roles.',
    pattern:
      /\b(?:bg|text|border|ring|fill|stroke)-(?:black|white|neutral-\d{2,3})(?:\/\d+)?\b/g,
    appliesTo: () => true,
  },
  {
    id: 'large-radius',
    description:
      'Oversized 2xl and 3xl radii are forbidden outside documented editorial previews.',
    pattern: /\brounded-(?:2xl|3xl)\b/g,
    appliesTo: (path) =>
      path.startsWith('src/features/') ||
      path.startsWith('src/app/[locale]/app/') ||
      path.startsWith('src/components/ui/'),
  },
  {
    id: 'unlocalized-preview-copy',
    description:
      'The legacy hardcoded typography-preview sentence is forbidden.',
    pattern: /Aa Design system preview/g,
    appliesTo: () => true,
  },
] as const;

function getExtension(path: string) {
  const match = path.match(/\.[^.]+$/);
  return match?.[0] ?? '';
}

function collectFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = resolve(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return collectFiles(absolutePath);
    }

    const relativePath = relative(repositoryRoot, absolutePath).replaceAll(
      '\\',
      '/',
    );

    if (
      !productionExtensions.has(getExtension(relativePath)) ||
      relativePath.includes('.test.') ||
      relativePath.includes('.spec.')
    ) {
      return [];
    }

    return [relativePath];
  });
}

function isAllowed(rule: RuleId, path: string) {
  return allowlist.some(
    (entry) =>
      entry.rule === rule && entry.path === path && entry.reason.trim(),
  );
}

function getLineNumber(content: string, index: number) {
  return content.slice(0, index).split('\n').length;
}

function auditFile(path: string): Violation[] {
  const content = readFileSync(resolve(repositoryRoot, path), 'utf8');

  return rules.flatMap((rule) => {
    if (!rule.appliesTo(path) || isAllowed(rule.id, path)) {
      return [];
    }

    return [...content.matchAll(rule.pattern)].map((match) => ({
      rule: rule.id,
      path,
      line: getLineNumber(content, match.index ?? 0),
      excerpt: match[0],
    }));
  });
}

function assertRequiredFoundations() {
  const requiredFiles = [
    'src/app/[locale]/not-found.tsx',
    'src/app/[locale]/error.tsx',
    'src/app/[locale]/app/not-found.tsx',
    'src/app/[locale]/app/error.tsx',
    'src/app/global-error.tsx',
    'src/components/ui/ErrorState.tsx',
    'src/components/ui/Input.tsx',
    'src/components/ui/Textarea.tsx',
  ];

  const missingFiles = requiredFiles.filter(
    (path) => !existsSync(resolve(repositoryRoot, path)),
  );

  if (missingFiles.length > 0) {
    throw new Error(
      `Missing required UI foundations:\n${missingFiles.map((path) => `- ${path}`).join('\n')}`,
    );
  }

  const globalStyles = readFileSync(
    resolve(repositoryRoot, 'src/app/globals.css'),
    'utf8',
  );
  const requiredTokens = [
    '--vf-overlay-scrim',
    '--vf-overlay-content',
    '--vf-preview-contrast-surface',
    '--vf-preview-contrast-content',
  ];
  const missingTokens = requiredTokens.filter(
    (token) => !globalStyles.includes(token),
  );

  if (missingTokens.length > 0) {
    throw new Error(
      `Missing required semantic tokens:\n${missingTokens.map((token) => `- ${token}`).join('\n')}`,
    );
  }
}

function main() {
  assertRequiredFoundations();

  const files = [
    ...collectFiles(sourceRoot),
    ...(existsSync(resolve(repositoryRoot, 'README.md')) ? ['README.md'] : []),
  ];
  const violations = files.flatMap(auditFile);

  if (violations.length === 0) {
    console.log(
      `UI audit passed: ${files.length} production files checked, ${allowlist.length} documented exceptions.`,
    );
    return;
  }

  console.error('UI audit failed:');

  for (const violation of violations) {
    const description =
      rules.find((rule) => rule.id === violation.rule)?.description ??
      violation.rule;
    console.error(
      `- ${violation.path}:${violation.line} [${violation.rule}] ${description} Found: ${violation.excerpt}`,
    );
  }

  process.exitCode = 1;
}

main();
