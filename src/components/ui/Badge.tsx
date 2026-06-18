import type { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant =
  | 'default'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'beta';

type BadgeSize = 'sm' | 'md';

const variantClassNames: Record<BadgeVariant, string> = {
  default: 'border-border-subtle bg-background-subtle text-content-tertiary',
  accent: 'border-action-accent/30 bg-action-accent/10 text-action-accent',
  success: 'border-action-success/30 bg-action-success/10 text-action-success',
  warning: 'border-action-warning/30 bg-action-warning/10 text-action-warning',
  danger: 'border-action-danger/30 bg-action-danger/10 text-action-danger',
  info: 'border-action-info/30 bg-action-info/10 text-action-info',
  beta: 'border-content-primary bg-content-primary text-content-inverse',
};

const sizeClassNames: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex w-fit items-center rounded-full border font-semibold whitespace-nowrap',
        variantClassNames[variant],
        sizeClassNames[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
