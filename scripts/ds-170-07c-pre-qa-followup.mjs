import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(content, search, replacement, label) {
  if (!content.includes(search)) {
    throw new Error(`${label} not found`);
  }

  return content.replace(search, replacement);
}

const pagePath = 'src/app/[locale]/app/projects/[projectSlug]/page.tsx';
let page = readFileSync(pagePath, 'utf8');
page = replaceOnce(
  page,
  ['  CheckCircleIcon,', '  ClockCounterClockwiseIcon,'].join('\n'),
  ['  CheckCircleIcon,', '  ClockCounterClockwiseIcon,', '  GearIcon,'].join('\n'),
  'overview icon imports',
);
page = replaceOnce(
  page,
  "import type { AppLocale } from '@/domain/i18n';\n",
  '',
  'unused AppLocale import',
);
page = replaceOnce(
  page,
  "import type { ExportLogFormat } from '@/features/exports/export-center.utils';\n",
  '',
  'unused ExportLogFormat import',
);
page = replaceOnce(
  page,
  [
    '        <AppLink',
    '          href={`/app/projects/${overview.project.slug}/documentation`}',
    '          className="border-border-default bg-surface-primary text-content-primary hover:bg-background-subtle inline-flex min-h-9 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"',
    '        >',
    "          {t('project.openDocumentation')}",
    '          <ArrowRightIcon aria-hidden="true" className="ml-1.5" size={13} />',
    '        </AppLink>',
  ].join('\n'),
  [
    '        <div className="flex flex-wrap items-center gap-2">',
    '          <AppLink',
    '            href={`/app/projects/${overview.project.slug}/settings`}',
    '            className="border-border-default bg-surface-primary text-content-primary hover:bg-background-subtle inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"',
    '          >',
    '            <GearIcon aria-hidden="true" className="mr-1.5" size={13} />',
    "            {t('project.settings')}",
    '          </AppLink>',
    '          <AppLink',
    '            href={`/app/projects/${overview.project.slug}/documentation`}',
    '            className="border-border-default bg-surface-primary text-content-primary hover:bg-background-subtle inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"',
    '          >',
    "            {t('project.openDocumentation')}",
    '            <ArrowRightIcon aria-hidden="true" className="ml-1.5" size={13} />',
    '          </AppLink>',
    '        </div>',
  ].join('\n'),
  'overview action block',
);
writeFileSync(pagePath, page);

const messagesPath = 'src/messages/project-overview-messages.ts';
let messages = readFileSync(messagesPath, 'utf8');
messages = replaceOnce(
  messages,
  "        openDocumentation: 'Open documentation',",
  ["        settings: 'Settings',", "        openDocumentation: 'Open documentation',"].join('\n'),
  'English overview settings message',
);
messages = replaceOnce(
  messages,
  "        openDocumentation: 'Ouvrir la documentation',",
  ["        settings: 'Paramètres',", "        openDocumentation: 'Ouvrir la documentation',"].join('\n'),
  'French overview settings message',
);
writeFileSync(messagesPath, messages);

const globalsPath = 'src/app/globals.css';
let globalsCss = readFileSync(globalsPath, 'utf8');
globalsCss = replaceOnce(
  globalsCss,
  '--vf-color-rust-500: #c02121;',
  '--vf-color-rust-500: #FF3131;',
  'Rust 500 token',
);
writeFileSync(globalsPath, globalsCss);

const auditPath = 'scripts/audit-ui.ts';
let audit = readFileSync(auditPath, 'utf8');
audit = replaceOnce(
  audit,
  [
    '    console.log(',
    '      `UI audit passed: ${files.length} production files checked, ${allowlist.length} documented exceptions.`,',
    '    );',
  ].join('\n'),
  [
    '    process.stdout.write(',
    '      `UI audit passed: ${files.length} production files checked, ${allowlist.length} documented exceptions.\\n`,',
    '    );',
  ].join('\n'),
  'UI audit success output',
);
writeFileSync(auditPath, audit);

const documentationPath = 'docs/product/ds-170-07c-project-deletion.md';
let documentation = readFileSync(documentationPath, 'utf8').trimEnd();
if (!documentation.includes('## Pre-QA follow-up')) {
  documentation += [
    '',
    '',
    '## Pre-QA follow-up',
    '',
    'Before product-owner QA, the project Overview now exposes a Settings action with a gear icon immediately before Open documentation. The Rust 500 primitive uses `#ff3131`, and the existing lint warnings from the UI-audit success output and unused overview imports have been removed.',
    '',
  ].join('\n');
}
writeFileSync(documentationPath, documentation);
