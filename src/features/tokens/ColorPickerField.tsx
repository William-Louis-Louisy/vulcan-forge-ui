'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
  CheckIcon,
  CaretUpIcon,
  CaretDownIcon,
  EyedropperIcon,
} from '@phosphor-icons/react';

import {
  hsbToRgb,
  hslToRgb,
  rgbToHsb,
  rgbToHsl,
  parseHexColor,
  formatHexColor,
  resolveHexColor,
  updateHexColorRgb,
  updateHexColorAlpha,
  updateHexColorChannels,
  getColorPickerAlphaPercent,
  type HsbColor,
  type HslColor,
  type ParsedHexColor,
} from './color-picker.utils';
import { Input } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { getColorPickerLabels } from './color-picker.labels';
import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import { useAnchoredTopLayerPopover } from '@/components/interaction/useAnchoredTopLayerPopover';

type ColorPickerMode = 'picker' | 'hsb' | 'hsl' | 'rgb';

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>;
};

type EyeDropperWindow = Window & {
  EyeDropper?: EyeDropperConstructor;
};

type ChannelInputProps = {
  id: string;
  label: string;
  max: number;
  min?: number;
  shortLabel: string;
  value: number;
  onValueChange: (value: number) => void;
};

const pickerModes: ColorPickerMode[] = ['picker', 'hsb', 'hsl', 'rgb'];

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function getRgbKey(
  color: Pick<ParsedHexColor, 'red' | 'green' | 'blue'>,
): string {
  return `${color.red}:${color.green}:${color.blue}`;
}

function subscribeToEyeDropperSupport() {
  return () => undefined;
}

function getEyeDropperSupportSnapshot() {
  return (
    typeof window !== 'undefined' &&
    Boolean((window as EyeDropperWindow).EyeDropper)
  );
}

function getEyeDropperSupportServerSnapshot() {
  return false;
}

function ChannelInput({
  id,
  label,
  max,
  min = 0,
  shortLabel,
  value,
  onValueChange,
}: ChannelInputProps) {
  return (
    <label htmlFor={id} className="grid min-w-0 gap-1.5 text-center">
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        size="sm"
        textMode="technical"
        aria-label={label}
        onChange={(event) => {
          const nextValue = event.currentTarget.valueAsNumber;

          if (!Number.isNaN(nextValue)) {
            onValueChange(clamp(nextValue, min, max));
          }
        }}
        className="px-2 text-center"
      />
      <span className="text-content-secondary text-[10px] font-semibold uppercase">
        {shortLabel}
      </span>
    </label>
  );
}

export type ColorPickerFieldProps = {
  id: string;
  label: string;
  labelAccessory?: ReactNode;
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
  labelAccessory,
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
  const { close, containerRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const saturationBrightnessRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const resolvedColor = resolveHexColor(value, fallbackValue);
  const lastSyncedRgbRef = useRef(getRgbKey(resolvedColor));
  const [hsb, setHsb] = useState<HsbColor>(() => rgbToHsb(resolvedColor));
  const [mode, setMode] = useState<ColorPickerMode>('picker');
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isEyeDropperActive, setIsEyeDropperActive] = useState(false);
  const isEyeDropperSupported = useSyncExternalStore(
    subscribeToEyeDropperSupport,
    getEyeDropperSupportSnapshot,
    getEyeDropperSupportServerSnapshot,
  );
  const hsl = rgbToHsl(resolvedColor);
  const alphaPercent = getColorPickerAlphaPercent(value, fallbackValue);
  const previewValue = parseHexColor(value)
    ? value.trim()
    : formatHexColor(resolvedColor);
  const popoverId = `${id}-picker`;
  const modeMenuId = `${id}-picker-modes`;
  const modeLabels: Record<ColorPickerMode, string> = {
    picker: labels.picker,
    hsb: labels.hsb,
    hsl: labels.hsl,
    rgb: labels.rgb,
  };
  const { placement, popoverStyle } = useAnchoredTopLayerPopover({
    contentKey: `${mode}:${isModeMenuOpen}`,
    isOpen,
    popoverRef,
    triggerRef,
  });

  useEffect(() => {
    const parsedColor = parseHexColor(value);

    if (!parsedColor) {
      return;
    }

    const nextRgbKey = getRgbKey(parsedColor);

    if (nextRgbKey === lastSyncedRgbRef.current) {
      return;
    }

    lastSyncedRgbRef.current = nextRgbKey;
    setHsb(rgbToHsb(parsedColor));
  }, [value]);

  function emitRgb(red: number, green: number, blue: number) {
    lastSyncedRgbRef.current = getRgbKey({ red, green, blue });
    onValueChange(
      updateHexColorChannels({
        currentValue: value,
        fallbackValue,
        red,
        green,
        blue,
      }),
    );
  }

  function updateRgb(red: number, green: number, blue: number) {
    setHsb(rgbToHsb({ red, green, blue }));
    emitRgb(red, green, blue);
  }

  function updateHsb(nextHsb: HsbColor) {
    const nextRgb = hsbToRgb(nextHsb);

    setHsb(nextHsb);
    emitRgb(nextRgb.red, nextRgb.green, nextRgb.blue);
  }

  function updateHsl(nextHsl: HslColor) {
    const nextRgb = hslToRgb(nextHsl);

    setHsb(rgbToHsb(nextRgb));
    emitRgb(nextRgb.red, nextRgb.green, nextRgb.blue);
  }

  function updateSaturationBrightness(clientX: number, clientY: number) {
    const bounds = saturationBrightnessRef.current?.getBoundingClientRect();

    if (!bounds || bounds.width === 0 || bounds.height === 0) {
      return;
    }

    const saturation = Math.round(
      clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100),
    );
    const brightness = Math.round(
      clamp(100 - ((clientY - bounds.top) / bounds.height) * 100, 0, 100),
    );

    updateHsb({
      hue: hsb.hue,
      saturation,
      brightness,
    });
  }

  function handleSaturationBrightnessPointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSaturationBrightness(event.clientX, event.clientY);
  }

  function handleSaturationBrightnessPointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    updateSaturationBrightness(event.clientX, event.clientY);
  }

  function handleSaturationBrightnessKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) {
    const step = event.shiftKey ? 5 : 1;
    let nextSaturation = hsb.saturation;
    let nextBrightness = hsb.brightness;

    switch (event.key) {
      case 'ArrowLeft':
        nextSaturation -= step;
        break;
      case 'ArrowRight':
        nextSaturation += step;
        break;
      case 'ArrowUp':
        nextBrightness += step;
        break;
      case 'ArrowDown':
        nextBrightness -= step;
        break;
      default:
        return;
    }

    event.preventDefault();
    updateHsb({
      hue: hsb.hue,
      saturation: clamp(nextSaturation, 0, 100),
      brightness: clamp(nextBrightness, 0, 100),
    });
  }

  function handlePickerToggle() {
    setIsModeMenuOpen(false);
    toggle();
  }

  async function handleEyeDropper() {
    const EyeDropper = (window as EyeDropperWindow).EyeDropper;

    if (!EyeDropper) {
      return;
    }

    setIsEyeDropperActive(true);

    try {
      const result = await new EyeDropper().open();
      onValueChange(
        updateHexColorRgb({
          currentValue: value,
          fallbackValue,
          rgbValue: result.sRGBHex,
        }),
      );
      setIsModeMenuOpen(false);
      close();
    } catch {
      // Closing the browser eyedropper is an expected cancellation path.
    } finally {
      setIsEyeDropperActive(false);
    }
  }

  const visualPicker = (
    <>
      <div
        role="slider"
        tabIndex={0}
        aria-label={labels.saturationBrightness}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={hsb.saturation}
        aria-valuetext={`${Math.round(hsb.saturation)}% ${labels.saturation}, ${Math.round(hsb.brightness)}% ${labels.brightness}`}
        onKeyDown={handleSaturationBrightnessKeyDown}
        onPointerDown={handleSaturationBrightnessPointerDown}
        onPointerMove={handleSaturationBrightnessPointerMove}
        className="focus-visible:outline-border-focus relative aspect-8/5 w-full cursor-crosshair touch-none overflow-hidden rounded-md shadow-inner focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: `hsl(${hsb.hue} 100% 50%)`,
          backgroundImage:
            'linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, transparent)',
        }}
      >
        <span
          ref={saturationBrightnessRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5"
        >
          <span
            className="border-overlay-content pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 shadow-[0_1px_4px_rgb(0_0_0/0.65)]"
            style={{
              left: `${hsb.saturation}%`,
              top: `${100 - hsb.brightness}%`,
            }}
          />
        </span>
      </div>

      <label className="grid gap-1.5">
        <span className="sr-only">{labels.hue}</span>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={hsb.hue}
          aria-label={labels.hue}
          onChange={(event) =>
            updateHsb({
              ...hsb,
              hue: Number(event.currentTarget.value),
            })
          }
          className="border-overlay-content/80 [&::-moz-range-thumb]:border-overlay-content [&::-webkit-slider-thumb]:border-overlay-content h-4 w-full cursor-pointer appearance-none rounded-full border shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-(--vf-focus-ring) disabled:cursor-not-allowed disabled:opacity-60 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-sm"
          style={{
            background:
              'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          }}
        />
      </label>
    </>
  );

  const modeEditor =
    mode === 'picker' ? (
      <div className="relative">
        <Input
          value={value}
          aria-label={`${label} — ${labels.picker}`}
          autoComplete="off"
          spellCheck={false}
          textMode="technical"
          onChange={(event) => onValueChange(event.currentTarget.value)}
          className="pr-12 uppercase"
        />
        <span
          aria-hidden="true"
          className="border-border-subtle absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-md border"
          style={{ backgroundColor: previewValue }}
        />
      </div>
    ) : mode === 'hsb' ? (
      <div className="grid grid-cols-3 gap-2">
        <ChannelInput
          id={`${id}-hsb-hue`}
          label={labels.hue}
          shortLabel="H"
          max={360}
          value={hsb.hue}
          onValueChange={(hue) => updateHsb({ ...hsb, hue })}
        />
        <ChannelInput
          id={`${id}-hsb-saturation`}
          label={labels.saturation}
          shortLabel="S"
          max={100}
          value={hsb.saturation}
          onValueChange={(saturation) => updateHsb({ ...hsb, saturation })}
        />
        <ChannelInput
          id={`${id}-hsb-brightness`}
          label={labels.brightness}
          shortLabel="B"
          max={100}
          value={hsb.brightness}
          onValueChange={(brightness) => updateHsb({ ...hsb, brightness })}
        />
      </div>
    ) : mode === 'hsl' ? (
      <div className="grid grid-cols-3 gap-2">
        <ChannelInput
          id={`${id}-hsl-hue`}
          label={labels.hue}
          shortLabel="H"
          max={360}
          value={hsl.hue}
          onValueChange={(hue) => updateHsl({ ...hsl, hue })}
        />
        <ChannelInput
          id={`${id}-hsl-saturation`}
          label={labels.saturation}
          shortLabel="S"
          max={100}
          value={hsl.saturation}
          onValueChange={(saturation) => updateHsl({ ...hsl, saturation })}
        />
        <ChannelInput
          id={`${id}-hsl-lightness`}
          label={labels.lightness}
          shortLabel="L"
          max={100}
          value={hsl.lightness}
          onValueChange={(lightness) => updateHsl({ ...hsl, lightness })}
        />
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-2">
        <ChannelInput
          id={`${id}-rgb-red`}
          label={labels.red}
          shortLabel="R"
          max={255}
          value={resolvedColor.red}
          onValueChange={(red) =>
            updateRgb(red, resolvedColor.green, resolvedColor.blue)
          }
        />
        <ChannelInput
          id={`${id}-rgb-green`}
          label={labels.green}
          shortLabel="G"
          max={255}
          value={resolvedColor.green}
          onValueChange={(green) =>
            updateRgb(resolvedColor.red, green, resolvedColor.blue)
          }
        />
        <ChannelInput
          id={`${id}-rgb-blue`}
          label={labels.blue}
          shortLabel="B"
          max={255}
          value={resolvedColor.blue}
          onValueChange={(blue) =>
            updateRgb(resolvedColor.red, resolvedColor.green, blue)
          }
        />
      </div>
    );

  return (
    <div className="grid min-w-0 gap-2">
      <div className="flex items-center gap-1.5">
        <label
          htmlFor={id}
          className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
        >
          {label}
        </label>
        {labelAccessory}
      </div>

      <div ref={containerRef} className="relative min-w-0">
        <div className="flex min-w-0 items-stretch gap-2">
          <button
            ref={triggerRef}
            type="button"
            aria-label={isOpen ? labels.closePicker : labels.openPicker}
            aria-expanded={isOpen}
            aria-controls={popoverId}
            disabled={disabled}
            onClick={handlePickerToggle}
            className={[
              'bg-background-sunken focus-visible:outline-border-focus relative flex size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
              invalid
                ? 'border-action-danger'
                : 'border-border-subtle hover:border-border-default',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className="absolute inset-1 rounded-sm"
              style={{ backgroundColor: previewValue }}
            />
          </button>

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

        {isOpen ? (
          <div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            popover="manual"
            aria-label={labels.pickerDialog}
            data-placement={placement}
            style={popoverStyle}
            className="border-border-subtle bg-surface-primary shadow-elevated fixed z-70 m-0 w-72 max-w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto rounded-xl border p-0"
          >
            {isModeMenuOpen ? (
              <div
                id={modeMenuId}
                role="menu"
                aria-label={labels.selectMode}
                className="grid min-h-66 content-start gap-1 p-3"
              >
                {pickerModes.map((pickerMode) => {
                  const isSelected = pickerMode === mode;

                  return (
                    <button
                      key={pickerMode}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setMode(pickerMode);
                        setIsModeMenuOpen(false);
                      }}
                      className={[
                        'focus-visible:outline-border-focus flex min-h-12 items-center justify-between rounded-lg px-3 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-1',
                        isSelected
                          ? 'bg-action-accent/10 text-action-accent'
                          : 'text-content-primary hover:bg-background-subtle',
                      ].join(' ')}
                    >
                      <span>{modeLabels[pickerMode]}</span>
                      {isSelected ? (
                        <CheckIcon aria-hidden="true" size={18} weight="bold" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-4 p-4">
                {visualPicker}
                {modeEditor}
              </div>
            )}

            <div className="border-border-subtle flex items-center gap-2 border-t px-3 py-2.5">
              <button
                type="button"
                aria-label={labels.selectMode}
                aria-expanded={isModeMenuOpen}
                aria-controls={modeMenuId}
                onClick={() => setIsModeMenuOpen((current) => !current)}
                className="text-content-primary hover:bg-background-subtle focus-visible:outline-border-focus flex min-h-10 flex-1 items-center justify-between rounded-lg px-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-1"
              >
                <span>{modeLabels[mode]}</span>
                {isModeMenuOpen ? (
                  <CaretUpIcon aria-hidden="true" size={18} />
                ) : (
                  <CaretDownIcon aria-hidden="true" size={18} />
                )}
              </button>

              <button
                type="button"
                aria-label={labels.eyedropper}
                title={
                  isEyeDropperSupported
                    ? labels.eyedropper
                    : labels.eyedropperUnavailable
                }
                disabled={!isEyeDropperSupported || isEyeDropperActive}
                onClick={handleEyeDropper}
                className="text-content-primary hover:bg-background-subtle focus-visible:outline-border-focus flex size-10 shrink-0 items-center justify-center rounded-lg transition focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <EyedropperIcon aria-hidden="true" size={20} />
              </button>
            </div>
          </div>
        ) : null}
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
          className="accent-action-accent disabled:cursor-not-allowed disabled:opacity-60"
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
