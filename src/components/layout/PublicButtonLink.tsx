import { Link } from '@/i18n/navigation';
import type { ComponentProps } from 'react';

type PublicButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
};

const variantClassNames: Record<
  NonNullable<PublicButtonLinkProps['variant']>,
  string
> = {
  primary:
    'border-action-primary bg-action-primary text-action-primary-content hover:bg-action-primary-hover',
  secondary:
    'border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary',
  ghost:
    'border-transparent bg-transparent text-content-secondary hover:bg-surface-secondary hover:text-content-primary',
  inverse:
    'border-content-inverse bg-content-inverse text-action-secondary hover:bg-content-inverse/90',
};

const sizeClassNames: Record<
  NonNullable<PublicButtonLinkProps['size']>,
  string
> = {
  sm: 'min-h-9 px-3 py-2 text-xs',
  md: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-12 px-5 py-3 text-sm',
};

export function PublicButtonLink({
  className,
  size = 'md',
  variant = 'primary',
  ...props
}: PublicButtonLinkProps) {
  return (
    <Link
      className={[
        'inline-flex items-center justify-center rounded-md border font-semibold transition',
        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        variantClassNames[variant],
        sizeClassNames[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
