import {
  getAiInstructionsFileName,
  getSelectedAiInstructionsSections,
  createDefaultAiInstructionsSectionSelection,
} from './ai-instructions-generator.utils';
import { describe, expect, it } from 'vitest';

describe('ai instructions generator utils', () => {
  it('creates default selected AI instruction sections', () => {
    expect(createDefaultAiInstructionsSectionSelection()).toEqual({
      tokenRules: true,
      componentRules: true,
      accessibilityRules: true,
      forbiddenPatterns: true,
    });
  });

  it('returns selected sections only', () => {
    expect(
      getSelectedAiInstructionsSections({
        tokenRules: true,
        componentRules: false,
        accessibilityRules: true,
        forbiddenPatterns: false,
      }),
    ).toEqual(['tokenRules', 'accessibilityRules']);
  });

  it('creates an AI instructions filename', () => {
    expect(
      getAiInstructionsFileName({
        projectSlug: 'vulcan-ds',
        locale: 'fr',
      }),
    ).toBe('vulcan-ds-ai-instructions-fr.md');
  });
});
