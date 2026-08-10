'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import type { TokenSetType } from './tokens-editor.utils';
import { deleteTokenAction } from './delete-token.action';
import {
  initialDeleteTokenActionState,
  type DeleteTokenDependencyKind,
  type DeleteTokenFormError,
} from './delete-token.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

const copy = {
  en: {
    title: 'Delete token',
    description:
      'Remove this token permanently. Theme and component references are detached automatically; token-to-token references must be unlinked first.',
    request: 'Delete token',
    confirmationTitle: (tokenPath: string) => `Delete ${tokenPath}?`,
    confirmationDescription: 'This action cannot be undone.',
    automaticDetach:
      'Theme and component references using this token will be removed automatically. Their previews will fall back to the existing default styles.',
    cancel: 'Cancel',
    delete: 'Delete permanently',
    deleting: 'Deleting…',
    dependencyTitle: 'Delete is blocked by these token references:',
    dependencyKinds: {
      token: 'Token',
      theme: 'Theme',
      component: 'Component',
    },
    errors: {
      unauthorized: 'Your session is no longer authorized.',
      projectNotFound: 'The project could not be found.',
      tokenSetNotFound: 'The token set could not be found.',
      tokenSetMalformed: 'The token set cannot be edited safely.',
      tokenNotFound: 'The token no longer exists.',
      tokenInUse:
        'Unlink the token references below before deleting this token.',
      tokenValidationFailed: 'The token set could not be saved safely.',
      unexpected: 'The token could not be deleted. Try again.',
    },
  },
  fr: {
    title: 'Supprimer le token',
    description:
      'Supprime définitivement ce token. Les références des thèmes et composants sont détachées automatiquement ; les références entre tokens doivent d’abord être retirées.',
    request: 'Supprimer le token',
    confirmationTitle: (tokenPath: string) => `Supprimer ${tokenPath} ?`,
    confirmationDescription: 'Cette action est irréversible.',
    automaticDetach:
      'Les références des thèmes et composants utilisant ce token seront retirées automatiquement. Leurs previews utiliseront les styles fallback existants.',
    cancel: 'Annuler',
    delete: 'Supprimer définitivement',
    deleting: 'Suppression…',
    dependencyTitle:
      'La suppression est bloquée par ces références de tokens :',
    dependencyKinds: {
      token: 'Token',
      theme: 'Thème',
      component: 'Composant',
    },
    errors: {
      unauthorized: 'Votre session n’est plus autorisée.',
      projectNotFound: 'Le projet est introuvable.',
      tokenSetNotFound: 'Le groupe de tokens est introuvable.',
      tokenSetMalformed:
        'Le groupe de tokens ne peut pas être modifié en sécurité.',
      tokenNotFound: 'Le token n’existe plus.',
      tokenInUse:
        'Retirez les références de tokens ci-dessous avant de supprimer ce token.',
      tokenValidationFailed:
        'Le groupe de tokens n’a pas pu être enregistré en sécurité.',
      unexpected: 'Le token n’a pas pu être supprimé. Réessayez.',
    },
  },
} as const;

type DeleteTokenControlProps = {
  locale: Locale;
  projectSlug: string;
  tokenPath: string;
  tokenSetType: TokenSetType;
  onDeleted: (tokenPath: string) => void;
};

export function DeleteTokenControl({
  locale,
  projectSlug,
  tokenPath,
  tokenSetType,
  onDeleted,
}: DeleteTokenControlProps) {
  const labels = copy[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteTokenAction,
    initialDeleteTokenActionState,
  );
  const handledDeletedPath = useRef<string | null>(null);
  const preserveSaveContext = usePreserveSaveContext(
    `delete-token:${projectSlug}:${tokenSetType}:${tokenPath}`,
  );

  useEffect(() => {
    if (
      state.status === 'success' &&
      state.deletedTokenPath &&
      handledDeletedPath.current !== state.deletedTokenPath
    ) {
      handledDeletedPath.current = state.deletedTokenPath;
      setIsOpen(false);
      onDeleted(state.deletedTokenPath);
    }
  }, [onDeleted, state.deletedTokenPath, state.status]);

  const formError = state.formError as DeleteTokenFormError | null;

  return (
    <section className="border-border-subtle mt-4 border-t pt-4">
      <h3 className="text-action-danger text-xs font-semibold tracking-[0.16em] uppercase">
        {labels.title}
      </h3>
      <p className="text-content-secondary mt-2 text-xs leading-5">
        {labels.description}
      </p>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          {labels.request}
        </Button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (!isPending) {
            setIsOpen(false);
          }
        }}
        ariaLabel={labels.confirmationTitle(tokenPath)}
      >
        <form
          action={formAction}
          onSubmitCapture={preserveSaveContext}
          className="bg-surface-primary p-5 sm:p-6"
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="tokenSetType" value={tokenSetType} />
          <input type="hidden" name="tokenPath" value={tokenPath} />

          <h2 className="text-lg font-semibold tracking-tight">
            {labels.confirmationTitle(tokenPath)}
          </h2>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.confirmationDescription}
          </p>
          <p className="border-action-warning/30 bg-action-warning/10 text-content-secondary mt-4 rounded-md border px-3 py-2 text-xs leading-5">
            {labels.automaticDetach}
          </p>

          {formError ? (
            <div role="alert" className="mt-4">
              <p className="text-action-danger text-xs font-semibold">
                {labels.errors[formError]}
              </p>

              {formError === 'tokenInUse' && state.dependencies.length > 0 ? (
                <div className="mt-2">
                  <p className="text-content-secondary text-xs font-semibold">
                    {labels.dependencyTitle}
                  </p>
                  <ul className="text-content-secondary mt-1 grid gap-1 text-xs">
                    {state.dependencies.map((dependency) => (
                      <li key={`${dependency.kind}:${dependency.label}`}>
                        <span className="font-semibold">
                          {
                            labels.dependencyKinds[
                              dependency.kind as DeleteTokenDependencyKind
                            ]
                          }
                        </span>{' '}
                        · <span className="font-mono">{dependency.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
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
    </section>
  );
}
