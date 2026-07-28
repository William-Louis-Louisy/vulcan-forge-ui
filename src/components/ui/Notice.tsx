import type { HTMLAttributes, ReactNode } from 'react';

type NoticeTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

const toneClassNames: Record<NoticeTone, string> = {
  default: 'border-border-subtle bg-background-subtle text-content-secondary',
  info: 'border-action-info/30 bg-action-info/10 text-action-info',
  success: 'border-action-success/30 bg-action-success/10 text-action-success',
  warning: 'border-action-warning/30 bg-action-warning/10 text-action-warning',
  danger: 'border-action-danger/30 bg-action-danger/10 text-action-danger',
};

export type NoticeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: NoticeTone;
  title?: string;
};

export function Notice({
  children,
  tone = 'default',
  title,
  className,
  ...props
}: NoticeProps) {
  return (
    <div
      className={[
        'rounded-lg border p-4 text-sm leading-6',
        toneClassNames[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? 'mt-2' : undefined}>{children}</div>
    </div>
  );
}
