import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect } from 'react';
import { renameTokenAction } from './rename-token.action';
import type { TokenSetType } from './tokens-editor.utils';
import { initialRenameTokenActionState } from './rename-token.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

export type TokenRenameFormLabels = {
  title: string;
  description: string;
  inputLabel: string;
  submit: string;
  success: string;
  fieldErrors: {
    tokenPathRequired: string;
    tokenPathInvalid: string;
  };
  formErrors: {
    unauthorized: string;
    projectNotFound: string;
    tokenSetNotFound: string;
    tokenSetMalformed: string;
    tokenValidationFailed: string;
    tokenNotFound: string;
    tokenPathAlreadyExists: string;
    unexpected: string;
  };
};

type TokenRenameFormProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: TokenSetType;
  currentTokenPath: string;
  labels: TokenRenameFormLabels;
  onRenamed?: (nextTokenPath: string) => void;
};

export function TokenRenameForm({
  locale,
  projectSlug,
  tokenSetType,
  currentTokenPath,
  labels,
  onRenamed,
}: TokenRenameFormProps) {
  const [state, formAction, isPending] = useActionState(renameTokenAction, {
    ...initialRenameTokenActionState,
    values: {
      nextTokenPath: currentTokenPath,
    },
  });

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onRenamed?.(state.values.nextTokenPath);
  }, [onRenamed, state.status, state.values.nextTokenPath]);

  const nextTokenPathErrors = state.fieldErrors.nextTokenPath ?? [];

  const preserveSaveContext = usePreserveSaveContext(
    `rename-token:${projectSlug}:${currentTokenPath}`,
  );

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="mt-5"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenSetType" value={tokenSetType} />
      <input type="hidden" name="currentTokenPath" value={currentTokenPath} />

      <div className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
        <div>
          <p className="text-sm font-semibold">{labels.title}</p>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.description}
          </p>
        </div>

        <label
          htmlFor={`rename-token-${currentTokenPath}`}
          className="text-content-tertiary mt-4 block text-xs font-semibold tracking-[0.16em] uppercase"
        >
          {labels.inputLabel}
        </label>

        <input
          id={`rename-token-${currentTokenPath}`}
          name="nextTokenPath"
          defaultValue={state.values.nextTokenPath || currentTokenPath}
          aria-invalid={nextTokenPathErrors.length > 0}
          className="border-border-subtle bg-surface-primary focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
        />

        {nextTokenPathErrors.length > 0 ? (
          <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
            {nextTokenPathErrors.map((error) => (
              <li key={error}>{labels.fieldErrors[error]}</li>
            ))}
          </ul>
        ) : null}

        {state.formError ? (
          <p className="text-action-danger mt-3 text-xs font-semibold">
            {labels.formErrors[state.formError]}
          </p>
        ) : null}

        {state.status === 'success' ? (
          <p className="text-action-success mt-3 text-xs font-semibold">
            {labels.success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="bg-action-primary text-action-primary-content mt-4 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {isPending ? '…' : labels.submit}
        </button>
      </div>
    </form>
  );
}
