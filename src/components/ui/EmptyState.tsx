import type { HTMLAttributes, ReactNode } from 'react';
import { WorkspaceState, type WorkspaceStateTone } from './WorkspaceState';

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  tone?: WorkspaceStateTone;
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
    <WorkspaceState
      title={title}
      description={description}
      action={action}
      icon={icon}
      tone={tone}
      width="lg"
      dashed
      className={['mx-auto', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
