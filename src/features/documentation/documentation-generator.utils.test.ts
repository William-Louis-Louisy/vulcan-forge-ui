import { describe, expect, it } from 'vitest';
import {
  createDefaultDocumentationSectionSelection,
  getDocumentationFileName,
  getSelectedDocumentationSections,
} from './documentation-generator.utils';

describe('documentation generator utils', () => {
  it('creates default selected documentation sections', () => {
    expect(createDefaultDocumentationSectionSelection()).toEqual({
      overview: true,
      tokens: true,
      themes: true,
      components: true,
      accessibility: true,
    });
  });

  it('returns selected sections only', () => {
    expect(
      getSelectedDocumentationSections({
        overview: true,
        tokens: false,
        themes: true,
        components: false,
        accessibility: true,
      }),
    ).toEqual(['overview', 'themes', 'accessibility']);
  });

  it('creates a Markdown documentation filename', () => {
    expect(
      getDocumentationFileName({
        projectSlug: 'vulcan-ds',
        locale: 'fr',
      }),
    ).toBe('vulcan-ds-documentation-fr.md');
  });
});
