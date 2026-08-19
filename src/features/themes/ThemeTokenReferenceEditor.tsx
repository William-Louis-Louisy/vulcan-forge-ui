'use client';

import type { ReactNode } from 'react';
import { useActionState, useMemo, useState } from 'react';
import type { ThemeColorTokenOption } from './themes-editor.utils';
import type { Locale } from '@/i18n/routing';
import { Button, Select } from '@/components/ui';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { updateThemeTokenReferenceAction } from './update-theme-token-reference.action';
import { initialUpdateThemeTokenReferenceActionState } from './update-theme-token-reference.state';

type ThemeTokenReferenceEditorProps = {
  locale: Locale;
  projectSlug: string;
  themeId: string;
  roleKey: string;
  initialReferencePath: string | null;
  legacyDirectValue: string | null;
  resolvedValue: string | null;
  options: ThemeColorTokenOption[];
  showNoOptionsMessage?: boolean;
  secondaryAction?: ReactNode;
  labels: {
    slotLabel: string;
    selectLabel: string;
    placeholder: string;
    currentReference: string;
    resolvedValue: string;
    legacyDirectValue: string;
    save: string;
    saving: string;
    saved: string;
    unsaved: string;
    noOptions: string;
    errors: Record<
      | 'unauthorized'
      | 'invalidPayload'
      | 'themeNotFound'
      | 'invalidTokenReference'
      | 'invalidRoleKey'
      | 'invalidTokenPath'
      | 'themeTokensMalformed'
      | 'unexpected',
      string
    >;
  };
};

export function ThemeTokenReferenceEditor({
  locale,
  projectSlug,
  themeId,
  roleKey,
  initialReferencePath,
  options,
  showNoOptionsMessage = true,
  secondaryAction,
  labels,
}: ThemeTokenReferenceEditorProps) {
  const [state, formAction, isPending] = useActionState(
    updateThemeTokenReferenceAction,
    initialUpdateThemeTokenReferenceActionState,
  );

  const initialValue = initialReferencePath ?? '';
  const [selectedTokenPath, setSelectedTokenPath] = useState(initialValue);

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

  const hasUnsavedChanges = selectedTokenPath !== initialValue;
  const hasOptions = options.length > 0;
  const inputId = `${themeId}-${roleKey}-token-reference`;

  const preserveSaveContext = usePreserveSaveContext(
    `theme-token-reference:${projectSlug}:${themeId}:${roleKey}`,
  );

  return (
    <div
      data-theme-mapping-row={roleKey}
      className="border-border-subtle bg-surface-primary min-w-0 overflow-hidden rounded-md border"
    >
      <form
        action={formAction}
        onSubmitCapture={preserveSaveContext}
        className="px-3 py-3 sm:px-4"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="themeId" value={themeId} />
        <input type="hidden" name="roleKey" value={roleKey} />

        <div
          data-theme-mapping-layout
          className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-[minmax(6rem,0.55fr)_minmax(14rem,1.65fr)_minmax(7rem,0.7fr)_minmax(10.5rem,auto)] 2xl:items-center"
        >
          <div
            data-theme-role={roleKey}
            className="min-w-0 sm:col-start-1 sm:row-start-1"
          >
            <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
              {labels.slotLabel}
            </p>
            <p className="mt-1 truncate font-mono text-sm font-semibold">
              {roleKey}
            </p>
          </div>

          <div className="col-span-2 min-w-0 sm:col-start-2 sm:row-start-1">
            <label
              htmlFor={inputId}
              className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase"
            >
              {labels.selectLabel}
            </label>

            <Select
              id={inputId}
              name="tokenPath"
              value={selectedTokenPath}
              options={selectOptions}
              placeholder={labels.placeholder}
              disabled={!hasOptions}
              onValueChange={setSelectedTokenPath}
              className="mt-1 w-full"
            />

            {!hasOptions && showNoOptionsMessage ? (
              <p className="text-action-warning mt-1 text-xs font-semibold">
                {labels.noOptions}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 items-center justify-between gap-3 sm:col-start-2 sm:row-start-2 2xl:col-start-4 2xl:row-start-1 2xl:min-w-42 2xl:justify-end">
            <span
              className={[
                'shrink-0 rounded-full px-2 py-1 text-[0.6875rem] font-semibold whitespace-nowrap',
                hasUnsavedChanges
                  ? 'bg-action-warning/10 text-action-warning'
                  : 'bg-action-success/10 text-action-success',
              ].join(' ')}
            >
              {hasUnsavedChanges ? labels.unsaved : labels.saved}
            </span>

            <Button
              type="submit"
              size="sm"
              disabled={isPending || !hasUnsavedChanges || !selectedTokenPath}
              className="shrink-0"
            >
              {isPending ? labels.saving : labels.save}
            </Button>
          </div>
        </div>

        {state.status === 'success' ? (
          <p
            role="status"
            className="text-action-success mt-2 text-xs font-semibold"
          >
            {labels.saved}
          </p>
        ) : null}

        {state.formError ? (
          <p
            role="alert"
            className="text-action-danger mt-2 text-xs font-semibold"
          >
            {labels.errors[state.formError]}
          </p>
        ) : null}
      </form>

      {secondaryAction ? (
        <div className="border-border-subtle flex justify-end border-t px-3 py-2 sm:px-4">
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
