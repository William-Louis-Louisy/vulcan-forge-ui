import { useActionState } from 'react';
import type { Locale } from '@/i18n/routing';
import type { TokenSetType } from './tokens-editor.utils';
import { updateDesignTokenValueAction } from './update-design-token-value.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { initialUpdateDesignTokenValueActionState } from './update-design-token-value.state';

export type DesignTokenValueEditorLabels = {
  label: string;
  submit: string;
  success: string;
  fieldErrors: Partial<Record<string, string>>;
  formErrors: {
    unauthorized: string;
    projectNotFound: string;
    tokenSetNotFound: string;
    tokenSetMalformed: string;
    tokenValidationFailed: string;
    tokenNotFound: string;
    tokenTypeMismatch: string;
    unexpected: string;
  };
};

type DesignTokenValueEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: TokenSetType;
  tokenPath: string;
  initialValue: string;
  labels: DesignTokenValueEditorLabels;
};

export function DesignTokenValueEditor({
  locale,
  projectSlug,
  tokenSetType,
  tokenPath,
  initialValue,
  labels,
}: DesignTokenValueEditorProps) {
  const [state, formAction, isPending] = useActionState(
    updateDesignTokenValueAction,
    {
      ...initialUpdateDesignTokenValueActionState,
      values: {
        value: initialValue,
      },
    },
  );

  const preserveSaveContext = usePreserveSaveContext(
    `design-token-value:${projectSlug}:${tokenSetType}:${tokenPath}`,
  );

  const valueErrors = state.fieldErrors.value ?? [];

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle bg-surface-primary mt-3 rounded-xl border p-3"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenSetType" value={tokenSetType} />
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <label
        htmlFor={`token-value-${tokenPath}`}
        className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase"
      >
        {labels.label}
      </label>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          id={`token-value-${tokenPath}`}
          name="value"
          defaultValue={state.values.value || initialValue}
          aria-invalid={valueErrors.length > 0}
          className="border-border-default bg-background-subtle text-content-primary min-h-10 min-w-0 flex-1 rounded-lg border px-3 font-mono text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-action-primary text-action-primary-content rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {isPending ? '…' : labels.submit}
        </button>
      </div>

      {valueErrors.length > 0 ? (
        <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
          {valueErrors.map((error) => (
            <li key={error}>{labels.fieldErrors[error] ?? error}</li>
          ))}
        </ul>
      ) : null}

      {state.formError ? (
        <p className="text-action-danger mt-2 text-xs font-semibold">
          {labels.formErrors[state.formError]}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <p className="text-action-success mt-2 text-xs font-semibold">
          {labels.success}
        </p>
      ) : null}
    </form>
  );
}
