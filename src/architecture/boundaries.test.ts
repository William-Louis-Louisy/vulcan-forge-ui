import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const srcRoot = path.resolve(process.cwd(), 'src');

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectTypeScriptFiles(entryPath);
    }

    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

function getImportSpecifiers(source: string): string[] {
  const specifiers = new Set<string>();
  const patterns = [
    /\bfrom\s+['"]([^'"]+)['"]/g,
    /\bimport\s+['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];

      if (specifier) {
        specifiers.add(specifier);
      }
    }
  }

  return [...specifiers];
}

function resolveProjectImport(sourceFile: string, specifier: string): string | null {
  if (specifier.startsWith('@/')) {
    return path.resolve(srcRoot, specifier.slice(2));
  }

  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(sourceFile), specifier);
  }

  return null;
}

function isInside(candidate: string, directory: string): boolean {
  const relativePath = path.relative(directory, candidate);

  return (
    relativePath === '' ||
    (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
  );
}

function findForbiddenImports({
  sourceDirectory,
  forbiddenDirectories,
}: {
  sourceDirectory: string;
  forbiddenDirectories: string[];
}): string[] {
  return collectTypeScriptFiles(sourceDirectory).flatMap((sourceFile) => {
    const source = readFileSync(sourceFile, 'utf8');

    return getImportSpecifiers(source).flatMap((specifier) => {
      const target = resolveProjectImport(sourceFile, specifier);

      if (
        !target ||
        !forbiddenDirectories.some((directory) => isInside(target, directory))
      ) {
        return [];
      }

      return [
        `${path.relative(srcRoot, sourceFile)} -> ${specifier}`.replaceAll(
          path.sep,
          '/',
        ),
      ];
    });
  });
}

describe('architecture boundaries', () => {
  it('keeps domain independent from server and features', () => {
    expect(
      findForbiddenImports({
        sourceDirectory: path.join(srcRoot, 'domain'),
        forbiddenDirectories: [
          path.join(srcRoot, 'server'),
          path.join(srcRoot, 'features'),
        ],
      }),
    ).toEqual([]);
  });

  it('keeps server independent from features', () => {
    expect(
      findForbiddenImports({
        sourceDirectory: path.join(srcRoot, 'server'),
        forbiddenDirectories: [path.join(srcRoot, 'features')],
      }),
    ).toEqual([]);
  });

  it('keeps project overview independent from sibling features', () => {
    const projectOverviewDirectory = path.join(
      srcRoot,
      'features',
      'project-overview',
    );
    const featureDirectory = path.join(srcRoot, 'features');
    const violations = collectTypeScriptFiles(projectOverviewDirectory).flatMap(
      (sourceFile) => {
        const source = readFileSync(sourceFile, 'utf8');

        return getImportSpecifiers(source).flatMap((specifier) => {
          const target = resolveProjectImport(sourceFile, specifier);

          if (
            !target ||
            !isInside(target, featureDirectory) ||
            isInside(target, projectOverviewDirectory)
          ) {
            return [];
          }

          return [
            `${path.relative(srcRoot, sourceFile)} -> ${specifier}`.replaceAll(
              path.sep,
              '/',
            ),
          ];
        });
      },
    );

    expect(violations).toEqual([]);
  });
});
