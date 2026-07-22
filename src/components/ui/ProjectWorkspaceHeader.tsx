import type { ReactNode } from 'react';

export type ProjectWorkspaceHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  eyebrow?: ReactNode;
  projectName?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  variant?: 'embedded' | 'bar';
  className?: string;
};

export function ProjectWorkspaceHeader({
  title,
  description,
  descriptionClassName,
  eyebrow,
  projectName,
  status,
  actions,
  footer,
  variant = 'embedded',
  className,
}: ProjectWorkspaceHeaderProps) {
  return (
    <header
      data-project-workspace-header
      className={[
        variant === 'bar'
          ? 'border-border-subtle bg-background-app shrink-0 border-b px-4 py-4 md:px-6 xl:px-7 xl:py-5'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
              {eyebrow}
            </p>
          ) : null}

          <div
            className={[
              'flex min-w-0 flex-wrap items-center gap-3',
              eyebrow ? 'mt-1' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <h1 className="text-[26px] font-semibold tracking-[-0.015em]">
              {title}
            </h1>
            {status}
          </div>

          {description ? (
            <p
              className={[
                descriptionClassName ?? 'text-content-tertiary',
                'mt-1 max-w-3xl text-sm leading-6',
              ].join(' ')}
            >
              {description}
            </p>
          ) : null}

          {projectName ? (
            <p className="text-content-secondary mt-2 text-xs font-semibold xl:hidden">
              {projectName}
            </p>
          ) : null}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </header>
  );
}
