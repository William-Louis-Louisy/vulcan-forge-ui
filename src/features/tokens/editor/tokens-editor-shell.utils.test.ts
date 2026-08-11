import { describe, expect, it } from 'vitest';
import type { TokenRowData } from '../tokens-editor.utils';
import {
  getNextSelectedTokenPathAfterDeletion,
  getTokenCreationPathPrefix,
  resolveSelectedToken,
  sortTokenRowsForDisplay,
} from './tokens-editor-shell.utils';

function createRow(
  path: string,
  value: string,
  type = 'spacing',
): TokenRowData {
  return {
    id: path,
    path,
    type,
    value,
    rawValue: value,
    isColorValue: type === 'color' && value.startsWith('#'),
    validationStatus: 'valid',
    errorMessages: [],
  };
}

const rows = [
  createRow('spacing.1', '0.25rem'),
  createRow('spacing.2', '0.5rem'),
  createRow('spacing.4', '1rem'),
];

describe('token creation context', () => {
  it('keeps the selected token namespace and removes only the final path segment', () => {
    expect(getTokenCreationPathPrefix('color.primitive.neutral.500')).toBe(
      'color.primitive.neutral.',
    );
    expect(getTokenCreationPathPrefix('color.semantic.action.primary')).toBe(
      'color.semantic.action.',
    );
    expect(getTokenCreationPathPrefix('typography.body.base')).toBe(
      'typography.body.',
    );
    expect(getTokenCreationPathPrefix('spacing.4')).toBe('spacing.');
  });

  it('returns no prefix when there is no usable parent path', () => {
    expect(getTokenCreationPathPrefix(null)).toBe('');
    expect(getTokenCreationPathPrefix('token')).toBe('');
  });
});

describe('tokens editor selection', () => {
  it('keeps the explicitly selected token even when a search no longer matches it', () => {
    expect(
      resolveSelectedToken({
        activeRows: rows,
        filteredRows: [rows[0]!],
        selectedTokenPath: 'spacing.4',
      })?.path,
    ).toBe('spacing.4');
  });

  it('keeps the renamed token selected while refreshed rows replace the old path', () => {
    const sourcePath = 'spacing.old';
    const targetPath = 'spacing.renamed';
    const pendingRename = {
      currentTokenPath: sourcePath,
      nextTokenPath: targetPath,
    };
    const beforeRename = [
      createRow(sourcePath, '1rem'),
      createRow('spacing.other', '2rem'),
    ];
    const afterRename = [
      createRow(targetPath, '1rem'),
      createRow('spacing.other', '2rem'),
    ];

    expect(
      resolveSelectedToken({
        activeRows: beforeRename,
        filteredRows: beforeRename,
        selectedTokenPath: targetPath,
        pendingRename,
      })?.path,
    ).toBe(sourcePath);

    expect(
      resolveSelectedToken({
        activeRows: afterRename,
        filteredRows: afterRename,
        selectedTokenPath: targetPath,
        pendingRename,
      })?.path,
    ).toBe(targetPath);
  });

  it('orders the default selection exactly like the visible color-token list', () => {
    const unorderedRows = [
      createRow(
        'color.semantic.background.primary',
        '{color.primitive.brand.500}',
        'color',
      ),
      createRow('color.primitive.neutral.100', '#f5f5f5', 'color'),
      createRow('color.primitive.brand.500', '#6366f1', 'color'),
    ];

    expect(
      sortTokenRowsForDisplay(unorderedRows).map((row) => row.path),
    ).toEqual([
      'color.primitive.brand.500',
      'color.primitive.neutral.100',
      'color.semantic.background.primary',
    ]);
  });

  it('selects a stable neighboring token after deletion', () => {
    expect(
      getNextSelectedTokenPathAfterDeletion({
        rows,
        deletedTokenPath: 'spacing.2',
        query: '',
      }),
    ).toBe('spacing.4');
  });

  it('returns null after deleting the final token', () => {
    expect(
      getNextSelectedTokenPathAfterDeletion({
        rows: [rows[0]!],
        deletedTokenPath: 'spacing.1',
        query: '',
      }),
    ).toBeNull();
  });
});
