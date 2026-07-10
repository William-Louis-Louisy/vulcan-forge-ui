import type { HTMLAttributes, ReactNode } from 'react';

type ComponentRegistryStateTone = 'default' | 'danger';

const toneClassNames: Record<ComponentRegistryStateTone, string> = {
  default: 'border-border-default bg-surface-primary',
  danger: 'border-action-danger/30 bg-action-danger/10',
};

export type ComponentRegistryStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  action?: ReactNode;
  tone?: ComponentRegistryStateTone;
};

export function ComponentRegistryState({
  title,
  description,
  action,
  tone = 'default',
  className,
  ...props
}: ComponentRegistryStateProps) {
  return (
    <div
      className={[
        'text-content-primary w-full max-w-lg rounded-xl border p-6 text-center shadow-sm',
        toneClassNames[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-content-secondary mx-auto mt-2 max-w-md text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
