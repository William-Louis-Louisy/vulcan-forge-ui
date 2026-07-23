import { useTranslations } from 'next-intl';
import { logoutAction } from './logout.action';

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps = {}) {
  const t = useTranslations('LogoutButton');

  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={[
          'text-content-secondary hover:text-content-primary text-sm font-semibold transition',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {t('label')}
      </button>
    </form>
  );
}
