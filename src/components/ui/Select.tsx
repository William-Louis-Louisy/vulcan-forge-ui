'use client';

import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';

export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
  description?: string;
  swatch?: string;
  disabled?: boolean;
};

export type SelectProps<Value extends string = string> = {
  id: string;
  value: Value | '';
  options: readonly SelectOption<Value>[];
  onValueChange: (value: Value) => void;
  placeholder: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

function getEnabledOptionIndexes<Value extends string>(
  options: readonly SelectOption<Value>[],
) {
  return options.reduce<number[]>((indexes, option, index) => {
    if (!option.disabled) {
      indexes.push(index);
    }

    return indexes;
  }, []);
}

function getInitialActiveIndex<Value extends string>({
  options,
  value,
  enabledIndexes,
}: {
  options: readonly SelectOption<Value>[];
  value: Value | '';
  enabledIndexes: readonly number[];
}) {
  const selectedIndex = options.findIndex((option) => option.value === value);
  return selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1);
}

export function Select<Value extends string>({
  id,
  value,
  options,
  onValueChange,
  placeholder,
  name,
  disabled = false,
  className,
}: SelectProps<Value>) {
  const generatedId = useId().replaceAll(':', '');
  const listboxId = `${id}-${generatedId}-listbox`;
  const { close, containerRef, isOpen, setIsOpen, triggerRef } =
    useDismissiblePopover();
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );
  const enabledIndexes = useMemo(
    () => getEnabledOptionIndexes(options),
    [options],
  );
  const [activeIndex, setActiveIndex] = useState(() =>
    getInitialActiveIndex({ options, value, enabledIndexes }),
  );
  const typeaheadRef = useRef('');
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    const activeOption = document.getElementById(
      `${listboxId}-option-${activeIndex}`,
    );

    activeOption?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, isOpen, listboxId]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current) {
        clearTimeout(typeaheadTimerRef.current);
      }
    },
    [],
  );

  function openWithIndex(index: number) {
    if (disabled || index < 0) {
      return;
    }

    setActiveIndex(index);
    setIsOpen(true);
  }

  function handleTriggerClick() {
    if (isOpen) {
      close();
      return;
    }

    openWithIndex(getInitialActiveIndex({ options, value, enabledIndexes }));
  }

  function moveActiveOption(direction: 1 | -1) {
    if (enabledIndexes.length === 0) {
      return;
    }

    const currentEnabledIndex = enabledIndexes.indexOf(activeIndex);
    const normalizedCurrentIndex = currentEnabledIndex >= 0 ? currentEnabledIndex : 0;
    const nextEnabledIndex =
      (normalizedCurrentIndex + direction + enabledIndexes.length) %
      enabledIndexes.length;
    const nextOptionIndex = enabledIndexes[nextEnabledIndex];

    if (nextOptionIndex !== undefined) {
      setActiveIndex(nextOptionIndex);
    }
  }

  function selectOption(option: SelectOption<Value>) {
    if (option.disabled) {
      return;
    }

    onValueChange(option.value);
    close();
    triggerRef.current?.focus();
  }

  function handleTypeahead(key: string) {
    typeaheadRef.current += key.toLocaleLowerCase();

    if (typeaheadTimerRef.current) {
      clearTimeout(typeaheadTimerRef.current);
    }

    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadRef.current = '';
    }, 500);

    const matchIndex = options.findIndex(
      (option) =>
        !option.disabled &&
        option.label.toLocaleLowerCase().startsWith(typeaheadRef.current),
    );

    if (matchIndex >= 0) {
      setActiveIndex(matchIndex);
      setIsOpen(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!isOpen) {
        openWithIndex(
          getInitialActiveIndex({ options, value, enabledIndexes }),
        );
      } else {
        moveActiveOption(1);
      }

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!isOpen) {
        openWithIndex(
          getInitialActiveIndex({ options, value, enabledIndexes }),
        );
      } else {
        moveActiveOption(-1);
      }

      return;
    }

    if (event.key === 'Home' && isOpen) {
      event.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? -1);
      return;
    }

    if (event.key === 'End' && isOpen) {
      event.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault();
      const activeOption = options[activeIndex];

      if (activeOption) {
        selectOption(activeOption);
      }

      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && !isOpen) {
      event.preventDefault();
      openWithIndex(getInitialActiveIndex({ options, value, enabledIndexes }));
      return;
    }

    if (event.key === 'Tab' && isOpen) {
      close();
      return;
    }

    if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      handleTypeahead(event.key);
    }
  }

  return (
    <div
      ref={containerRef}
      className={['relative min-w-0', className ?? ''].join(' ')}
    >
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        disabled={disabled}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus flex min-h-10 w-full min-w-0 items-center gap-2 rounded-md border px-3 text-left transition hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {selectedOption?.swatch ? (
          <SelectSwatch value={selectedOption.swatch} />
        ) : null}

        <span className="min-w-0 flex-1">
          <span
            className={[
              'block truncate text-xs font-semibold',
              selectedOption ? 'font-mono' : 'text-content-tertiary',
            ].join(' ')}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          {selectedOption?.description ? (
            <span className="text-content-tertiary mt-0.5 block truncate font-mono text-[0.6875rem]">
              {selectedOption.description}
            </span>
          ) : null}
        </span>

        <CaretDownIcon
          aria-hidden="true"
          size={14}
          className={[
            'text-content-tertiary shrink-0 transition-transform',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {isOpen ? (
        <ul
          id={listboxId}
          role="listbox"
          className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-md border p-1"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li key={option.value} role="presentation">
                <button
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  tabIndex={-1}
                  disabled={option.disabled}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                  className={[
                    'flex min-h-11 w-full min-w-0 items-center gap-2 rounded-sm px-2.5 py-2 text-left transition',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isActive
                      ? 'bg-background-subtle text-content-primary'
                      : 'text-content-secondary',
                  ].join(' ')}
                >
                  {option.swatch ? (
                    <SelectSwatch value={option.swatch} />
                  ) : null}

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-xs font-semibold">
                      {option.label}
                    </span>
                    {option.description ? (
                      <span className="text-content-tertiary mt-0.5 block truncate font-mono text-[0.6875rem]">
                        {option.description}
                      </span>
                    ) : null}
                  </span>

                  {isSelected ? (
                    <CheckIcon
                      aria-hidden="true"
                      size={15}
                      weight="bold"
                      className="text-action-success shrink-0"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function SelectSwatch({ value }: { value: string }) {
  return (
    <span
      aria-hidden="true"
      className="border-border-subtle size-5 shrink-0 rounded-sm border shadow-sm"
      style={{ backgroundColor: value }}
    />
  );
}
