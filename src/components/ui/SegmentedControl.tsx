'use client';

import { useRef, type KeyboardEvent } from 'react';

export type SegmentedControlSemantics = 'selection' | 'tabs';

export type SegmentedControlOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
  id?: string;
  controls?: string;
};

export type SegmentedControlProps<Value extends string = string> = {
  value: Value;
  options: readonly SegmentedControlOption<Value>[];
  onValueChange: (value: Value) => void;
  ariaLabel: string;
  semantics?: SegmentedControlSemantics;
  className?: string;
};

function getNextEnabledIndex<Value extends string>({
  options,
  currentIndex,
  direction,
}: {
  options: readonly SegmentedControlOption<Value>[];
  currentIndex: number;
  direction: 1 | -1;
}) {
  if (options.length === 0) {
    return null;
  }

  for (let offset = 1; offset <= options.length; offset += 1) {
    const candidateIndex =
      (currentIndex + direction * offset + options.length) % options.length;
    const candidate = options[candidateIndex];

    if (candidate && !candidate.disabled) {
      return candidateIndex;
    }
  }

  return null;
}

export function SegmentedControl<Value extends string>({
  value,
  options,
  onValueChange,
  ariaLabel,
  semantics = 'selection',
  className,
}: SegmentedControlProps<Value>) {
  const buttonRefs = useRef<Partial<Record<Value, HTMLButtonElement | null>>>(
    {},
  );
  const isTabs = semantics === 'tabs';

  function selectAndFocus(option: SegmentedControlOption<Value>) {
    onValueChange(option.value);
    buttonRefs.current[option.value]?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    const currentOption = options[currentIndex];

    if (!currentOption) {
      return;
    }

    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = getNextEnabledIndex({
        options,
        currentIndex,
        direction: 1,
      });
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = getNextEnabledIndex({
        options,
        currentIndex,
        direction: -1,
      });
    } else if (event.key === 'Home') {
      nextIndex = options.findIndex((option) => !option.disabled);
    } else if (event.key === 'End') {
      nextIndex = options.findLastIndex((option) => !option.disabled);
    }

    if (nextIndex === null || nextIndex < 0) {
      return;
    }

    const nextOption = options[nextIndex];

    if (!nextOption) {
      return;
    }

    event.preventDefault();
    selectAndFocus(nextOption);
  }

  return (
    <div
      role={isTabs ? 'tablist' : 'group'}
      aria-label={ariaLabel}
      className={[
        'border-border-subtle bg-background-subtle inline-flex w-fit rounded-md border p-1',
        className ?? '',
      ].join(' ')}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonRefs.current[option.value] = element;
            }}
            id={option.id}
            type="button"
            role={isTabs ? 'tab' : undefined}
            aria-selected={isTabs ? isSelected : undefined}
            aria-pressed={isTabs ? undefined : isSelected}
            aria-controls={isTabs ? option.controls : undefined}
            tabIndex={isSelected ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={[
              'focus-visible:outline-border-focus min-h-8 rounded-sm px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              isSelected
                ? 'bg-content-primary text-background-app shadow-soft'
                : 'text-content-secondary hover:bg-background-app hover:text-content-primary',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
