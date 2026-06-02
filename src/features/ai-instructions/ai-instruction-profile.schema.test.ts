import {
  parseAiInstructionProfileContent,
  aiInstructionProfileContentSchema,
  defaultAiInstructionProfileContent,
} from './ai-instruction-profile.schema';
import { describe, expect, it } from 'vitest';

describe('ai instruction profile schema', () => {
  it('accepts valid AI instruction profile content', () => {
    expect(
      aiInstructionProfileContentSchema.safeParse({
        locale: 'fr',
        strictness: 'veryStrict',
        sections: ['tokenRules', 'accessibilityRules'],
      }).success,
    ).toBe(true);
  });

  it('accepts empty section selections because anti-hallucination rules remain included', () => {
    expect(
      aiInstructionProfileContentSchema.safeParse({
        locale: 'en',
        strictness: 'strict',
        sections: [],
      }).success,
    ).toBe(true);
  });

  it('rejects invalid strictness values', () => {
    expect(
      aiInstructionProfileContentSchema.safeParse({
        locale: 'en',
        strictness: 'loose',
        sections: ['tokenRules'],
      }).success,
    ).toBe(false);
  });

  it('falls back to default content when persisted content is invalid', () => {
    expect(parseAiInstructionProfileContent({ invalid: true })).toEqual(
      defaultAiInstructionProfileContent,
    );
  });

  it('returns parsed content when persisted content is valid', () => {
    expect(
      parseAiInstructionProfileContent({
        locale: 'fr',
        strictness: 'balanced',
        sections: ['componentRules', 'forbiddenPatterns'],
      }),
    ).toEqual({
      locale: 'fr',
      strictness: 'balanced',
      sections: ['componentRules', 'forbiddenPatterns'],
    });
  });
});
