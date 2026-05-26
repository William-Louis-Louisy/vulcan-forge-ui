'use client';

import type { ThemeMode } from './themes-editor.utils';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  getDefaultPreviewThemeMode,
  type PreviewTheme,
  type PreviewThemeColors,
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
};

type PreviewStyle = CSSProperties & {
  '--preview-background': string;
  '--preview-surface': string;
  '--preview-content': string;
  '--preview-muted': string;
  '--preview-accent': string;
  '--preview-border': string;
};

function createPreviewStyle(colors: PreviewThemeColors): PreviewStyle {
  return {
    '--preview-background': colors.background,
    '--preview-surface': colors.surface,
    '--preview-content': colors.content,
    '--preview-muted': colors.muted,
    '--preview-accent': colors.accent,
    '--preview-border': colors.border,
  };
}

export function PreviewPanel({ themes, labels }: PreviewPanelProps) {
  const [activeMode, setActiveMode] = useState<ThemeMode>(() =>
    getDefaultPreviewThemeMode(themes),
  );

  const activeTheme = useMemo(
    () =>
      themes.find((theme) => theme.mode === activeMode) ?? themes[0] ?? null,
    [activeMode, themes],
  );

  if (!activeTheme) {
    return (
      <section className="border-border-default rounded-3xl border border-dashed p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {labels.title}
        </h2>
        <p className="text-content-secondary mx-auto mt-3 max-w-xl text-sm leading-6">
          {labels.empty}
        </p>
      </section>
    );
  }

  const previewStyle = createPreviewStyle(activeTheme.colors);

  return (
    <section
      aria-labelledby="preview-panel-title"
      className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5 lg:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            Preview
          </p>
          <h2
            id="preview-panel-title"
            className="mt-2 text-2xl font-semibold tracking-tight"
          >
            {labels.title}
          </h2>
          <p className="text-content-secondary mt-2 max-w-2xl text-sm leading-6">
            {labels.description}
          </p>
        </div>

        <div
          role="group"
          aria-label={labels.modeLabel}
          className="border-border-subtle bg-background-subtle inline-flex rounded-2xl border p-1"
        >
          {themes.map((theme) => {
            const isActive = theme.mode === activeMode;

            return (
              <button
                key={theme.mode}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveMode(theme.mode)}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-action-primary text-action-primary-content'
                    : 'text-content-secondary hover:text-content-primary',
                ].join(' ')}
              >
                {labels.modes[theme.mode]}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-6 rounded-3xl border border-(--preview-border) bg-(--preview-background) p-4 text-(--preview-content) transition-colors sm:p-6"
        style={previewStyle}
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="grid gap-4">
            <PreviewBlock title={labels.components.button}>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-(--preview-accent) px-4 py-2 text-sm font-semibold text-black shadow-sm"
                >
                  {labels.button.primary}
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-(--preview-accent) bg-(--preview-surface) px-4 py-2 text-sm font-semibold text-(--preview-accent)"
                >
                  {labels.button.secondary}
                </button>
              </div>
            </PreviewBlock>

            <PreviewBlock title={labels.components.textField}>
              <label
                htmlFor="preview-text-field"
                className="text-sm font-semibold text-(--preview-content)"
              >
                {labels.textField.label}
              </label>
              <input
                id="preview-text-field"
                readOnly
                value={labels.textField.placeholder}
                className="mt-2 min-h-11 w-full rounded-xl border border-(--preview-border) bg-(--preview-surface) px-3 text-sm text-(--preview-content) outline-none"
              />
              <p className="mt-2 text-xs text-(--preview-muted)">
                {labels.textField.helper}
              </p>
            </PreviewBlock>
          </div>

          <div className="grid gap-4">
            <PreviewBlock title={labels.components.card}>
              <article className="rounded-2xl border border-(--preview-border) bg-(--preview-surface) p-4">
                <h3 className="text-lg font-semibold tracking-tight text-(--preview-content)">
                  {labels.card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--preview-muted)">
                  {labels.card.description}
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-xl bg-(--preview-accent) px-4 py-2 text-sm font-semibold text-black"
                >
                  {labels.card.cta}
                </button>
              </article>
            </PreviewBlock>

            <PreviewBlock title={labels.components.alert}>
              <div
                role="status"
                className="rounded-2xl border border-(--preview-accent) bg-(--preview-accent)/20 p-4"
              >
                <h3 className="text-sm font-semibold text-(--preview-content)">
                  {labels.alert.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--preview-muted)">
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

function PreviewBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--preview-border) bg-(--preview-surface) p-4">
      <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-(--preview-muted) uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}
