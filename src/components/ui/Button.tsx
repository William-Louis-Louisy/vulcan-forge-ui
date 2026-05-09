import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  const variantClassName =
    variant === 'primary'
      ? 'bg-action-primary text-action-primary-content hover:bg-action-primary-hover'
      : 'border border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary';

  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition',
        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
