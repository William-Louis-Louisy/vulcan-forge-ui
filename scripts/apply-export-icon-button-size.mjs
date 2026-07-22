import { readFile, writeFile, unlink } from 'node:fs/promises';

const clientPath = 'src/features/exports/ExportCenterClient.tsx';
const auditPath = 'docs/product/ds-160-07c-exports-alignment-audit.md';
const scriptPath = 'scripts/apply-export-icon-button-size.mjs';

let client = await readFile(clientPath, 'utf8');
const matches = client.match(/className="size-11 px-0"/g) ?? [];

if (matches.length !== 2) {
  throw new Error(`Expected two 44px icon buttons, received ${matches.length}.`);
}

client = client.replaceAll('className="size-11 px-0"', 'className="size-9 px-0"');
await writeFile(clientPath, client);

let audit = await readFile(auditPath, 'utf8');
audit = audit.replace(
  'icon-only download actions use a `44px` hit area and an explicit `20px` icon size;',
  'icon-only download actions use a compact `36px` control with an explicit `20px` icon size, matching adjacent secondary actions;',
);
await writeFile(auditPath, audit);

await unlink(scriptPath);
