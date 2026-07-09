'use client';

import { useActionState, useEffect, useRef } from 'react';
import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import type { ComponentContractType } from '@/domain/design-system';
import { createComponentContractAction } from './component-contract-crud.actions';
import {
  initialCreateComponentContractActionState,
  type ComponentContractMutationError,
} from './component-contract-crud.state';

type ComponentTypeOption = {
  type: ComponentContractType;
  name: string;
};

type CreateComponentLabels = {
  ariaLabel: string;
  unavailable: string;
  title: string;
  description: string;
  type: string;
  cancel: string;
  submit: string;
  submitting: string;
  errors: Record<ComponentContractMutationError, string>;
};

export function ComponentRegistryCreateButton({
  locale,
  projectSlug,
  options,
  labels,
}: {
  locale: Locale;
  projectSlug: string;
  options: ComponentTypeOption[];
  labels: CreateComponentLabels;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createComponentContractAction,
    initialCreateComponentContractActionState,
  );
  const isDisabled = options.length === 0;

  useEffect(() => {
    if (state.status !== 'success' || !state.componentType) {
      return;
    }

    dialogRef.current?.close();
    router.push(
      `/app/projects/${projectSlug}/components?component=${state.componentType}`,
    );
    router.refresh();
  }, [projectSlug, router, state.componentType, state.status]);

  return (
    <>
      <button
        type="button"
        disabled={isDisabled}
        aria-label={labels.ariaLabel}
        title={isDisabled ? labels.unavailable : labels.ariaLabel}
        onClick={() => dialogRef.current?.showModal()}
        className="border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default hover:text-content-primary flex size-8 shrink-0 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-45"
      >
        <PlusIcon aria-hidden="true" size={15} weight="bold" />
      </button>

      <dialog
        ref={dialogRef}
        className="border-border-default bg-background-app text-content-primary m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border p-0 shadow-2xl backdrop:bg-black/60"
      >
        <form action={formAction} className="p-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />

          <h2 className="text-lg font-semibold tracking-tight">
            {labels.title}
          </h2>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.description}
          </p>

          <label className="mt-5 grid gap-1.5">
            <span className="text-content-secondary text-xs font-semibold">
              {labels.type}
            </span>
            <select
              name="componentType"
              required
              defaultValue={options[0]?.type}
              className="border-border-subtle bg-surface-primary focus:border-action-primary min-h-10 rounded-md border px-3 text-sm outline-none"
            >
              {options.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

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
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? labels.submitting : labels.submit}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
