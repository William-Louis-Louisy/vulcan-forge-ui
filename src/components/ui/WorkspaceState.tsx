import type { HTMLAttributes, ReactNode } from 'react';

export type WorkspaceStateTone = 'default' | 'warning' | 'danger';
export type WorkspaceStateAlignment = 'start' | 'center';
export type WorkspaceStateWidth = 'md' | 'lg' | 'full';

const toneClassNames: Record<WorkspaceStateTone, string> = {
  default: 'border-border-default bg-surface-primary text-content-primary',
  warning:
    'border-action-warning/30 bg-action-warning/10 text-content-primary',
  danger: 'border-action-danger/30 bg-action-danger/10 text-content-primary',
};

const eyebrowClassNames: Record<WorkspaceStateTone, string> = {
  default: 'text-content-tertiary',
  warning: 'text-action-warning',
  danger: 'text-action-danger',
};

const widthClassNames: Record<WorkspaceStateWidth, string> = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  full: 'max-w-none',
};

export type WorkspaceStateProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  eyebrow?: ReactNode;
  tone?: WorkspaceStateTone;
  align?: WorkspaceStateAlignment;
  width?: WorkspaceStateWidth;
  headingLevel?: 1 | 2 | 3;
  dashed?: boolean;
};

export function WorkspaceState({
  title,
  description,
  action,
  icon,
  eyebrow,
  tone = 'default',
  align = 'center',
  width = 'lg',
  headingLevel = 2,
  dashed = false,
  className,
  ...props
}: WorkspaceStateProps) {
  const headingClassName =
    headingLevel === 3
      ? 'text-lg font-semibold tracking-tight'
      : 'text-xl font-semibold tracking-tight sm:text-2xl';
  const heading =
    headingLevel === 1 ? (
      <h1 className={headingClassName}>{title}</h1>
    ) : headingLevel === 3 ? (
      <h3 className={headingClassName}>{title}</h3>
    ) : (
      <h2 className={headingClassName}>{title}</h2>
    );

  return (
    <div
      className={[
        'w-full rounded-md border p-5 sm:p-6',
        toneClassNames[tone],
        widthClassNames[width],
        align === 'center' ? 'text-center' : 'text-left',
        dashed ? 'border-dashed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon ? (
        <div
          className={[
            'border-border-subtle bg-background-subtle mb-4 flex size-10 items-center justify-center rounded-sm border',
            align === 'center' ? 'mx-auto' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {icon}
        </div>
      ) : null}

      {eyebrow ? (
        <p
          className={`${eyebrowClassNames[tone]} mb-2 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase`}
        >
          {eyebrow}
        </p>
      ) : null}

      {heading}

      {description ? (
        <div
          className={[
            'text-content-secondary mt-2 text-sm leading-6',
            align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl',
          ].join(' ')}
        >
          {description}
        </div>
      ) : null}

      {action ? (
        <div
          className={[
            'mt-5 flex',
            align === 'center' ? 'justify-center' : 'justify-start',
          ].join(' ')}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}
