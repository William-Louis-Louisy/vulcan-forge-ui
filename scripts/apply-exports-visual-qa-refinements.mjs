import { readFile, writeFile, unlink } from 'node:fs/promises';

const exportClientPath = 'src/features/exports/ExportCenterClient.tsx';
const documentationClientPath =
  'src/features/documentation/DocumentationGeneratorClient.tsx';
const scriptPath = 'scripts/apply-exports-visual-qa-refinements.mjs';

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) {
    throw new Error(`Unable to locate ${label}.`);
  }

  return source.replace(before, after);
}

let exportClient = await readFile(exportClientPath, 'utf8');

if (!exportClient.includes("import { ExportCodePreview } from './ExportCodePreview';")) {
  exportClient = replaceOnce(
    exportClient,
    `} from './export-center-workspace-labels';`,
    `} from './export-center-workspace-labels';\nimport { ExportCodePreview } from './ExportCodePreview';`,
    'ExportCodePreview import',
  );

  exportClient = replaceOnce(
    exportClient,
    `type FormatPresentation = {\n  extension: 'CSS' | 'TS' | 'MD';\n  platforms: string[];\n};`,
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

  if ((exportClient.match(/extensionClassName:/g) ?? []).length !== 7) {
    throw new Error('Unable to add all extension presentation colors.');
  }

  exportClient = replaceOnce(
    exportClient,
    `<p className="text-content-secondary mt-2 text-xs font-semibold">\n              {exportCenterInput.project.name}\n            </p>`,
    `<p className="text-content-secondary mt-2 text-xs font-semibold xl:hidden">\n              {exportCenterInput.project.name}\n            </p>`,
    'compact-only Exports project context',
  );

  exportClient = replaceOnce(
    exportClient,
    `<span className="border-border-subtle bg-background-sunken flex size-9 shrink-0 items-center justify-center rounded-sm border font-mono text-[0.6875rem] font-semibold">\n                         {presentation.extension}\n                       </span>`,
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

  exportClient = exportClient.replaceAll(
    `<DownloadSimpleIcon\n                       aria-hidden="true"\n                       size={17}\n                       weight="bold"\n                     />`,
    `<DownloadSimpleIcon\n                       aria-hidden="true"\n                       size={20}\n                       weight="bold"\n                       className="size-5 shrink-0"\n                     />`,
  );
  exportClient = exportClient.replaceAll(
    `<DownloadSimpleIcon aria-hidden="true" size={17} weight="bold" />`,
    `<DownloadSimpleIcon\n                 aria-hidden="true"\n                 size={20}\n                 weight="bold"\n                 className="size-5 shrink-0"\n               />`,
  );

  exportClient = replaceOnce(
    exportClient,
    `className="border-border-subtle bg-background-sunken min-w-0 border-t xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-t-0 xl:border-l"`,
    `className="border-border-subtle bg-background-app min-w-0 border-t xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-t-0 xl:border-l"`,
    'preview rail background',
  );
  exportClient = replaceOnce(
    exportClient,
    `className="border-border-subtle bg-background-sunken sticky top-0 z-10 flex min-w-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between"`,
    `className="border-border-default bg-surface-primary sticky top-0 z-10 flex min-w-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between"`,
    'preview rail header hierarchy',
  );
  exportClient = replaceOnce(
    exportClient,
    `className="min-h-[34rem] min-w-0 flex-1 overflow-auto p-4 font-mono text-xs leading-6 xl:min-h-0"`,
    `className="bg-background-sunken min-h-[34rem] min-w-0 flex-1 overflow-auto p-4 font-mono text-xs leading-6 xl:min-h-0"`,
    'preview code surface',
  );
  exportClient = replaceOnce(
    exportClient,
    `<code>{selectedOutput.content}</code>`,
    `<ExportCodePreview\n            format={selectedOutput.format}\n            content={selectedOutput.content}\n          />`,
    'syntax-highlighted code preview',
  );
  exportClient = replaceOnce(
    exportClient,
    `className="border-border-subtle bg-background-sunken grid grid-cols-2 gap-3 border-t p-4 text-xs sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4"`,
    `className="border-border-default bg-surface-primary grid grid-cols-2 gap-3 border-t p-4 text-xs sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4"`,
    'preview rail footer hierarchy',
  );

  await writeFile(exportClientPath, exportClient);
}

let documentationClient = await readFile(documentationClientPath, 'utf8');

documentationClient = replaceOnce(
  documentationClient,
  `<p className="text-content-secondary mt-3 text-xs font-semibold">\n            {documentationInput.project.name}\n          </p>`,
  `<p className="text-content-secondary mt-3 text-xs font-semibold xl:hidden">\n            {documentationInput.project.name}\n          </p>`,
  'compact-only Documentation project context',
);

await writeFile(documentationClientPath, documentationClient);
await unlink(scriptPath);
