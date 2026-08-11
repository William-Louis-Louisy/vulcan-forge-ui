import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect } from 'react';
import type { DesignTokenType } from '@/domain/design-system';
import { Button, DialogActions, Input, Textarea } from '@/components/ui';
import { createDesignTokenAction } from './create-design-token.action';
import type { CreateDesignTokenFieldError } from './create-design-token.state';
import { initialCreateDesignTokenActionState } from './create-design-token.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

export type CreateDesignTokenFormLabels = {
  title: string;
  description: string;
  pathLabel: string;
  valueLabel: string;
  descriptionEnLabel: string;
  descriptionFrLabel: string;
  submit: string;
  success: string;
  cancel: string;
  valuePlaceholder: string;
  pathPlaceholder: string;
  formErrors: Partial<Record<string, string>>;
  fieldErrors: Partial<Record<CreateDesignTokenFieldError, string>>;
};

type CreateDesignTokenFormProps = {
  locale: Locale;
  projectSlug: string;
  type: DesignTokenType;
  initialPath: string;
  labels: CreateDesignTokenFormLabels;
  onCancel: () => void;
  onCreated?: (tokenPath: string) => void;
};

export function CreateDesignTokenForm({
  locale,
  projectSlug,
  type,
  initialPath,
  labels,
  onCancel,
  onCreated,
}: CreateDesignTokenFormProps) {
  const [state, formAction, isPending] = useActionState(
    createDesignTokenAction,
    initialCreateDesignTokenActionState,
  );

  const preserveSaveContext = usePreserveSaveContext(
    `create-design-token:${projectSlug}:${type}`,
  );

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onCreated?.(state.values.path);
  }, [onCreated, state.status, state.values.path]);
  const pathErrors = state.fieldErrors.path ?? [];
  const valueErrors = state.fieldErrors.value ?? [];

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="bg-surface-primary p-5 sm:p-6"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="type" value={type} />

      <div>
        <h2 className="text-xl font-semibold tracking-tight">{labels.title}</h2>

        <p className="text-content-secondary mt-2 max-w-2xl text-sm leading-6">
          {labels.description}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label
            htmlFor={`create-${type}-token-path`}
            className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
          >
            {labels.pathLabel}
          </label>

          <Input
            id={`create-${type}-token-path`}
            name="path"
            defaultValue={state.values.path || initialPath}
            invalid={pathErrors.length > 0}
            textMode="technical"
            className="mt-2"
            autoFocus
            placeholder={labels.pathPlaceholder}
          />

          {pathErrors.length > 0 ? (
            <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
              {pathErrors.map((error) => (
                <li key={error}>{labels.fieldErrors[error] ?? error}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`create-${type}-token-value`}
            className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
          >
            {labels.valueLabel}
          </label>

          <Input
            id={`create-${type}-token-value`}
            name="value"
            defaultValue={state.values.value}
            invalid={valueErrors.length > 0}
            textMode="technical"
            className="mt-2"
            placeholder={labels.valuePlaceholder}
          />

          {valueErrors.length > 0 ? (
            <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
              {valueErrors.map((error) => (
                <li key={error}>{labels.fieldErrors[error] ?? error}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`create-${type}-token-description-en`}
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionEnLabel}
            </label>

            <Textarea
              id={`create-${type}-token-description-en`}
              name="descriptionEn"
              defaultValue={state.values.descriptionEn}
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <label
              htmlFor={`create-${type}-token-description-fr`}
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionFrLabel}
            </label>

            <Textarea
              id={`create-${type}-token-description-fr`}
              name="descriptionFr"
              defaultValue={state.values.descriptionFr}
              rows={3}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {state.formError ? (
        <p className="text-action-danger mt-4 text-xs font-semibold">
          {labels.formErrors[state.formError] ?? state.formError}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <p className="text-action-success mt-4 text-xs font-semibold">
          {labels.success}
        </p>
      ) : null}

      <DialogActions>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          {labels.cancel}
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? '…' : labels.submit}
        </Button>
      </DialogActions>
    </form>
  );
}
