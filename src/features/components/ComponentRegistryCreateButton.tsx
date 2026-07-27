'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { PlusIcon } from '@phosphor-icons/react';
import { Button, Select } from '@/components/ui';
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
  triggerLabel,
}: {
  locale: Locale;
  projectSlug: string;
  options: ComponentTypeOption[];
  labels: CreateComponentLabels;
  triggerLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createComponentContractAction,
    initialCreateComponentContractActionState,
  );
  const [componentType, setComponentType] = useState<
    ComponentContractType | ''
  >(options[0]?.type ?? '');
  const hasAvailableType = options.length > 0;

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

  useEffect(() => {
    if (!componentType && options[0]?.type) {
      setComponentType(options[0].type);
    }
  }, [componentType, options]);

  return (
    <>
      {triggerLabel ? (
        <Button
          type="button"
          size="sm"
          title={labels.ariaLabel}
          onClick={() => dialogRef.current?.showModal()}
        >
          <PlusIcon aria-hidden="true" size={14} weight="bold" />
          <span className="ml-1.5">{triggerLabel}</span>
        </Button>
      ) : (
        <button
          type="button"
          aria-label={labels.ariaLabel}
          title={labels.ariaLabel}
          onClick={() => dialogRef.current?.showModal()}
          className="border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default hover:text-content-primary flex size-8 shrink-0 items-center justify-center rounded-md border transition"
        >
          <PlusIcon aria-hidden="true" size={15} weight="bold" />
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="border-border-default bg-background-app text-content-primary backdrop:bg-overlay-scrim m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] overflow-y-auto rounded-xl border p-0 shadow-2xl"
      >
        <form action={formAction} className="p-4 sm:p-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />

          <h2 className="text-lg font-semibold tracking-tight">
            {labels.title}
          </h2>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {hasAvailableType ? labels.description : labels.unavailable}
          </p>

          {hasAvailableType ? (
            <div className="mt-5 grid min-w-0 gap-1.5">
              <label
                htmlFor="create-component-type"
                className="text-content-secondary text-xs font-semibold"
              >
                {labels.type}
              </label>
              <Select<ComponentContractType>
                id="create-component-type"
                name="componentType"
                value={componentType}
                options={options.map((option) => ({
                  value: option.type,
                  label: option.name,
                }))}
                onValueChange={setComponentType}
                placeholder={labels.type}
                required
              />
            </div>
          ) : null}

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
            {hasAvailableType ? (
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !componentType}
                className="w-full sm:w-auto"
              >
                {isPending ? labels.submitting : labels.submit}
              </Button>
            ) : null}
          </div>
        </form>
      </dialog>
    </>
  );
}
