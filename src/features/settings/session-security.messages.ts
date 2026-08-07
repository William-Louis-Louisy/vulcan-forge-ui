import type { Locale } from '@/i18n/routing';

type SessionSecurityMessages = {
  action: string;
  description: string;
  error: string;
  pending: string;
  summary: string;
  title: string;
};

const messages: Record<Locale, SessionSecurityMessages> = {
  en: {
    action: 'Sign out everywhere',
    description:
      'Manage the lifetime and revocation of your authenticated sessions.',
    error: "We couldn't revoke every session. Try again.",
    pending: 'Signing out...',
    summary:
      'Sessions expire automatically after seven days. Signing out everywhere immediately invalidates every active session, including this one.',
    title: 'Sessions',
  },
  fr: {
    action: 'Déconnecter tous les appareils',
    description:
      'Gérez la durée et la révocation de vos sessions authentifiées.',
    error: 'Impossible de révoquer toutes les sessions. Réessayez.',
    pending: 'Déconnexion...',
    summary:
      'Les sessions expirent automatiquement après sept jours. Déconnecter tous les appareils invalide immédiatement toutes les sessions actives, y compris celle-ci.',
    title: 'Sessions',
  },
};

export function getSessionSecurityMessages(locale: Locale) {
  return messages[locale];
}
