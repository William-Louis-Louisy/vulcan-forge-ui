import type { Locale } from '@/i18n/routing';

export function formatPersonalWorkspaceName({
  locale,
  userName,
}: {
  locale: Locale;
  userName: string | null | undefined;
}) {
  const normalizedName = userName?.trim();
  const displayName =
    normalizedName || (locale === 'fr' ? 'Utilisateur' : 'User');

  return locale === 'fr'
    ? `Espace de travail de ${displayName}`
    : `${displayName}'s workspace`;
}
