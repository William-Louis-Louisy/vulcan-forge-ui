'use client';

import { Button } from '@/components/ui';
import {
  initialDeleteComponentContractActionState,
  type ComponentContractMutationError,
} from './component-contract-crud.state';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import { TrashIcon } from '@phosphor-icons/react';
import { useActionState, useEffect, useRef } from 'react';
import type { ComponentContractType } from '@/domain/design-system';
import { deleteComponentContractAction } from './component-contract-crud.actions';

type DeleteComponentLabels = {
  ariaLabel: string;
  title: string;
  description: string;
  cancel: string;
  submit: string;
  submitting: string;
  errors: Record<ComponentContractMutationError, string>;
};

export function DeleteComponentContractButton({
  locale,
  projectSlug,
  componentType,
  labels,
}: {
  locale: Locale;
  projectSlug: string;
  componentType: ComponentContractType;
  labels: DeleteComponentLabels;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteComponentContractAction,
    initialDeleteComponentContractActionState,
  );

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    dialogRef.current?.close();
    router.push(`/app/projects/${projectSlug}/components`);
    router.refresh();
  }, [projectSlug, router, state.status]);

  return (
    <>
      <button
        type="button"
        aria-label={labels.ariaLabel}
        title={labels.ariaLabel}
        onClick={() => dialogRef.current?.showModal()}
        className="border-action-danger/30 text-action-danger hover:bg-action-danger/10 flex shrink-0 items-center justify-center gap-2 rounded-md border px-2.5 py-2 transition sm:gap-3 sm:px-3"
      >
        <TrashIcon aria-hidden="true" size={14} />
        <span className="hidden text-sm font-medium sm:inline">
          {labels.submit}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="border-border-default bg-background-app text-content-primary m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] overflow-y-auto rounded-xl border p-0 shadow-2xl backdrop:bg-overlay-scrim"
      >
        <form action={formAction} className="p-4 sm:p-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="componentType" value={componentType} />

          <h2 className="text-lg font-semibold tracking-tight">
            {labels.title}
          </h2>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.description}
          </p>

          {state.error ? (
            <p
              role="alert"
              className="text-action-danger mt-3 text-xs font-medium"
            >
              {labels.errors[state.error]}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => dialogRef.current?.close()}
              className="w-full sm:w-auto"
            >
              {labels.cancel}
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? labels.submitting : labels.submit}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
