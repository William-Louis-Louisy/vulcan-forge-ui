import { describe, expect, it } from 'vitest';
import { getAiInstructionsWorkspaceLabels } from './ai-instructions-workspace-labels';

describe('getAiInstructionsWorkspaceLabels', () => {
  it('returns localized French labels and counts', () => {
    const labels = getAiInstructionsWorkspaceLabels('fr');

    expect(labels.pageTitle).toBe('Instructions IA');
    expect(labels.singleLocaleDescription).toContain('seule langue activée');
    expect(labels.selectedSections(2)).toBe('2 sections');
    expect(labels.characterCount(1)).toBe('1 caractère');
  });

  it('returns localized English labels and counts', () => {
    const labels = getAiInstructionsWorkspaceLabels('en');

    expect(labels.pageTitle).toBe('AI instructions');
    expect(labels.upToDate).toBe('Up to date');
    expect(labels.selectedSections(1)).toBe('1 section');
    expect(labels.characterCount(2)).toBe('2 characters');
  });
});
