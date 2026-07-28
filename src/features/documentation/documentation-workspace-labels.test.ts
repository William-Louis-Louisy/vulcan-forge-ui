import { describe, expect, it } from 'vitest';
import {
  formatDocumentationCharacterCount,
  getDocumentationWorkspaceLabels,
} from './documentation-workspace-labels';

describe('documentation workspace labels', () => {
  it('returns localized preview controls', () => {
    expect(getDocumentationWorkspaceLabels('en').rendered).toBe('Rendered');
    expect(getDocumentationWorkspaceLabels('fr').rendered).toBe('Rendu');
    expect(getDocumentationWorkspaceLabels('fr').generate).toBe('Générer');
    expect(
      getDocumentationWorkspaceLabels('fr').singleLocaleDescription,
    ).toContain('seule langue activée');
  });

  it('formats the generated character count with the runtime number locale', () => {
    const formattedCount = new Intl.NumberFormat().format(12847);

    expect(formatDocumentationCharacterCount('{count} characters', 12847)).toBe(
      `${formattedCount} characters`,
    );
  });
});
