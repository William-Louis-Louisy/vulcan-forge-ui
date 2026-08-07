export type LegalPublisher = {
  name: string;
  contactEmail: string | null;
  publicationReady: boolean;
};

type LegalPublicationEnvironment = {
  LEGAL_OPERATOR_NAME: string | undefined;
  LEGAL_CONTACT_EMAIL: string | undefined;
};

const FALLBACK_OPERATOR_NAME = 'VulcanForge UI';

function getOptionalTrimmedValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function getLegalContactEmail(value: string | undefined) {
  const email = getOptionalTrimmedValue(value);

  if (!email || !email.includes('@')) {
    return null;
  }

  return email;
}

export function getLegalPublisher(
  environment: LegalPublicationEnvironment = {
    LEGAL_OPERATOR_NAME: process.env.LEGAL_OPERATOR_NAME,
    LEGAL_CONTACT_EMAIL: process.env.LEGAL_CONTACT_EMAIL,
  },
): LegalPublisher {
  const configuredName = getOptionalTrimmedValue(environment.LEGAL_OPERATOR_NAME);
  const contactEmail = getLegalContactEmail(environment.LEGAL_CONTACT_EMAIL);

  return {
    name: configuredName ?? FALLBACK_OPERATOR_NAME,
    contactEmail,
    publicationReady: Boolean(configuredName && contactEmail),
  };
}
