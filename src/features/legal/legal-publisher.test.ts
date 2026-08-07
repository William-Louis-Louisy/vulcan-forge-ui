import { describe, expect, it } from 'vitest';
import { getLegalPublisher } from './legal-publisher';

describe('getLegalPublisher', () => {
  it('marks publication details ready only when name and contact are configured', () => {
    expect(
      getLegalPublisher({
        LEGAL_OPERATOR_NAME: 'VulcanForge UI SAS',
        LEGAL_CONTACT_EMAIL: 'privacy@example.com',
      }),
    ).toEqual({
      name: 'VulcanForge UI SAS',
      contactEmail: 'privacy@example.com',
      publicationReady: true,
    });
  });

  it('uses a transparent non-ready fallback instead of inventing contact details', () => {
    expect(
      getLegalPublisher({
        LEGAL_OPERATOR_NAME: '',
        LEGAL_CONTACT_EMAIL: '',
      }),
    ).toEqual({
      name: 'VulcanForge UI',
      contactEmail: null,
      publicationReady: false,
    });
  });

  it('rejects an invalid configured contact email', () => {
    expect(
      getLegalPublisher({
        LEGAL_OPERATOR_NAME: 'VulcanForge UI',
        LEGAL_CONTACT_EMAIL: 'not-an-email',
      }).publicationReady,
    ).toBe(false);
  });
});
