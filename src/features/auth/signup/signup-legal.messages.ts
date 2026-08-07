import type { Locale } from '@/i18n/routing';

const messages = {
  en: {
    beforeTerms: 'By creating an account, you agree to the',
    terms: 'Terms of Use',
    betweenLinks: 'and acknowledge the',
    privacy: 'Privacy Notice',
  },
  fr: {
    beforeTerms: 'En créant un compte, vous acceptez les',
    terms: "Conditions d’utilisation",
    betweenLinks: 'et reconnaissez avoir pris connaissance de la',
    privacy: 'Politique de confidentialité',
  },
} satisfies Record<
  Locale,
  {
    beforeTerms: string;
    terms: string;
    betweenLinks: string;
    privacy: string;
  }
>;

export function getSignupLegalMessages(locale: Locale) {
  return messages[locale];
}
