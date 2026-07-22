import { readFile, writeFile, unlink } from 'node:fs/promises';

const paths = {
  documentation:
    'src/features/documentation/DocumentationGeneratorClient.tsx',
  aiInstructions:
    'src/features/ai-instructions/AiInstructionsGeneratorClient.tsx',
  exports: 'src/features/exports/ExportCenterClient.tsx',
  exportLabels: 'src/features/exports/export-center-workspace-labels.ts',
  exportLabelsTest:
    'src/features/exports/export-center-workspace-labels.test.ts',
  accessibility:
    'src/app/[locale]/app/projects/[projectSlug]/accessibility/page.tsx',
  accessibilityMessages: 'src/messages/accessibility-center-messages.ts',
  themes: 'src/app/[locale]/app/projects/[projectSlug]/themes/page.tsx',
  themesWorkspace: 'src/features/themes/ThemesResponsiveWorkspace.tsx',
  themeMessages: 'src/messages/theme-editor-messages.ts',
  tokens: 'src/app/[locale]/app/projects/[projectSlug]/tokens/page.tsx',
  tokensShell: 'src/features/tokens/editor/TokensEditorShell.tsx',
  workflow: '.github/workflows/quality.yml',
  script: 'scripts/apply-ds-160-08-global-ui-qa.mjs',
};

function replaceOnce(source, search, replacement, label) {
  const nextSource = source.replace(search, replacement);

  if (nextSource === source) {
    throw new Error(`Unable to locate ${label}.`);
  }

  return nextSource;
}

function replaceAllChecked(source, search, replacement, minimum, label) {
  const matches = source.match(search);

  if (!matches || matches.length < minimum) {
    throw new Error(`Unable to locate enough ${label}.`);
  }

  return source.replaceAll(search, replacement);
}

let documentation = await readFile(paths.documentation, 'utf8');
documentation = replaceOnce(
  documentation,
  "import { Button } from '@/components/ui';",
  "import { Button, ProjectWorkspaceHeader } from '@/components/ui';",
  'Documentation workspace header import',
);
documentation = replaceOnce(
  documentation,
  /        <header>\n          <p className="text-action-primary[\s\S]*?        <\/header>/,
  `        <ProjectWorkspaceHeader\n          eyebrow={t('eyebrow')}\n          title={workspaceLabels.pageTitle}\n          description={t('description')}\n          projectName={documentationInput.project.name}\n        />`,
  'Documentation workspace header',
);
documentation = replaceOnce(
  documentation,
  '<label key={locale} className="cursor-pointer">',
  '<label\n                  key={locale}\n                  className="focus-within:outline-border-focus cursor-pointer rounded-sm focus-within:outline-2 focus-within:outline-offset-2"\n                >',
  'Documentation locale focus target',
);
documentation = replaceOnce(
  documentation,
  "'focus-within:outline-border-focus flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition focus-within:outline-2 focus-within:outline-offset-2',",
  "'flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition',",
  'Documentation locale visual segment focus classes',
);
documentation = replaceOnce(
  documentation,
  'className="hover:bg-background-subtle flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3 py-2 text-sm font-medium transition"',
  'className="focus-within:outline-border-focus hover:bg-background-subtle flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3 py-2 text-sm font-medium transition focus-within:outline-2 focus-within:outline-offset-[-2px]"',
  'Documentation section focus target',
);
await writeFile(paths.documentation, documentation);

let aiInstructions = await readFile(paths.aiInstructions, 'utf8');
aiInstructions = replaceOnce(
  aiInstructions,
  "import { Button } from '@/components/ui';",
  "import { Button, ProjectWorkspaceHeader } from '@/components/ui';",
  'AI Instructions workspace header import',
);
aiInstructions = replaceOnce(
  aiInstructions,
  /        <header>\n          <p className="text-action-primary[\s\S]*?        <\/header>/,
  `        <ProjectWorkspaceHeader\n          eyebrow={t('eyebrow')}\n          title={workspaceLabels.pageTitle}\n          description={t('description')}\n          projectName={aiInstructionsInput.project.name}\n        />`,
  'AI Instructions workspace header',
);
aiInstructions = replaceOnce(
  aiInstructions,
  '<label key={locale} className="cursor-pointer">',
  '<label\n                  key={locale}\n                  className="focus-within:outline-border-focus cursor-pointer rounded-sm focus-within:outline-2 focus-within:outline-offset-2"\n                >',
  'AI locale focus target',
);
aiInstructions = replaceOnce(
  aiInstructions,
  "'focus-within:outline-border-focus flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition focus-within:outline-2 focus-within:outline-offset-2',",
  "'flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition',",
  'AI locale visual segment focus classes',
);
aiInstructions = replaceOnce(
  aiInstructions,
  "'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition',",
  "'focus-within:outline-border-focus flex cursor-pointer items-start gap-3 rounded-md border p-3 transition focus-within:outline-2 focus-within:outline-offset-2',",
  'AI strictness focus target',
);
aiInstructions = replaceOnce(
  aiInstructions,
  'className="hover:bg-background-subtle flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 transition"',
  'className="focus-within:outline-border-focus hover:bg-background-subtle flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 transition focus-within:outline-2 focus-within:outline-offset-[-2px]"',
  'AI section focus target',
);
await writeFile(paths.aiInstructions, aiInstructions);

let exportsClient = await readFile(paths.exports, 'utf8');
exportsClient = replaceOnce(
  exportsClient,
  "import { Button } from '@/components/ui';",
  "import { Button, ProjectWorkspaceHeader } from '@/components/ui';",
  'Exports workspace header import',
);
exportsClient = replaceOnce(
  exportsClient,
  "errorMessage: 'Unable to copy export content to clipboard.',",
  'errorMessage: workspaceLabels.copyFailureLog,',
  'localized copy failure log',
);
exportsClient = replaceOnce(
  exportsClient,
  "errorMessage: 'Unable to download export content.',",
  'errorMessage: workspaceLabels.downloadFailureLog,',
  'localized download failure log',
);
exportsClient = replaceOnce(
  exportsClient,
  /        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">[\s\S]*?        <\/header>\n\n        <section/,
  `        <ProjectWorkspaceHeader\n          title={workspaceLabels.pageTitle}\n          description={workspaceLabels.generatedFromModel}\n          projectName={exportCenterInput.project.name}\n          status={\n            <span className="border-action-success/30 bg-action-success/10 text-action-success rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold">\n              {workspaceLabels.allFormatsAvailable}\n            </span>\n          }\n          actions={\n            <label className="border-border-subtle bg-surface-primary focus-within:outline-border-focus flex max-w-sm cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 focus-within:outline-2 focus-within:outline-offset-2">\n              <input\n                type="checkbox"\n                checked={includeDeprecated}\n                onChange={(event) => {\n                  setIncludeDeprecated(event.currentTarget.checked);\n                  setCopyStatus(null);\n                  setLogStatus('idle');\n                }}\n                className="sr-only"\n              />\n              <span\n                aria-hidden="true"\n                className={[\n                  'relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition',\n                  includeDeprecated\n                    ? 'border-action-primary bg-action-primary'\n                    : 'border-border-default bg-background-subtle',\n                ].join(' ')}\n              >\n                <span\n                  className={[\n                    'bg-action-primary-content absolute top-0.5 size-3.5 rounded-full transition-transform',\n                    includeDeprecated\n                      ? 'translate-x-[1.125rem]'\n                      : 'translate-x-0.5',\n                  ].join(' ')}\n                />\n              </span>\n              <span className="min-w-0">\n                <span className="block text-xs font-semibold">\n                  {workspaceLabels.includeDeprecated}\n                </span>\n                <span className="text-content-tertiary mt-1 block text-xs leading-5">\n                  {workspaceLabels.includeDeprecatedDescription}\n                </span>\n              </span>\n            </label>\n          }\n        />\n\n        <section`,
  'Exports workspace header',
);
await writeFile(paths.exports, exportsClient);

let exportLabels = await readFile(paths.exportLabels, 'utf8');
exportLabels = replaceOnce(
  exportLabels,
  '  diagnosticsCount: string;\n};',
  '  diagnosticsCount: string;\n  copyFailureLog: string;\n  downloadFailureLog: string;\n};',
  'Export failure label types',
);
exportLabels = replaceOnce(
  exportLabels,
  "    diagnosticsCount: '{count} items to review',",
  "    diagnosticsCount: '{count} items to review',\n    copyFailureLog: 'Unable to copy export content to the clipboard.',\n    downloadFailureLog: 'Unable to download the export file.',",
  'English export failure labels',
);
exportLabels = replaceOnce(
  exportLabels,
  "    diagnosticsCount: '{count} éléments à vérifier',",
  "    diagnosticsCount: '{count} éléments à vérifier',\n    copyFailureLog: 'Impossible de copier le contenu de l’export dans le presse-papiers.',\n    downloadFailureLog: 'Impossible de télécharger le fichier exporté.',",
  'French export failure labels',
);
await writeFile(paths.exportLabels, exportLabels);

let exportLabelsTest = await readFile(paths.exportLabelsTest, 'utf8');
exportLabelsTest = replaceOnce(
  exportLabelsTest,
  "    expect(getExportCenterWorkspaceLabels('fr').allFormatsAvailable).toContain(\n      'disponibles',\n    );",
  "    expect(getExportCenterWorkspaceLabels('fr').allFormatsAvailable).toContain(\n      'disponibles',\n    );\n    expect(getExportCenterWorkspaceLabels('fr').copyFailureLog).toContain(\n      'presse-papiers',\n    );",
  'localized export failure label test',
);
await writeFile(paths.exportLabelsTest, exportLabelsTest);

let accessibility = await readFile(paths.accessibility, 'utf8');
accessibility = replaceOnce(
  accessibility,
  "import { ColorValueSwatch, Notice } from '@/components/ui';",
  "import {\n  ColorValueSwatch,\n  Notice,\n  ProjectWorkspaceHeader,\n} from '@/components/ui';",
  'Accessibility workspace header import',
);
accessibility = replaceOnce(
  accessibility,
  `        header={\n          <header className="border-border-subtle bg-background-app shrink-0 border-b px-4 py-4 md:px-6 xl:px-7 xl:py-5">\n            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">\n              <div className="min-w-0">\n                <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">\n                  {t('eyebrow')}\n                </p>\n                <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.015em]">\n                  {t('title', { projectName: pageData.project.name })}\n                </h1>\n                <p className="text-content-tertiary mt-1 max-w-3xl text-sm leading-6">\n                  {t('description')}\n                </p>\n              </div>\n\n              <SaveAccessibilityReportButton\n                locale={locale}\n                projectSlug={pageData.project.slug}\n              />\n            </div>\n          </header>\n        }`,
  `        header={\n          <ProjectWorkspaceHeader\n            variant="bar"\n            title={t('workspaceTitle')}\n            description={t('description')}\n            projectName={pageData.project.name}\n            actions={\n              <SaveAccessibilityReportButton\n                locale={locale}\n                projectSlug={pageData.project.slug}\n              />\n            }\n          />\n        }`,
  'Accessibility workspace header',
);
await writeFile(paths.accessibility, accessibility);

let accessibilityMessages = await readFile(paths.accessibilityMessages, 'utf8');
accessibilityMessages = replaceOnce(
  accessibilityMessages,
  "    AccessibilityCenterPage: {\n      description:",
  "    AccessibilityCenterPage: {\n      workspaceTitle: 'Accessibility',\n      description:",
  'English Accessibility workspace title',
);
accessibilityMessages = replaceOnce(
  accessibilityMessages,
  "    AccessibilityCenterPage: {\n      description:\n        'Analysez",
  "    AccessibilityCenterPage: {\n      workspaceTitle: 'Accessibilité',\n      description:\n        'Analysez",
  'French Accessibility workspace title',
);
await writeFile(paths.accessibilityMessages, accessibilityMessages);

let themeMessages = await readFile(paths.themeMessages, 'utf8');
themeMessages = replaceOnce(
  themeMessages,
  "    ThemesEditorPage: {\n      description:",
  "    ThemesEditorPage: {\n      workspaceTitle: 'Themes',\n      description:",
  'English Themes workspace title',
);
themeMessages = replaceOnce(
  themeMessages,
  "    ThemesEditorPage: {\n      description:\n        'Associez",
  "    ThemesEditorPage: {\n      workspaceTitle: 'Thèmes',\n      description:\n        'Associez",
  'French Themes workspace title',
);
await writeFile(paths.themeMessages, themeMessages);

let themes = await readFile(paths.themes, 'utf8');
themes = replaceOnce(
  themes,
  "        title={t('title', { projectName: pageData.project.name })}\n        description={t('description')}",
  "        title={t('workspaceTitle')}\n        description={t('description')}\n        projectName={pageData.project.name}",
  'Themes workspace context props',
);
await writeFile(paths.themes, themes);

let themesWorkspace = await readFile(paths.themesWorkspace, 'utf8');
themesWorkspace = replaceOnce(
  themesWorkspace,
  "import { useState, type KeyboardEvent, type ReactNode } from 'react';",
  "import { ProjectWorkspaceHeader } from '@/components/ui';\nimport { useState, type KeyboardEvent, type ReactNode } from 'react';",
  'Themes workspace header import',
);
themesWorkspace = replaceOnce(
  themesWorkspace,
  '  description: string;\n  summary: string;',
  '  description: string;\n  projectName: string;\n  summary: string;',
  'Themes workspace project name prop type',
);
themesWorkspace = replaceOnce(
  themesWorkspace,
  '  description,\n  summary,',
  '  description,\n  projectName,\n  summary,',
  'Themes workspace project name prop',
);
themesWorkspace = replaceOnce(
  themesWorkspace,
  /          <header className="border-border-subtle shrink-0 border-b px-4 pt-4 md:px-6 xl:px-7 xl:pt-5">[\s\S]*?          <\/header>/,
  `          <ProjectWorkspaceHeader\n            variant="bar"\n            title={title}\n            description={description}\n            projectName={projectName}\n            status={\n              <span className="border-border-subtle bg-background-subtle text-content-secondary rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold">\n                {summary}\n              </span>\n            }\n            footer={\n              themes.length > 0 ? (\n                <div\n                  role="tablist"\n                  aria-label={labels.themeNavigation}\n                  className="flex min-w-0 gap-1 overflow-x-auto"\n                >\n                  {themes.map((theme) => {\n                    const isActive = theme.id === activeTheme?.id;\n\n                    return (\n                      <button\n                        key={theme.id}\n                        id={\`theme-editor-tab-\${theme.id}\`}\n                        type="button"\n                        role="tab"\n                        tabIndex={isActive ? 0 : -1}\n                        aria-selected={isActive}\n                        aria-controls={\`theme-editor-panel-\${theme.id}\`}\n                        onClick={() => setActiveThemeId(theme.id)}\n                        onKeyDown={(event) =>\n                          handleTabKeyDown({\n                            event,\n                            items: themeIds,\n                            currentItem: theme.id,\n                            onSelect: setActiveThemeId,\n                            getTabId: (item) => \`theme-editor-tab-\${item}\`,\n                          })\n                        }\n                        className={[\n                          'border-b-2 px-3 py-2 text-sm font-semibold whitespace-nowrap transition',\n                          'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-[-2px]',\n                          isActive\n                            ? 'border-content-primary text-content-primary'\n                            : 'text-content-tertiary hover:text-content-primary border-transparent',\n                        ].join(' ')}\n                      >\n                        {theme.label}\n                      </button>\n                    );\n                  })}\n                </div>\n              ) : null\n            }\n          />`,
  'Themes workspace header',
);
await writeFile(paths.themesWorkspace, themesWorkspace);

let tokens = await readFile(paths.tokens, 'utf8');
tokens = replaceOnce(
  tokens,
  '        projectSlug={pageData.project.slug}\n        tokenSets={tokenSetViewModels}',
  '        projectSlug={pageData.project.slug}\n        projectName={pageData.project.name}\n        tokenSets={tokenSetViewModels}',
  'Tokens workspace project name',
);
await writeFile(paths.tokens, tokens);

let tokensShell = await readFile(paths.tokensShell, 'utf8');
tokensShell = replaceOnce(
  tokensShell,
  "import { TokenSetTabs } from './TokenSetTabs';",
  "import { ProjectWorkspaceHeader } from '@/components/ui';\nimport { TokenSetTabs } from './TokenSetTabs';",
  'Tokens workspace header import',
);
tokensShell = replaceOnce(
  tokensShell,
  '  projectSlug: string;\n  tokenSets: TokenSetEditorViewModel[];',
  '  projectSlug: string;\n  projectName: string;\n  tokenSets: TokenSetEditorViewModel[];',
  'Tokens workspace project name prop type',
);
tokensShell = replaceOnce(
  tokensShell,
  '  projectSlug,\n  tokenSets,',
  '  projectSlug,\n  projectName,\n  tokenSets,',
  'Tokens workspace project name prop',
);
tokensShell = replaceOnce(
  tokensShell,
  /        <header className="border-border-subtle shrink-0 border-b px-4 pt-4 md:px-6 xl:px-7 xl:pt-5">[\s\S]*?        <\/header>/,
  `        <ProjectWorkspaceHeader\n          variant="bar"\n          title={labels.header.title}\n          description={labels.header.summary}\n          descriptionClassName={\n            hasMissingEnglishDescriptions\n              ? 'text-action-warning'\n              : 'text-content-tertiary'\n          }\n          projectName={projectName}\n          actions={\n            <TokenEditorToolbar\n              searchLabel={labels.toolbar.searchLabel}\n              searchPlaceholder={labels.toolbar.searchPlaceholder}\n              newTokenLabel={labels.toolbar.newToken}\n              tokenSearchQuery={tokenSearchQuery}\n              isNewTokenDisabled={\n                activeTokenSetType !== 'color' &&\n                activeTokenSetType !== 'spacing' &&\n                activeTokenSetType !== 'radius' &&\n                activeTokenSetType !== 'motion' &&\n                activeTokenSetType !== 'typography'\n              }\n              onNewTokenClick={handleNewTokenClick}\n              onSearchChange={handleSearchChange}\n            />\n          }\n          footer={\n            <TokenSetTabs\n              label={labels.tabs.label}\n              activeTokenSetType={activeTokenSetType}\n              tokenSetLabels={labels.tabs.items}\n              tokenSetCounts={tokenSetCounts}\n              onTokenSetChange={handleTokenSetChange}\n            />\n          }\n        />`,
  'Tokens workspace header',
);
await writeFile(paths.tokensShell, tokensShell);

const standardWorkflow = `name: Quality

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

concurrency:
  group: quality-\${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Quality checks
    runs-on: ubuntu-latest
    timeout-minutes: 10

    permissions:
      contents: read

    env:
      DATABASE_URL: postgresql://vulcan:vulcan_dev_password@localhost:5432/vulcan_forge_ui?schema=public

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npm run db:generate

      - name: Run lint
        run: npm run lint

      - name: Run typecheck
        run: npm run typecheck

      - name: Check formatting
        run: npm run format:check

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build
`;

await writeFile(paths.workflow, standardWorkflow);
await unlink(paths.script);
