import type { HTMLAttributes, ReactNode } from 'react';

type PanelVariant = 'default' | 'subtle' | 'elevated';
type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

const variantClassNames: Record<PanelVariant, string> = {
  default: 'border-border-subtle bg-surface-primary shadow-soft',
  subtle: 'border-border-subtle bg-background-subtle',
  elevated: 'border-border-subtle bg-surface-elevated shadow-elevated',
};

const paddingClassNames: Record<PanelPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: PanelVariant;
  padding?: PanelPadding;
};

export function Panel({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: PanelProps) {
  return (
    <div
      className={[
        'rounded-xl border',
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
