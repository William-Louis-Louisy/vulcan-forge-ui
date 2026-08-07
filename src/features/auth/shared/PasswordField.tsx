'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui';

type PasswordFieldProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  'aria-describedby' | 'aria-errormessage' | 'id' | 'invalid' | 'type'
> & {
  error?: string | null | undefined;
  help?: ReactNode | undefined;
  hidePasswordLabel: string;
  id: string;
  label: string;
  showPasswordLabel: string;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      className,
      error,
      help,
      hidePasswordLabel,
      id,
      label,
      showPasswordLabel,
      ...inputProps
    },
    forwardedRef,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const helpId = help ? `${id}-help` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy =
      [helpId, errorId].filter(Boolean).join(' ') || undefined;

    useImperativeHandle(
      forwardedRef,
      () => inputRef.current as HTMLInputElement,
    );

    function toggleVisibility() {
      const input = inputRef.current;
      const selectionStart = input?.selectionStart ?? null;
      const selectionEnd = input?.selectionEnd ?? null;

      setIsVisible((current) => !current);

      if (!input) {
        return;
      }

      input.focus();

      if (selectionStart !== null && selectionEnd !== null) {
        input.setSelectionRange(selectionStart, selectionEnd);
      }
    }

    return (
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="relative">
          <Input
            {...inputProps}
            ref={inputRef}
            id={id}
            type={isVisible ? 'text' : 'password'}
            invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-errormessage={errorId}
            className={`mt-2 pr-12 ${className ?? ''}`}
          />
          <button
            type="button"
            aria-controls={id}
            aria-label={isVisible ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={isVisible}
            onClick={toggleVisibility}
            className="border-border-subtle text-content-secondary hover:bg-surface-secondary hover:text-content-primary absolute right-0 bottom-0 flex h-[calc(100%-0.5rem)] w-11 items-center justify-center rounded-r-md border-l transition"
          >
            {isVisible ? (
              <EyeSlashIcon aria-hidden="true" size={18} weight="bold" />
            ) : (
              <EyeIcon aria-hidden="true" size={18} weight="bold" />
            )}
          </button>
        </div>
        {help ? (
          <div id={helpId} className="text-content-tertiary mt-2 text-sm">
            {help}
          </div>
        ) : null}
        {error ? (
          <p id={errorId} className="text-action-danger mt-2 text-sm">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
