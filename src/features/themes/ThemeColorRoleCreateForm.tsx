'use client';

import { Button, Input, Select } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useActionState, useMemo, useState } from 'react';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import type { ThemeColorTokenOption } from './themes-editor.utils';
import { createThemeColorRoleAction } from './create-theme-color-role.action';
import {
  initialCreateThemeColorRoleActionState,
  type CreateThemeColorRoleActionState,
} from './create-theme-color-role.state';

type CreateThemeColorRoleErrorKey = Exclude<
  CreateThemeColorRoleActionState['formError'],
  null
>;

type ThemeColorRoleCreateFormProps = {
  locale: Locale;
  projectSlug: string;
  themeId: string;
  options: ThemeColorTokenOption[];
  labels: {
    title: string;
    description: string;
    open: string;
    cancel: string;
    roleKeyLabel: string;
    roleKeyPlaceholder: string;
    roleKeyHint: string;
    tokenLabel: string;
    tokenPlaceholder: string;
    submit: string;
    submitting: string;
    added: string;
    errors: Record<CreateThemeColorRoleErrorKey, string>;
  };
};

export function ThemeColorRoleCreateForm({
  locale,
  projectSlug,
  themeId,
  options,
  labels,
}: ThemeColorRoleCreateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roleKey, setRoleKey] = useState('');
  const [selectedTokenPath, setSelectedTokenPath] = useState('');
  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CreateThemeColorRoleActionState,
      formData: FormData,
    ) => {
      const nextState = await createThemeColorRoleAction(
        previousState,
        formData,
      );

      if (nextState.status === 'success') {
        setRoleKey('');
        setSelectedTokenPath('');
        setIsOpen(false);
      }

      return nextState;
    },
    initialCreateThemeColorRoleActionState,
  );
  const preserveSaveContext = usePreserveSaveContext(
    `theme-color-role-create:${projectSlug}:${themeId}`,
  );
  const selectOptions = useMemo(
    () =>
      options.map((option) => ({
        value: option.path,
        label: option.label,
        description: option.value,
        swatch: option.value,
      })),
    [options],
  );
  const hasOptions = options.length > 0;
  const roleKeyInputId = `${themeId}-new-theme-role-key`;
  const roleKeyHintId = `${roleKeyInputId}-hint`;
  const tokenSelectId = `${themeId}-new-theme-role-token`;

  return (
    <div
      data-theme-role-create
      className="border-border-subtle border-b px-3 py-3 sm:px-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">{labels.title}</p>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {labels.description}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={isOpen}
          aria-controls={`${themeId}-new-theme-role-form`}
          disabled={!hasOptions || isPending}
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className="shrink-0"
        >
          {isOpen ? labels.cancel : labels.open}
        </Button>
      </div>

      {state.status === 'success' && !isOpen ? (
        <p
          role="status"
          className="text-action-success mt-2 text-xs font-semibold"
        >
          {labels.added}
        </p>
      ) : null}

      {isOpen ? (
        <form
          id={`${themeId}-new-theme-role-form`}
          action={formAction}
          onSubmitCapture={preserveSaveContext}
          className="border-border-subtle bg-background-subtle mt-3 grid gap-3 rounded-md border p-3 lg:grid-cols-[minmax(10rem,0.8fr)_minmax(14rem,1.4fr)_auto] lg:items-end"
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="themeId" value={themeId} />

          <div className="min-w-0">
            <label
              htmlFor={roleKeyInputId}
              className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase"
            >
              {labels.roleKeyLabel}
            </label>
            <Input
              id={roleKeyInputId}
              name="roleKey"
              value={roleKey}
              onChange={(event) => setRoleKey(event.target.value)}
              placeholder={labels.roleKeyPlaceholder}
              aria-describedby={roleKeyHintId}
              autoCapitalize="none"
              autoComplete="off"
              maxLength={64}
              required
              spellCheck={false}
              textMode="technical"
              size="sm"
              className="mt-1"
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor={tokenSelectId}
              className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase"
            >
              {labels.tokenLabel}
            </label>
            <Select
              id={tokenSelectId}
              name="tokenPath"
              value={selectedTokenPath}
              options={selectOptions}
              placeholder={labels.tokenPlaceholder}
              onValueChange={setSelectedTokenPath}
              required
              size="sm"
              textMode="technical"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={isPending || !roleKey.trim() || !selectedTokenPath}
            className="shrink-0"
          >
            {isPending ? labels.submitting : labels.submit}
          </Button>

          <p
            id={roleKeyHintId}
            className="text-content-tertiary text-xs leading-5 lg:col-span-3"
          >
            {labels.roleKeyHint}
          </p>

          {state.formError ? (
            <p
              role="alert"
              className="text-action-danger text-xs font-semibold lg:col-span-3"
            >
              {labels.errors[state.formError]}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
