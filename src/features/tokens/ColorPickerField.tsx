'use client';

import type { Locale } from '@/i18n/routing';
import { Input } from '@/components/ui';
import { getColorPickerLabels } from './color-picker.labels';
import {
  getColorPickerAlphaPercent,
  getColorPickerRgbValue,
  parseHexColor,
  updateHexColorAlpha,
  updateHexColorRgb,
} from './color-picker.utils';

export type ColorPickerFieldProps = {
  id: string;
  label: string;
  locale: Locale;
  value: string;
  onValueChange: (value: string) => void;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  fallbackValue?: string;
  invalid?: boolean;
  name?: string;
};

export function ColorPickerField({
  id,
  label,
  locale,
  value,
  onValueChange,
  ariaDescribedBy,
  disabled = false,
  fallbackValue = '#000000',
  invalid = false,
  name,
}: ColorPickerFieldProps) {
  const labels = getColorPickerLabels(locale);
  const rgbValue = getColorPickerRgbValue(value, fallbackValue);
  const alphaPercent = getColorPickerAlphaPercent(value, fallbackValue);
  const previewValue = parseHexColor(value) ? value.trim() : fallbackValue;

  return (
    <div className="grid min-w-0 gap-2">
      <label
        htmlFor={id}
        className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
      >
        {label}
      </label>

      <div className="flex min-w-0 items-stretch gap-2">
        <label className="border-border-subtle bg-background-sunken focus-within:border-border-focus focus-within:ring-[var(--vf-focus-ring)] relative flex size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border transition focus-within:ring-2">
          <span
            aria-hidden="true"
            className="absolute inset-1 rounded-sm"
            style={{ backgroundColor: previewValue }}
          />
          <input
            type="color"
            value={rgbValue}
            aria-label={labels.chooseColor}
            disabled={disabled}
            onChange={(event) =>
              onValueChange(
                updateHexColorRgb({
                  currentValue: value,
                  fallbackValue,
                  rgbValue: event.target.value,
                }),
              )
            }
            className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </label>

        <Input
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          invalid={invalid}
          aria-describedby={ariaDescribedBy}
          autoComplete="off"
          spellCheck={false}
          textMode="technical"
          onChange={(event) => onValueChange(event.target.value)}
          className="min-w-0 flex-1 uppercase"
        />
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_3rem] items-center gap-3">
        <label
          htmlFor={`${id}-alpha`}
          className="text-content-secondary text-xs font-semibold"
        >
          {labels.alpha}
        </label>
        <input
          id={`${id}-alpha`}
          type="range"
          min="0"
          max="100"
          step="1"
          value={alphaPercent}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          onChange={(event) =>
            onValueChange(
              updateHexColorAlpha({
                alphaPercent: Number(event.target.value),
                currentValue: value,
                fallbackValue,
              }),
            )
          }
          className="accent-[var(--vf-action-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <output
          htmlFor={`${id}-alpha`}
          className="text-content-secondary text-right font-mono text-xs font-semibold"
        >
          {alphaPercent}%
        </output>
      </div>
    </div>
  );
}
