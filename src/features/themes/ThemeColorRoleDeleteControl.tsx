'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { deleteThemeColorRoleAction } from './delete-theme-color-role.action';
import {
  initialDeleteThemeColorRoleActionState,
  type DeleteThemeColorRoleActionState,
} from './delete-theme-color-role.state';

type DeleteThemeColorRoleErrorKey = Exclude<
  DeleteThemeColorRoleActionState['formError'],
  null
>;

type ThemeColorRoleDeleteControlProps = {
  locale: Locale;
  projectSlug: string;
  themeId: string;
  roleKey: string;
  labels: {
    request: string;
    confirmationTitle: string;
    confirmationDescription: string;
    cancel: string;
    delete: string;
    deleting: string;
    errors: Record<DeleteThemeColorRoleErrorKey, string>;
  };
};

export function ThemeColorRoleDeleteControl({
  locale,
  projectSlug,
  themeId,
  roleKey,
  labels,
}: ThemeColorRoleDeleteControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteThemeColorRoleAction,
    initialDeleteThemeColorRoleActionState,
  );
  const preserveSaveContext = usePreserveSaveContext(
    `theme-color-role-delete:${projectSlug}:${themeId}:${roleKey}`,
  );

  useEffect(() => {
    if (state.status === 'success') {
      setIsOpen(false);
    }
  }, [state.status]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        data-theme-role-delete={roleKey}
        onClick={() => setIsOpen(true)}
        className="text-action-danger hover:bg-action-danger/10 hover:text-action-danger"
      >
        {labels.request}
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (!isPending) {
            setIsOpen(false);
          }
        }}
        ariaLabel={labels.confirmationTitle}
      >
        <form
          action={formAction}
          onSubmitCapture={preserveSaveContext}
          className="bg-surface-primary p-5 sm:p-6"
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="themeId" value={themeId} />
          <input type="hidden" name="roleKey" value={roleKey} />

          <h2 className="text-lg font-semibold tracking-tight">
            {labels.confirmationTitle}
          </h2>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.confirmationDescription}
          </p>

          {state.formError ? (
            <p
              role="alert"
              className="text-action-danger mt-4 text-xs font-semibold"
            >
              {labels.errors[state.formError]}
            </p>
          ) : null}

          <DialogActions>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
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
              {isPending ? labels.deleting : labels.delete}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
