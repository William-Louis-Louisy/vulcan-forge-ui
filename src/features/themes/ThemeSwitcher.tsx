'use client';

import type { ThemeMode } from './themes-editor.utils';

export type ThemeSwitcherLabels = {
  groupLabel: string;
  modes: Record<ThemeMode, string>;
};

type ThemeSwitcherProps = {
  modes: ThemeMode[];
  activeMode: ThemeMode;
  labels: ThemeSwitcherLabels;
  onModeChange: (mode: ThemeMode) => void;
};

export function ThemeSwitcher({
  modes,
  activeMode,
  labels,
  onModeChange,
}: ThemeSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={labels.groupLabel}
      className="border-border-subtle bg-background-subtle inline-flex w-fit rounded-md border p-0.5"
    >
      {modes.map((mode) => {
        const isActive = mode === activeMode;

        return (
          <button
            key={mode}
            type="button"
            aria-pressed={isActive}
            onClick={() => onModeChange(mode)}
            className={[
              'min-h-7 rounded-sm px-2.5 text-xs font-semibold transition',
              isActive
                ? 'bg-action-primary text-action-primary-content'
                : 'text-content-secondary hover:bg-background-app hover:text-content-primary',
            ].join(' ')}
          >
            {labels.modes[mode]}
          </button>
        );
      })}
    </div>
  );
}
