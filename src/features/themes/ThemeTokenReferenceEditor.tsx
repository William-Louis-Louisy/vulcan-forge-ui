'use client';

import type {
  ThemeColorKey,
  ThemeColorTokenOption,
} from './themes-editor.utils';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useActionState, useMemo, useState } from 'react';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { updateThemeTokenReferenceAction } from './update-theme-token-reference.action';
import { initialUpdateThemeTokenReferenceActionState } from './update-theme-token-reference.state';

type ThemeTokenReferenceEditorProps = {
  locale: Locale;
  projectSlug: string;
  themeId: string;
  colorKey: ThemeColorKey;
  initialReferencePath: string | null;
  legacyDirectValue: string | null;
  resolvedValue: string | null;
  options: ThemeColorTokenOption[];
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
      | 'unexpected',
      string
    >;
  };
};

export function ThemeTokenReferenceEditor({
  locale,
  projectSlug,
  themeId,
  colorKey,
  initialReferencePath,
  legacyDirectValue,
  resolvedValue,
  options,
  labels,
}: ThemeTokenReferenceEditorProps) {
  const [state, formAction, isPending] = useActionState(
    updateThemeTokenReferenceAction,
    initialUpdateThemeTokenReferenceActionState,
  );

  const initialValue = initialReferencePath ?? '';
  const [selectedTokenPath, setSelectedTokenPath] = useState(initialValue);

  const selectedOption = useMemo(
    () => options.find((option) => option.path === selectedTokenPath) ?? null,
    [options, selectedTokenPath],
  );

  const hasUnsavedChanges = selectedTokenPath !== initialValue;
  const hasOptions = options.length > 0;
  const inputId = `${themeId}-${colorKey}-token-reference`;

  const preserveSaveContext = usePreserveSaveContext(
    `theme-token-reference:${projectSlug}:${themeId}:${colorKey}`,
  );

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle bg-background-subtle rounded-2xl border p-4"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="themeId" value={themeId} />
      <input type="hidden" name="colorKey" value={colorKey} />

      <div className="grid gap-4">
        <div>
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
            {labels.slotLabel}
          </p>

          <p className="mt-1 font-mono text-sm font-semibold">{colorKey}</p>
        </div>

        <div>
          <label htmlFor={inputId} className="text-sm font-semibold">
            {labels.selectLabel}
          </label>

          <div className="mt-2 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="border-border-subtle size-6 shrink-0 rounded-full border"
              style={{
                backgroundColor:
                  selectedOption?.value ?? resolvedValue ?? 'transparent',
              }}
            />

            <select
              id={inputId}
              name="tokenPath"
              value={selectedTokenPath}
              disabled={!hasOptions}
              onChange={(event) => setSelectedTokenPath(event.target.value)}
              className="border-border-default bg-surface-primary text-content-primary min-h-11 w-full rounded-lg border px-3 font-mono text-sm"
            >
              <option value="">{labels.placeholder}</option>

              {options.map((option) => (
                <option key={option.path} value={option.path}>
                  {option.label} — {option.value}
                </option>
              ))}
            </select>
          </div>

          {!hasOptions ? (
            <p className="text-action-warning mt-2 text-xs font-semibold">
              {labels.noOptions}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2 text-xs">
          <p className="text-content-secondary">
            {labels.currentReference}:{' '}
            <span className="font-mono">
              {initialReferencePath ? `{${initialReferencePath}}` : '—'}
            </span>
          </p>

          {legacyDirectValue && !initialReferencePath ? (
            <p className="text-action-warning font-semibold">
              {labels.legacyDirectValue}:{' '}
              <span className="font-mono">{legacyDirectValue}</span>
            </p>
          ) : null}

          <p className="text-content-secondary">
            {labels.resolvedValue}:{' '}
            <span className="font-mono">
              {selectedOption?.value ?? resolvedValue ?? '—'}
            </span>
          </p>

          <p
            className={
              hasUnsavedChanges
                ? 'text-action-warning font-semibold'
                : 'text-content-tertiary'
            }
          >
            {hasUnsavedChanges ? labels.unsaved : labels.saved}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending || !hasUnsavedChanges || !selectedTokenPath}
        >
          {isPending ? labels.saving : labels.save}
        </Button>

        {state.status === 'success' ? (
          <p
            role="status"
            className="text-action-success text-xs font-semibold"
          >
            {labels.saved}
          </p>
        ) : null}

        {state.formError ? (
          <p role="alert" className="text-action-danger text-xs font-semibold">
            {labels.errors[state.formError]}
          </p>
        ) : null}
      </div>
    </form>
  );
}
