import { describe, expect, it } from 'vitest';
import { learnMessages } from './learn-messages';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe('learnMessages', () => {
  it('keeps English and French message shapes aligned', () => {
    expect(flattenKeys(learnMessages.en).sort()).toEqual(
      flattenKeys(learnMessages.fr).sort(),
    );
  });

  it('keeps the curriculum aligned with the accepted seven chapters', () => {
    expect(Object.keys(learnMessages.en.LearnPage.curriculum.chapters)).toEqual([
      'designSystems',
      'designTokens',
      'themes',
      'components',
      'accessibility',
      'documentationDelivery',
      'aiReady',
    ]);
  });

  it('keeps Learn concept-first and distinct from Examples', () => {
    expect(learnMessages.en.LearnPage.boundary.learnDescription.toLowerCase()).toContain(
      'concept',
    );
    expect(learnMessages.en.LearnPage.boundary.examplesDescription.toLowerCase()).toContain(
      'product',
    );
    expect(learnMessages.fr.LearnPage.boundary.learnDescription.toLowerCase()).toContain(
      'concept',
    );
  });
});
