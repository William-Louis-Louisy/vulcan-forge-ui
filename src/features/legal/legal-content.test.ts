import { describe, expect, it } from 'vitest';
import { getLegalDocument, LEGAL_LAST_UPDATED } from './legal-content';
import type { LegalPublisher } from './legal-publisher';

const publisher: LegalPublisher = {
  name: 'VulcanForge UI SAS',
  contactEmail: 'privacy@example.com',
  publicationReady: true,
};

describe('legal content', () => {
  it('keeps a single explicit update date for the legal surfaces', () => {
    expect(LEGAL_LAST_UPDATED).toBe('2026-08-07');
  });

  it('provides localized Terms and Privacy documents', () => {
    expect(
      getLegalDocument({ locale: 'en', kind: 'terms', publisher }).title,
    ).toBe('Terms of Use');
    expect(
      getLegalDocument({ locale: 'fr', kind: 'terms', publisher }).title,
    ).toBe('Conditions d’utilisation');
    expect(
      getLegalDocument({ locale: 'en', kind: 'privacy', publisher }).title,
    ).toBe('Privacy Notice');
    expect(
      getLegalDocument({ locale: 'fr', kind: 'privacy', publisher }).title,
    ).toBe('Politique de confidentialité');
  });

  it('documents the implemented password-check privacy boundary', () => {
    const privacy = getLegalDocument({
      locale: 'en',
      kind: 'privacy',
      publisher,
    });
    const text = privacy.sections
      .flatMap((section) => [
        ...(section.paragraphs ?? []),
        ...(section.items ?? []),
      ])
      .join(' ');

    expect(text).toContain('first five hexadecimal characters');
    expect(text).toContain('30 minutes');
    expect(text).toContain('Resend');
  });

  it('injects configured controller identity and privacy contact', () => {
    const privacy = getLegalDocument({
      locale: 'en',
      kind: 'privacy',
      publisher,
    });
    const controllerText = privacy.sections[0]?.paragraphs?.join(' ');

    expect(controllerText).toContain('VulcanForge UI SAS');
    expect(controllerText).toContain('privacy@example.com');
  });
});
