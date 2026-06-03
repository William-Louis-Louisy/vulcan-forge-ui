import {
  exportCenterFormats,
  getExportCenterFileExtension,
} from './export-center.utils';
import { describe, expect, it } from 'vitest';

describe('export center utils', () => {
  it('contains the MVP export formats', () => {
    expect(exportCenterFormats).toEqual([
      'cssVariables',
      'tailwindV4',
      'typescriptTheme',
      'reactNativeTheme',
      'documentationMarkdown',
      'aiInstructions',
    ]);
  });

  it('returns the expected file extension for each format', () => {
    expect(getExportCenterFileExtension('cssVariables')).toBe('css');
    expect(getExportCenterFileExtension('tailwindV4')).toBe('css');
    expect(getExportCenterFileExtension('typescriptTheme')).toBe('ts');
    expect(getExportCenterFileExtension('reactNativeTheme')).toBe('ts');
    expect(getExportCenterFileExtension('documentationMarkdown')).toBe('md');
    expect(getExportCenterFileExtension('aiInstructions')).toBe('md');
  });
});
