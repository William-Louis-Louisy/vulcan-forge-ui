import { describe, expect, it } from 'vitest';
import type { TokenRowData } from '../tokens-editor.utils';
import {
  getNextSelectedTokenPathAfterDeletion,
  resolveSelectedToken,
} from './tokens-editor-shell.utils';

function createRow(path: string, value: string): TokenRowData {
  return {
    id: path,
    path,
    type: 'spacing',
    value,
    rawValue: value,
    isColorValue: false,
    validationStatus: 'valid',
    errorMessages: [],
  };
}

const rows = [
  createRow('spacing.1', '0.25rem'),
  createRow('spacing.2', '0.5rem'),
  createRow('spacing.4', '1rem'),
];

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
