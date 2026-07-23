'use client';

import { SegmentedControl } from '@/components/ui';
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
    <SegmentedControl<ThemeMode>
      ariaLabel={labels.groupLabel}
      value={activeMode}
      options={modes.map((mode) => ({
        value: mode,
        label: labels.modes[mode],
      }))}
      onValueChange={onModeChange}
    />
  );
}
