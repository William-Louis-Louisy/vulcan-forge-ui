import type { TextareaHTMLAttributes } from 'react';
import type { InputSize, InputTextMode } from './Input';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  size?: InputSize;
  textMode?: InputTextMode;
};

const sizeClassNames: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-3 py-2.5 text-sm',
};

const textModeClassNames: Record<InputTextMode, string> = {
  default: '',
  technical: 'font-mono',
};

export function Textarea({
  className,
  invalid = false,
  size = 'md',
  textMode = 'default',
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={[
        'border-border-subtle bg-surface-primary text-content-primary placeholder:text-content-tertiary w-full resize-y rounded-md border transition outline-none',
        'hover:border-border-default focus:border-border-focus focus:ring-2 focus:ring-[var(--vf-focus-ring)]',
        'disabled:bg-background-sunken disabled:text-content-tertiary disabled:cursor-not-allowed disabled:opacity-70',
        'read-only:bg-background-subtle read-only:text-content-secondary',
        invalid ? 'border-action-danger focus:border-action-danger' : '',
        sizeClassNames[size],
        textModeClassNames[textMode],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
