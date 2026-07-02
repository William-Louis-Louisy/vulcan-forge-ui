import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'subtle' | 'elevated';
type CardPadding = 'sm' | 'md' | 'lg';

const variantClassNames: Record<CardVariant, string> = {
  default: 'border-border-subtle bg-surface-primary shadow-soft',
  subtle: 'border-border-subtle bg-background-subtle',
  elevated: 'border-border-subtle bg-surface-elevated shadow-elevated',
};

const paddingClassNames: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-md border',
        variantClassNames[variant],
        paddingClassNames[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
