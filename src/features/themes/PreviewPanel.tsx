'use client';

import { useTranslations } from 'next-intl';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode } from './themes-editor.utils';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  getDefaultPreviewThemeMode,
  type PreviewTheme,
  type PreviewThemeColors,
  type PreviewThemePaletteEntry,
} from './preview-panel.utils';

export type PreviewPanelLabels = {
  title: string;
  description: string;
  modeLabel: string;
  modes: {
    light: string;
    dark: string;
  };
  empty: string;
  components: {
    button: string;
    textField: string;
    card: string;
    alert: string;
  };
  button: {
    primary: string;
    secondary: string;
  };
  textField: {
    label: string;
    placeholder: string;
    helper: string;
  };
  card: {
    title: string;
    description: string;
    cta: string;
  };
  alert: {
    title: string;
    description: string;
  };
};

type PreviewPanelProps = {
  themes: PreviewTheme[];
  labels: PreviewPanelLabels;
  variant?: 'standalone' | 'rail';
};

type PreviewStyle = CSSProperties & {
  '--preview-background': string;
  '--preview-surface': string;
  '--preview-content': string;
  '--preview-muted': string;
  '--preview-accent': string;
  '--preview-accent-content': string;
  '--preview-accent-soft': string;
  '--preview-border': string;
};

function createPreviewStyle(colors: PreviewThemeColors): PreviewStyle {
  return {
    '--preview-background': colors.background,
    '--preview-surface': colors.surface,
    '--preview-content': colors.content,
    '--preview-muted': colors.muted,
    '--preview-accent': colors.accent,
    '--preview-accent-content': colors.accentContent,
    '--preview-accent-soft': colors.accentSoft,
    '--preview-border': colors.border,
  };
}

export function PreviewPanel({
  themes,
  labels,
  variant = 'standalone',
}: PreviewPanelProps) {
  const t = useTranslations('ThemesEditorPage.preview');
  const [activeMode, setActiveMode] = useState<ThemeMode>(() =>
    getDefaultPreviewThemeMode(themes),
  );

  const activeTheme = useMemo(
    () =>
      themes.find((theme) => theme.mode === activeMode) ?? themes[0] ?? null,
    [activeMode, themes],
  );
  const isRail = variant === 'rail';

  if (!activeTheme) {
    return (
      <section
        className={
          isRail
            ? 'border-border-subtle min-w-0 border-b p-4 text-center'
            : 'border-border-default rounded-xl border border-dashed p-8 text-center'
        }
      >
        <h2 className="text-lg font-semibold tracking-tight">{labels.title}</h2>
        <p className="text-content-secondary mx-auto mt-2 max-w-xl text-sm leading-6">
          {labels.empty}
        </p>
      </section>
    );
  }

  const previewStyle = createPreviewStyle(activeTheme.colors);
  const fallbackKeys = activeTheme.fallbackColorKeys
    .map((key) => t(`paletteKeys.${key}`))
    .join(', ');

  return (
    <section
      aria-labelledby="preview-panel-title"
      className={
        isRail
          ? 'border-border-subtle min-w-0 border-b'
          : 'border-border-subtle bg-surface-primary shadow-soft min-w-0 rounded-xl border'
      }
    >
      <header
        data-preview-panel-header
        className="border-border-subtle grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 border-b p-4"
      >
        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('eyebrow')}
          </p>
          <h2
            id="preview-panel-title"
            className="mt-1 text-lg font-semibold tracking-tight"
          >
            {labels.title}
          </h2>
        </div>

        <ThemeSwitcher
          modes={themes.map((theme) => theme.mode)}
          activeMode={activeMode}
          labels={{
            groupLabel: labels.modeLabel,
            modes: labels.modes,
          }}
          onModeChange={setActiveMode}
        />

        <p
          data-preview-panel-description
          className="text-content-secondary col-span-2 text-xs leading-5"
        >
          {labels.description}
        </p>
      </header>

      <div className="grid min-w-0 gap-4 p-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
              {t('activeTheme')}
            </p>
            <p className="mt-1 truncate text-sm font-semibold">
              {activeTheme.name}
            </p>
          </div>

          <div
            aria-live="polite"
            className="text-content-secondary shrink-0 text-right text-[0.6875rem] leading-5"
          >
            <p>
              <span className="text-content-primary font-semibold">
                {activeTheme.resolvedColorCount}/{activeTheme.palette.length}
              </span>{' '}
              {t('mappedColors')}
            </p>
            {activeTheme.fallbackColorKeys.length > 0 ? (
              <p className="text-action-warning font-semibold">
                {activeTheme.fallbackColorKeys.length} {t('fallbackColors')}
              </p>
            ) : null}
          </div>
        </div>

        <section aria-labelledby="preview-palette-title" className="min-w-0">
          <h3
            id="preview-palette-title"
            className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase"
          >
            {t('palette')}
          </h3>

          <div
            className={[
              'mt-2 grid min-w-0 gap-2',
              isRail ? 'grid-cols-2' : 'sm:grid-cols-5',
            ].join(' ')}
          >
            {activeTheme.palette.map((entry) => (
              <PaletteSwatch
                key={entry.key}
                entry={entry}
                label={t(`paletteKeys.${entry.key}`)}
                resolvedLabel={t('resolvedBadge')}
                fallbackLabel={t('fallbackBadge')}
              />
            ))}
          </div>
        </section>

        {activeTheme.fallbackColorKeys.length > 0 ? (
          <p className="border-action-warning/30 bg-action-warning/10 text-action-warning rounded-md border px-3 py-2 text-xs leading-5">
            {t('fallbackNotice', { keys: fallbackKeys })}
          </p>
        ) : null}

        <div
          className="min-w-0 overflow-hidden rounded-lg border border-(--preview-border) bg-(--preview-background) text-(--preview-content) transition-colors"
          style={previewStyle}
        >
          <div className="flex items-center justify-between border-b border-(--preview-border) bg-(--preview-surface) px-3 py-2">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-(--preview-accent)" />
              <span className="size-2 rounded-full border border-(--preview-border)" />
              <span className="size-2 rounded-full border border-(--preview-border)" />
            </div>
            <span className="truncate text-[0.6875rem] font-semibold text-(--preview-muted)">
              {activeTheme.name}
            </span>
          </div>

          <div className="grid min-w-0 gap-3 p-3">
            <PreviewBlock title={labels.components.button}>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-md bg-(--preview-accent) px-3 py-2 text-xs font-semibold text-(--preview-accent-content) shadow-sm"
                >
                  {labels.button.primary}
                </button>

                <button
                  type="button"
                  className="rounded-md border border-(--preview-accent) bg-(--preview-surface) px-3 py-2 text-xs font-semibold text-(--preview-accent)"
                >
                  {labels.button.secondary}
                </button>
              </div>
            </PreviewBlock>

            <PreviewBlock title={labels.components.textField}>
              <label
                htmlFor="preview-text-field"
                className="text-xs font-semibold text-(--preview-content)"
              >
                {labels.textField.label}
              </label>
              <input
                id="preview-text-field"
                readOnly
                value={labels.textField.placeholder}
                className="mt-1.5 min-h-9 w-full min-w-0 rounded-md border border-(--preview-border) bg-(--preview-background) px-2.5 text-xs text-(--preview-content) outline-none"
              />
              <p className="mt-1.5 text-[0.6875rem] leading-4 text-(--preview-muted)">
                {labels.textField.helper}
              </p>
            </PreviewBlock>

            <PreviewBlock title={labels.components.card}>
              <article className="rounded-md border border-(--preview-border) bg-(--preview-background) p-3">
                <h3 className="text-sm font-semibold tracking-tight text-(--preview-content)">
                  {labels.card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-(--preview-muted)">
                  {labels.card.description}
                </p>
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-(--preview-accent)"
                >
                  {labels.card.cta}
                </button>
              </article>
            </PreviewBlock>

            <PreviewBlock title={labels.components.alert}>
              <div
                role="status"
                className="rounded-md border border-(--preview-accent) bg-(--preview-accent-soft) p-3"
              >
                <h3 className="text-xs font-semibold text-(--preview-content)">
                  {labels.alert.title}
                </h3>
                <p className="mt-1 text-[0.6875rem] leading-4 text-(--preview-muted)">
                  {labels.alert.description}
                </p>
              </div>
            </PreviewBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaletteSwatch({
  entry,
  label,
  resolvedLabel,
  fallbackLabel,
}: {
  entry: PreviewThemePaletteEntry;
  label: string;
  resolvedLabel: string;
  fallbackLabel: string;
}) {
  const statusLabel =
    entry.status === 'resolved' ? resolvedLabel : fallbackLabel;

  return (
    <div
      className="border-border-subtle bg-background-subtle min-w-0 rounded-md border p-2"
      aria-label={`${label}: ${entry.value} (${statusLabel})`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className={[
            'size-5 shrink-0 rounded-sm border',
            entry.status === 'fallback'
              ? 'border-action-warning border-dashed'
              : 'border-border-subtle',
          ].join(' ')}
          style={{ backgroundColor: entry.value }}
        />
        <div className="min-w-0">
          <p className="truncate text-[0.6875rem] font-semibold">{label}</p>
          <p
            className={[
              'truncate text-[0.625rem]',
              entry.status === 'fallback'
                ? 'text-action-warning'
                : 'text-content-tertiary',
            ].join(' ')}
          >
            {statusLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-md border border-(--preview-border) bg-(--preview-surface) p-3">
      <h3 className="mb-2.5 text-[0.625rem] font-semibold tracking-[0.14em] text-(--preview-muted) uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}
