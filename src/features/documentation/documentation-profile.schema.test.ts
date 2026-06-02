import {
  parseDocumentationProfileContent,
  documentationProfileContentSchema,
  defaultDocumentationProfileContent,
} from './documentation-profile.schema';
import { describe, expect, it } from 'vitest';

describe('documentation profile schema', () => {
  it('accepts valid documentation profile content', () => {
    expect(
      documentationProfileContentSchema.safeParse({
        locale: 'fr',
        sections: ['overview', 'tokens'],
        format: 'markdown',
      }).success,
    ).toBe(true);
  });

  it('rejects empty section selections', () => {
    expect(
      documentationProfileContentSchema.safeParse({
        locale: 'fr',
        sections: [],
        format: 'markdown',
      }).success,
    ).toBe(false);
  });

  it('falls back to default content when persisted content is invalid', () => {
    expect(parseDocumentationProfileContent({ invalid: true })).toEqual(
      defaultDocumentationProfileContent,
    );
  });

  it('returns parsed content when persisted content is valid', () => {
    expect(
      parseDocumentationProfileContent({
        locale: 'fr',
        sections: ['components', 'accessibility'],
        format: 'markdown',
      }),
    ).toEqual({
      locale: 'fr',
      sections: ['components', 'accessibility'],
      format: 'markdown',
    });
  });
});
