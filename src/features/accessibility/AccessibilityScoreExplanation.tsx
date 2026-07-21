'use client';

import { InfoIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { AccessibilityScoreBreakdown } from './accessibility-score';

export type AccessibilityScoreExplanationLabels = {
  trigger: string;
  title: string;
  description: string;
  formula: string;
  baseScore: string;
  criticalIssues: string;
  warningIssues: string;
  totalPenalty: string;
  currentScore: string;
  floorNotice: string;
  disclaimer: string;
  close: string;
};

type AccessibilityScoreExplanationProps = {
  breakdown: AccessibilityScoreBreakdown;
  labels: AccessibilityScoreExplanationLabels;
};

export function AccessibilityScoreExplanation({
  breakdown,
  labels,
}: AccessibilityScoreExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      setIsOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="dialog"
        title={labels.trigger}
        onClick={() => setIsOpen((current) => !current)}
        className="border-border-subtle bg-background-subtle text-content-secondary hover:border-border-strong hover:text-content-primary focus-visible:outline-border-focus inline-flex size-6 items-center justify-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <InfoIcon aria-hidden="true" size={14} weight="bold" />
        <span className="sr-only">{labels.trigger}</span>
      </button>

      {isOpen ? (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="border-border-subtle bg-surface-primary absolute top-8 left-0 z-30 w-[min(21rem,calc(100vw-2rem))] rounded-md border p-4 shadow-lg"
        >
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 id={titleId} className="text-sm font-semibold tracking-tight">
                {labels.title}
              </h3>
              <p className="text-content-secondary mt-1 text-xs leading-5">
                {labels.description}
              </p>
            </div>
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              className="text-content-tertiary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus -m-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <XIcon aria-hidden="true" size={14} weight="bold" />
            </button>
          </header>

          <p className="border-border-subtle bg-background-subtle text-content-secondary mt-3 rounded-sm border px-3 py-2 font-mono text-[0.6875rem] leading-5">
            {labels.formula}
          </p>

          <dl className="mt-3 grid gap-2 text-xs">
            <ScoreBreakdownRow
              label={labels.baseScore}
              value={String(breakdown.baseScore)}
            />
            <ScoreBreakdownRow
              label={labels.criticalIssues}
              value={`−${breakdown.criticalPenalty}`}
            />
            <ScoreBreakdownRow
              label={labels.warningIssues}
              value={`−${breakdown.warningPenalty}`}
            />
            <ScoreBreakdownRow
              label={labels.totalPenalty}
              value={`−${breakdown.totalPenalty}`}
              emphasized
            />
            <ScoreBreakdownRow
              label={labels.currentScore}
              value={`${breakdown.score}/100`}
              emphasized
            />
          </dl>

          {breakdown.isFloored ? (
            <p className="text-action-warning mt-3 text-xs leading-5 font-semibold">
              {labels.floorNotice}
            </p>
          ) : null}

          <p className="text-content-tertiary border-border-subtle mt-3 border-t pt-3 text-xs leading-5">
            {labels.disclaimer}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function ScoreBreakdownRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={[
        'flex items-baseline justify-between gap-4',
        emphasized ? 'text-content-primary font-semibold' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <dt className="text-content-secondary">{label}</dt>
      <dd className="shrink-0 font-mono">{value}</dd>
    </div>
  );
}
