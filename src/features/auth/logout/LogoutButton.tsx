import { useTranslations } from 'next-intl';
import { logoutAction } from './logout.action';

export function LogoutButton() {
  const t = useTranslations('LogoutButton');

  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-content-secondary hover:text-content-primary text-sm font-semibold transition"
      >
        {t('label')}
      </button>
    </form>
  );
}
