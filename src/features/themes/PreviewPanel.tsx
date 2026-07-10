'use client';

import { ThemeSwitcher } from './ThemeSwitcher';
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
  variant?: 'standalone' | 'rail';
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

export function PreviewPanel({
  themes,
  labels,
  variant = 'standalone',
}: PreviewPanelProps) {
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
            : 'border-border-default rounded-3xl border border-dashed p-8 text-center'
        }
      >
        <h2
          className={
            isRail
              ? 'text-lg font-semibold tracking-tight'
              : 'text-2xl font-semibold tracking-tight'
          }
        >
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
      className={
        isRail
          ? 'border-border-subtle min-w-0 border-b p-4'
          : 'border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5 lg:p-6'
      }
    >
      <div
        className={
          isRail
            ? 'grid min-w-0 gap-3'
            : 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'
        }
      >
        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            Preview
          </p>
          <h2
            id="preview-panel-title"
            className={
              isRail
                ? 'mt-1 text-lg font-semibold tracking-tight'
                : 'mt-2 text-2xl font-semibold tracking-tight'
            }
          >
            {labels.title}
          </h2>
          <p
            className={[
              'text-content-secondary mt-2 text-sm leading-6',
              isRail ? '' : 'max-w-2xl',
            ].join(' ')}
          >
            {labels.description}
          </p>
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
      </div>

      <div
        className={[
          'border border-(--preview-border) bg-(--preview-background) text-(--preview-content) transition-colors',
          isRail ? 'mt-4 rounded-md p-3' : 'mt-6 rounded-3xl p-4 sm:p-6',
        ].join(' ')}
        style={previewStyle}
      >
        <div
          className={
            isRail
              ? 'grid gap-3'
              : 'grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
          }
        >
          <div className={isRail ? 'grid gap-3' : 'grid gap-4'}>
            <PreviewBlock title={labels.components.button} compact={isRail}>
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

            <PreviewBlock title={labels.components.textField} compact={isRail}>
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
                className="mt-2 min-h-11 w-full min-w-0 rounded-xl border border-(--preview-border) bg-(--preview-surface) px-3 text-sm text-(--preview-content) outline-none"
              />
              <p className="mt-2 text-xs text-(--preview-muted)">
                {labels.textField.helper}
              </p>
            </PreviewBlock>
          </div>

          <div className={isRail ? 'grid gap-3' : 'grid gap-4'}>
            <PreviewBlock title={labels.components.card} compact={isRail}>
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

            <PreviewBlock title={labels.components.alert} compact={isRail}>
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
  compact,
  children,
}: {
  title: string;
  compact: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={[
        'border border-(--preview-border) bg-(--preview-surface)',
        compact ? 'rounded-md p-3' : 'rounded-2xl p-4',
      ].join(' ')}
    >
      <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-(--preview-muted) uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}
