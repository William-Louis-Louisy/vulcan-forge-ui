import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-action-primary text-action-primary-content hover:bg-action-primary-hover border border-action-primary',
  accent:
    'bg-action-accent text-action-accent-content hover:bg-action-accent-hover border border-action-accent',
  secondary:
    'border border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary',
  ghost:
    'border border-transparent bg-transparent text-content-secondary hover:bg-surface-secondary hover:text-content-primary',
  danger:
    'border border-action-danger bg-action-danger text-action-primary-content hover:bg-action-danger/90',
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: 'min-h-9 rounded-md px-3 py-1.5 text-xs',
  md: 'min-h-10 rounded-md px-4 py-2 text-sm',
  lg: 'min-h-11 rounded-md px-5 py-2.5 text-sm',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex cursor-pointer items-center justify-center font-semibold transition',
        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClassNames[variant],
        sizeClassNames[size],
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
