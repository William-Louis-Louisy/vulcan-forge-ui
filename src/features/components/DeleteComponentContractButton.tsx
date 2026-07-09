'use client';

import { useActionState, useEffect, useRef } from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import type { ComponentContractType } from '@/domain/design-system';
import { deleteComponentContractAction } from './component-contract-crud.actions';
import {
  initialDeleteComponentContractActionState,
  type ComponentContractMutationError,
} from './component-contract-crud.state';

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
        className="border-action-danger/30 text-action-danger hover:bg-action-danger/10 flex size-8 shrink-0 items-center justify-center rounded-md border transition"
      >
        <TrashIcon aria-hidden="true" size={15} />
      </button>

      <dialog
        ref={dialogRef}
        className="border-border-default bg-background-app text-content-primary m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border p-0 shadow-2xl backdrop:bg-black/60"
      >
        <form action={formAction} className="p-5">
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
            <p role="alert" className="text-action-danger mt-3 text-xs font-medium">
              {labels.errors[state.error]}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => dialogRef.current?.close()}
            >
              {labels.cancel}
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={isPending}
            >
              {isPending ? labels.submitting : labels.submit}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
