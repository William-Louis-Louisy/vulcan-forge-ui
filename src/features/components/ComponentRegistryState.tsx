import type { HTMLAttributes, ReactNode } from 'react';
import { WorkspaceState } from '@/components/ui';

type ComponentRegistryStateTone = 'default' | 'danger';

export type ComponentRegistryStateProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> & {
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
    <WorkspaceState
      title={title}
      description={description}
      action={action}
      tone={tone}
      width="md"
      headingLevel={3}
      className={['shadow-sm', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
