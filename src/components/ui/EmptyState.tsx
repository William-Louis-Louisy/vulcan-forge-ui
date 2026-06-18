import type { HTMLAttributes, ReactNode } from 'react';

type EmptyStateTone = 'default' | 'warning' | 'danger';

const toneClassNames: Record<EmptyStateTone, string> = {
  default: 'border-border-default bg-transparent text-content-primary',
  warning: 'border-action-warning/30 bg-action-warning/10 text-content-primary',
  danger: 'border-action-danger/30 bg-action-danger/10 text-content-primary',
};

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  tone?: EmptyStateTone;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  tone = 'default',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={[
        'rounded-3xl border border-dashed p-10 text-center',
        toneClassNames[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon ? (
        <div className="bg-background-subtle text-content-tertiary border-border-subtle mx-auto mb-4 flex size-11 items-center justify-center rounded-2xl border">
          {icon}
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

      {description ? (
        <p className="text-content-secondary mx-auto mt-4 max-w-xl text-sm leading-6">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
