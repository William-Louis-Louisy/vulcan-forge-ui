import { Link } from '@/i18n/navigation';
import type { ComponentProps } from 'react';

type AppLinkProps = ComponentProps<typeof Link>;

export function AppLink({ scroll = false, ...props }: AppLinkProps) {
  return <Link {...props} scroll={scroll} />;
}
