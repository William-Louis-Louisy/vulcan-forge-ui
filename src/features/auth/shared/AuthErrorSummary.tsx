'use client';

import { useEffect, useRef } from 'react';

export type AuthErrorSummaryItem = {
  fieldId: string;
  message: string;
};

type AuthErrorSummaryProps = {
  focusKey: unknown;
  items: AuthErrorSummaryItem[];
};

export function AuthErrorSummary({ focusKey, items }: AuthErrorSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length > 0) {
      summaryRef.current?.focus();
    }
  }, [focusKey, items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      ref={summaryRef}
      role="alert"
      tabIndex={-1}
      className="border-action-danger/30 bg-action-danger/10 text-action-danger focus-visible:ring-action-danger rounded-md border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={`${item.fieldId}-${item.message}`}>
            <a
              href={`#${item.fieldId}`}
              className="font-medium underline underline-offset-2"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(item.fieldId)?.focus();
              }}
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
