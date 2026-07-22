import { readFile, writeFile, unlink } from 'node:fs/promises';

const exportClientPath = 'src/features/exports/ExportCenterClient.tsx';
const documentationClientPath =
  'src/features/documentation/DocumentationGeneratorClient.tsx';
const scriptPath = 'scripts/apply-exports-visual-qa-refinements.mjs';

function replacePattern(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`Unable to locate ${label}.`);
  }

  return source.replace(pattern, replacement);
}

let exportClient = await readFile(exportClientPath, 'utf8');

if (!exportClient.includes("import { ExportCodePreview } from './ExportCodePreview';")) {
  exportClient = replacePattern(
    exportClient,
    /} from '\.\/export-center-workspace-labels';/,
    `} from './export-center-workspace-labels';\nimport { ExportCodePreview } from './ExportCodePreview';`,
    'ExportCodePreview import',
  );

  exportClient = replacePattern(
    exportClient,
    /type FormatPresentation = \{\n  extension: 'CSS' \| 'TS' \| 'MD';\n  platforms: string\[\];\n};/,
    `type FormatPresentation = {\n  extension: 'CSS' | 'TS' | 'MD';\n  extensionClassName: string;\n  platforms: string[];\n};`,
    'format presentation type',
  );

  exportClient = exportClient.replaceAll(
    `        extension: 'CSS',\n        platforms:`,
    `        extension: 'CSS',\n        extensionClassName:\n          'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',\n        platforms:`,
  );
  exportClient = exportClient.replaceAll(
    `        extension: 'TS',\n        platforms:`,
    `        extension: 'TS',\n        extensionClassName:\n          'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',\n        platforms:`,
  );
  exportClient = exportClient.replaceAll(
    `        extension: 'MD',\n        platforms:`,
    `        extension: 'MD',\n        extensionClassName:\n          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',\n        platforms:`,
  );

  const presentationColorCount =
    (exportClient.match(/extensionClassName:/g) ?? []).length - 1;

  if (presentationColorCount !== 6) {
    throw new Error(
      `Expected six extension colors, received ${presentationColorCount}.`,
    );
  }

  exportClient = replacePattern(
    exportClient,
    /<p className="text-content-secondary mt-2 text-xs font-semibold">\s*\{exportCenterInput\.project\.name}\s*<\/p>/,
    `<p className="text-content-secondary mt-2 text-xs font-semibold xl:hidden">\n              {exportCenterInput.project.name}\n            </p>`,
    'compact-only Exports project context',
  );

  exportClient = replacePattern(
    exportClient,
    /<span className="border-border-subtle bg-background-sunken flex size-9 shrink-0 items-center justify-center rounded-sm border font-mono text-\[0\.6875rem\] font-semibold">\s*\{presentation\.extension}\s*<\/span>/,
    `<span\n                         className={[\n                           'flex size-9 shrink-0 items-center justify-center rounded-sm border font-mono text-[0.6875rem] font-semibold',\n                           presentation.extensionClassName,\n                         ].join(' ')}\n                       >\n                         {presentation.extension}\n                       </span>`,
    'type-colored extension badge',
  );

  exportClient = exportClient.replaceAll(
    `<CopyIcon aria-hidden="true" size={16} weight="bold" />`,
    `<CopyIcon\n                       aria-hidden="true"\n                       size={18}\n                       weight="bold"\n                       className="size-[1.125rem] shrink-0"\n                     />`,
  );
  exportClient = exportClient.replaceAll(
    `className="size-9 px-0"`,
    `className="size-11 px-0"`,
  );
  exportClient = exportClient.replace(
    /<DownloadSimpleIcon\s+aria-hidden="true"\s+size=\{17}\s+weight="bold"\s*\/>/g,
    `<DownloadSimpleIcon\n                       aria-hidden="true"\n                       size={20}\n                       weight="bold"\n                       className="size-5 shrink-0"\n                     />`,
  );

  exportClient = exportClient.replace(
    'border-border-subtle bg-background-sunken min-w-0 border-t xl:flex',
    'border-border-subtle bg-background-app min-w-0 border-t xl:flex',
  );
  exportClient = exportClient.replace(
    'border-border-subtle bg-background-sunken sticky top-0',
    'border-border-default bg-surface-primary sticky top-0',
  );
  exportClient = exportClient.replace(
    'className="min-h-[34rem] min-w-0 flex-1 overflow-auto p-4 font-mono text-xs leading-6 xl:min-h-0"',
    'className="bg-background-sunken min-h-[34rem] min-w-0 flex-1 overflow-auto p-4 font-mono text-xs leading-6 xl:min-h-0"',
  );
  exportClient = replacePattern(
    exportClient,
    /<code>\{selectedOutput\.content}<\/code>/,
    `<ExportCodePreview\n            format={selectedOutput.format}\n            content={selectedOutput.content}\n          />`,
    'syntax-highlighted code preview',
  );
  exportClient = exportClient.replace(
    'border-border-subtle bg-background-sunken grid grid-cols-2 gap-3 border-t',
    'border-border-default bg-surface-primary grid grid-cols-2 gap-3 border-t',
  );

  await writeFile(exportClientPath, exportClient);
}

let documentationClient = await readFile(documentationClientPath, 'utf8');

documentationClient = replacePattern(
  documentationClient,
  /<p className="text-content-secondary mt-3 text-xs font-semibold">\s*\{documentationInput\.project\.name}\s*<\/p>/,
  `<p className="text-content-secondary mt-3 text-xs font-semibold xl:hidden">\n            {documentationInput.project.name}\n          </p>`,
  'compact-only Documentation project context',
);

await writeFile(documentationClientPath, documentationClient);
await unlink(scriptPath);
