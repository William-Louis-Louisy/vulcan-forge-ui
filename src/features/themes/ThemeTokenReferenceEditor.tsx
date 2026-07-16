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
  showNoOptionsMessage?: boolean;
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
  showNoOptionsMessage = true,
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
  const displayedResolvedValue = selectedOption?.value ?? resolvedValue ?? null;
  const displayedReference = selectedTokenPath
    ? `{${selectedTokenPath}}`
    : initialReferencePath
      ? `{${initialReferencePath}}`
      : '—';

  const preserveSaveContext = usePreserveSaveContext(
    `theme-token-reference:${projectSlug}:${themeId}:${colorKey}`,
  );

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      data-theme-mapping-row={colorKey}
      className="border-border-subtle bg-surface-primary min-w-0 rounded-md border px-3 py-3 sm:px-4"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="themeId" value={themeId} />
      <input type="hidden" name="colorKey" value={colorKey} />

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(7rem,0.65fr)_minmax(16rem,1.7fr)_minmax(8rem,0.8fr)_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {labels.slotLabel}
          </p>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="border-border-subtle size-5 shrink-0 rounded-full border"
              style={{
                backgroundColor: displayedResolvedValue ?? 'transparent',
              }}
            />
            <span className="truncate font-mono text-sm font-semibold">
              {colorKey}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <label
            htmlFor={inputId}
            className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase"
          >
            {labels.selectLabel}
          </label>

          <select
            id={inputId}
            name="tokenPath"
            value={selectedTokenPath}
            disabled={!hasOptions}
            onChange={(event) => setSelectedTokenPath(event.target.value)}
            className="border-border-default bg-surface-primary text-content-primary mt-1 min-h-10 w-full min-w-0 rounded-md border px-3 font-mono text-xs"
          >
            <option value="">{labels.placeholder}</option>

            {options.map((option) => (
              <option key={option.path} value={option.path}>
                {option.label} — {option.value}
              </option>
            ))}
          </select>

          <p className="text-content-tertiary mt-1 min-w-0 truncate font-mono text-[0.6875rem]">
            {labels.currentReference}: {displayedReference}
          </p>

          {!hasOptions && showNoOptionsMessage ? (
            <p className="text-action-warning mt-1 text-xs font-semibold">
              {labels.noOptions}
            </p>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {labels.resolvedValue}
          </p>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <span
              role="img"
              aria-label={`${labels.resolvedValue}: ${displayedResolvedValue ?? '—'}`}
              className="border-border-subtle size-5 shrink-0 rounded-full border"
              style={{
                backgroundColor: displayedResolvedValue ?? 'transparent',
              }}
            />
            <span className="text-content-secondary min-w-0 truncate font-mono text-xs">
              {displayedResolvedValue ?? '—'}
            </span>
          </div>

          {legacyDirectValue && !initialReferencePath ? (
            <p className="text-action-warning mt-1 min-w-0 truncate text-[0.6875rem] font-semibold">
              {labels.legacyDirectValue}: {legacyDirectValue}
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 xl:justify-end">
          <span
            className={[
              'shrink-0 rounded-full px-2 py-1 text-[0.6875rem] font-semibold',
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
  );
}
