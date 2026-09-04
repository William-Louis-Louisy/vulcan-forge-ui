import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputSize = 'xs' | 'sm' | 'md';
export type InputTextMode = 'default' | 'technical';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  invalid?: boolean;
  size?: InputSize;
  textMode?: InputTextMode;
};

const sizeClassNames: Record<InputSize, string> = {
  xs: 'min-h-7 px-2 py-1 text-xs',
  sm: 'min-h-9 px-3 py-1.5 text-xs',
  md: 'min-h-10 px-3 py-2 text-sm',
};

const textModeClassNames: Record<InputTextMode, string> = {
  default: '',
  technical: 'font-mono',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, size = 'md', textMode = 'default', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={[
        'border-border-subtle bg-surface-primary text-content-primary placeholder:text-content-tertiary w-full rounded-md border transition outline-none',
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
});
