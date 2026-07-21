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
  });

  it('formats the generated character count', () => {
    expect(formatDocumentationCharacterCount('{count} characters', 12847)).toBe(
      '12,847 characters',
    );
  });
});
