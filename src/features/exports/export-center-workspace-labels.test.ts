import { describe, expect, it } from 'vitest';
import {
  formatExportCharacterCount,
  formatExportFileSize,
  getExportCenterWorkspaceLabels,
} from './export-center-workspace-labels';

describe('export center workspace labels', () => {
  it('returns localized export workspace copy', () => {
    expect(getExportCenterWorkspaceLabels('en').ready).toBe('Ready');
    expect(getExportCenterWorkspaceLabels('fr').ready).toBe('Prêt');
    expect(getExportCenterWorkspaceLabels('fr').allFormatsAvailable).toContain(
      'disponibles',
    );
    expect(getExportCenterWorkspaceLabels('fr').copyFailureLog).toContain(
      'presse-papiers',
    );
  });

  it('formats file size and character count for the selected locale', () => {
    const content = 'x'.repeat(1536);

    expect(formatExportFileSize(content, 'en')).toBe('1.5 KB');
    expect(formatExportFileSize(content, 'fr')).toBe('1,5 KB');
    expect(formatExportCharacterCount('x'.repeat(12847), 'en')).toBe('12,847');
  });
});
