import type { ReactNode } from 'react';

type ErrorStateTone = 'notFound' | 'unauthorized' | 'forbidden' | 'unexpected';

type ErrorStateProps = {
  code: string;
  title: string;
  description: string;
  eyebrow?: string;
  primaryAction: ReactNode;
  secondaryAction?: ReactNode;
  reference?: string;
  tone?: ErrorStateTone;
  compact?: boolean;
};

const toneClassNames: Record<ErrorStateTone, string> = {
  notFound: 'text-action-accent',
  unauthorized: 'text-action-info',
  forbidden: 'text-action-warning',
  unexpected: 'text-action-danger',
};

export function ErrorState({
  code,
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  reference,
  tone = 'unexpected',
  compact = false,
}: ErrorStateProps) {
  return (
    <section
      className={[
        'border-border-subtle bg-surface-primary text-content-primary relative overflow-hidden border',
        compact ? 'rounded-lg p-6 sm:p-8' : 'rounded-xl p-7 sm:p-10 lg:p-12',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        className="border-border-subtle text-content-tertiary absolute top-0 right-0 flex aspect-square w-24 translate-x-1/4 -translate-y-1/4 items-end justify-start rounded-full border p-5 font-mono text-xs sm:w-32"
      >
        {code}
      </div>

      <div className="relative max-w-2xl">
        <p
          className={[
            'text-xs font-semibold tracking-[0.18em] uppercase',
            toneClassNames[tone],
          ].join(' ')}
        >
          {eyebrow ?? code}
        </p>

        <h1
          className={[
            'mt-4 font-semibold tracking-[-0.035em] text-balance',
            compact ? 'text-3xl' : 'text-4xl sm:text-5xl',
          ].join(' ')}
        >
          {title}
        </h1>

        <p className="text-content-secondary mt-5 max-w-xl text-sm leading-7 sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {primaryAction}
          {secondaryAction}
        </div>

        {reference ? (
          <p className="text-content-tertiary border-border-subtle mt-8 border-t pt-4 font-mono text-xs">
            {reference}
          </p>
        ) : null}
      </div>
    </section>
  );
}
