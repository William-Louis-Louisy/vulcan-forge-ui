import { readFile, writeFile, unlink } from 'node:fs/promises';

const clientPath =
  'src/features/documentation/DocumentationGeneratorClient.tsx';
const labelsPath =
  'src/features/documentation/documentation-workspace-labels.ts';
const labelsTestPath =
  'src/features/documentation/documentation-workspace-labels.test.ts';
const auditPath = 'docs/product/ds-160-07b-documentation-alignment-audit.md';
const workflowPath = '.github/workflows/quality.yml';
const scriptPath = 'scripts/apply-documentation-qa-refinements.mjs';

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) {
    throw new Error(`Unable to locate ${label}.`);
  }

  return source.replace(before, after);
}

let client = await readFile(clientPath, 'utf8');

if (!client.includes('singleLocaleDescription={workspaceLabels.singleLocaleDescription}')) {
  client = replaceOnce(
    client,
    '<div className="mt-6 grid gap-6">',
    '<div className="mt-6 flex flex-col gap-5">',
    'documentation controls spacing',
  );

  client = replaceOnce(
    client,
    `            missingTranslations={generatedDocumentation.missingTranslations}\n            onSelect={selectLocale}`,
    `            missingTranslations={generatedDocumentation.missingTranslations}\n            singleLocaleDescription={workspaceLabels.singleLocaleDescription}\n            onSelect={selectLocale}`,
    'single-locale description prop',
  );

  client = replaceOnce(
    client,
    `          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">\n            <Button\n              type="button"\n              onClick={generatePreview}\n              disabled={selectedSections.length === 0}\n              className="gap-2"\n            >\n              <ArrowClockwiseIcon aria-hidden="true" size={16} weight="bold" />\n              {workspaceLabels.generate}\n            </Button>\n            <Button\n              type="button"\n              variant="secondary"\n              aria-label={t('actions.copy')}\n              title={t('actions.copy')}\n              onClick={copyMarkdown}\n              className="size-10 px-0"\n            >\n              <CopyIcon aria-hidden="true" size={16} weight="bold" />\n            </Button>\n            <Button\n              type="button"\n              variant="secondary"\n              aria-label={t('actions.download')}\n              title={t('actions.download')}\n              onClick={downloadMarkdown}\n              className="size-10 px-0"\n            >\n              <DownloadSimpleIcon aria-hidden="true" size={16} weight="bold" />\n            </Button>\n          </div>\n\n          <div aria-live="polite" className="min-h-5 text-xs font-semibold">\n            {generationStatus ? (\n              <p className="text-action-success">{workspaceLabels.generated}</p>\n            ) : null}\n            {copyStatus === 'success' ? (\n              <p className="text-action-success">{t('copy.success')}</p>\n            ) : null}\n            {copyStatus === 'error' ? (\n              <p role="alert" className="text-action-danger">\n                {t('copy.error')}\n              </p>\n            ) : null}\n          </div>`,
    `          <div className="grid gap-2">\n            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">\n              <Button\n                type="button"\n                onClick={generatePreview}\n                disabled={selectedSections.length === 0}\n                className="h-11 gap-2"\n              >\n                <ArrowClockwiseIcon\n                  aria-hidden="true"\n                  size={18}\n                  weight="bold"\n                />\n                {workspaceLabels.generate}\n              </Button>\n              <Button\n                type="button"\n                variant="secondary"\n                aria-label={t('actions.copy')}\n                title={t('actions.copy')}\n                onClick={copyMarkdown}\n                className="size-11 px-0"\n              >\n                <CopyIcon\n                  aria-hidden="true"\n                  size={20}\n                  weight="bold"\n                  className="size-5 shrink-0"\n                />\n              </Button>\n              <Button\n                type="button"\n                variant="secondary"\n                aria-label={t('actions.download')}\n                title={t('actions.download')}\n                onClick={downloadMarkdown}\n                className="size-11 px-0"\n              >\n                <DownloadSimpleIcon\n                  aria-hidden="true"\n                  size={20}\n                  weight="bold"\n                  className="size-5 shrink-0"\n                />\n              </Button>\n            </div>\n\n            <div\n              aria-live="polite"\n              className="min-h-5 text-xs font-semibold empty:hidden"\n            >\n              {generationStatus ? (\n                <p className="text-action-success">\n                  {workspaceLabels.generated}\n                </p>\n              ) : null}\n              {copyStatus === 'success' ? (\n                <p className="text-action-success">{t('copy.success')}</p>\n              ) : null}\n              {copyStatus === 'error' ? (\n                <p role="alert" className="text-action-danger">\n                  {t('copy.error')}\n                </p>\n              ) : null}\n            </div>\n          </div>`,
    'documentation action group',
  );

  client = replaceOnce(
    client,
    `  missingTranslations,\n  onSelect,\n}: {\n  supportedLocales: readonly AppLocale[];\n  selectedLocale: AppLocale;\n  missingTranslations: MarkdownDocumentationMissingTranslation[];\n  onSelect: (locale: AppLocale) => void;\n}) {\n  const t = useTranslations('DocumentationGeneratorPage');`,
    `  missingTranslations,\n  singleLocaleDescription,\n  onSelect,\n}: {\n  supportedLocales: readonly AppLocale[];\n  selectedLocale: AppLocale;\n  missingTranslations: MarkdownDocumentationMissingTranslation[];\n  singleLocaleDescription: string;\n  onSelect: (locale: AppLocale) => void;\n}) {\n  const t = useTranslations('DocumentationGeneratorPage');\n  const isSingleLocale = supportedLocales.length === 1;`,
    'locale control signature',
  );

  client = replaceOnce(
    client,
    `      <div className="border-border-subtle bg-background-subtle mt-3 grid grid-cols-2 rounded-md border p-1">\n        {supportedLocales.map((locale) => {\n          const isSelected = selectedLocale === locale;\n\n          return (\n            <label key={locale} className="cursor-pointer">\n              <input\n                type="radio"\n                name="documentationLocale"\n                value={locale}\n                checked={isSelected}\n                onChange={() => onSelect(locale)}\n                className="sr-only"\n              />\n              <span\n                className={[\n                  'focus-within:outline-border-focus flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition focus-within:outline-2 focus-within:outline-offset-2',\n                  isSelected\n                    ? 'bg-content-primary text-background-app'\n                    : 'text-content-secondary hover:text-content-primary',\n                ].join(' ')}\n              >\n                {t(\`controls.locale.options.\${locale}\`)}\n              </span>\n            </label>\n          );\n        })}\n      </div>\n      <p\n        className={[\n          'mt-2 text-xs leading-5',\n          missingTranslations.length > 0\n            ? 'text-action-warning'\n            : 'text-action-success',\n        ].join(' ')}\n      >`,
    `      {isSingleLocale ? (\n        <div className="border-border-subtle bg-surface-primary mt-3 flex min-h-11 items-center gap-3 rounded-md border px-3">\n          <span\n            aria-hidden="true"\n            className="bg-action-success size-2 shrink-0 rounded-full"\n          />\n          <span className="text-sm font-semibold">\n            {t(\`controls.locale.options.\${selectedLocale}\`)}\n          </span>\n          <span className="text-content-tertiary ml-auto text-[0.625rem] font-semibold tracking-[0.12em] uppercase">\n            {selectedLocale}\n          </span>\n        </div>\n      ) : (\n        <div className="border-border-subtle bg-background-subtle mt-3 grid grid-cols-2 rounded-md border p-1">\n          {supportedLocales.map((locale) => {\n            const isSelected = selectedLocale === locale;\n\n            return (\n              <label key={locale} className="cursor-pointer">\n                <input\n                  type="radio"\n                  name="documentationLocale"\n                  value={locale}\n                  checked={isSelected}\n                  onChange={() => onSelect(locale)}\n                  className="sr-only"\n                />\n                <span\n                  className={[\n                    'focus-within:outline-border-focus flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition focus-within:outline-2 focus-within:outline-offset-2',\n                    isSelected\n                      ? 'bg-content-primary text-background-app'\n                      : 'text-content-secondary hover:text-content-primary',\n                  ].join(' ')}\n                >\n                  {t(\`controls.locale.options.\${locale}\`)}\n                </span>\n              </label>\n            );\n          })}\n        </div>\n      )}\n      {isSingleLocale ? (\n        <p className="text-content-tertiary mt-2 text-xs leading-5">\n          {singleLocaleDescription}\n        </p>\n      ) : null}\n      <p\n        className={[\n          isSingleLocale ? 'mt-1 text-xs leading-5' : 'mt-2 text-xs leading-5',\n          missingTranslations.length > 0\n            ? 'text-action-warning'\n            : 'text-action-success',\n        ].join(' ')}\n      >`,
    'single-locale control rendering',
  );

  client = replaceOnce(
    client,
    '      className="border-border-subtle border-t pt-4"',
    '      className="border-border-subtle bg-surface-primary rounded-md border p-3"',
    'preferences form surface',
  );

  client = replaceOnce(
    client,
    '      <div className="flex items-start justify-between gap-3">',
    '      <div className="grid gap-3">',
    'preferences form layout',
  );

  client = replaceOnce(
    client,
    '          className="shrink-0"',
    '          className="w-full"',
    'preferences save button width',
  );

  await writeFile(clientPath, client);
}

let labels = await readFile(labelsPath, 'utf8');

if (!labels.includes('singleLocaleDescription')) {
  labels = replaceOnce(
    labels,
    `  previewModes: string;\n  diagnostics: string;`,
    `  previewModes: string;\n  singleLocaleDescription: string;\n  diagnostics: string;`,
    'workspace label type',
  );
  labels = replaceOnce(
    labels,
    `    previewModes: 'Documentation preview mode',\n    diagnostics: 'Generation diagnostics',`,
    `    previewModes: 'Documentation preview mode',\n    singleLocaleDescription: 'This is the only language enabled for this project.',\n    diagnostics: 'Generation diagnostics',`,
    'English single-locale label',
  );
  labels = replaceOnce(
    labels,
    `    previewModes: 'Mode de prévisualisation de la documentation',\n    diagnostics: 'Diagnostics de génération',`,
    `    previewModes: 'Mode de prévisualisation de la documentation',\n    singleLocaleDescription: 'C’est la seule langue activée pour ce projet.',\n    diagnostics: 'Diagnostics de génération',`,
    'French single-locale label',
  );
  await writeFile(labelsPath, labels);
}

let labelsTest = await readFile(labelsTestPath, 'utf8');

if (!labelsTest.includes('seule langue activée')) {
  labelsTest = replaceOnce(
    labelsTest,
    `    expect(getDocumentationWorkspaceLabels('fr').generate).toBe('Générer');`,
    `    expect(getDocumentationWorkspaceLabels('fr').generate).toBe('Générer');\n    expect(\n      getDocumentationWorkspaceLabels('fr').singleLocaleDescription,\n    ).toContain('seule langue activée');`,
    'single-locale label test',
  );
  await writeFile(labelsTestPath, labelsTest);
}

let audit = await readFile(auditPath, 'utf8');

if (!audit.includes('## Visual QA refinements')) {
  audit = replaceOnce(
    audit,
    `## Acceptance targets`,
    `## Visual QA refinements\n\nThe first visual review identified four compact-column issues that are part of the alignment contract:\n\n- a project with one supported locale uses a static full-width language status instead of an incomplete-looking segmented control;\n- copy and download shortcuts use the same 44px action height as Generate and expose clearly legible 20px icons;\n- action feedback is grouped with the action row and disappears when empty, preserving a regular vertical rhythm;\n- saved documentation preferences use a compact vertical card with a full-width action instead of squeezing copy and button into competing columns.\n\n## Acceptance targets`,
    'visual QA audit section',
  );
  await writeFile(auditPath, audit);
}

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

await writeFile(workflowPath, standardWorkflow);
await unlink(scriptPath);
