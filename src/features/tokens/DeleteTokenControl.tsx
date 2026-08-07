'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
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
      'Remove this token permanently. Referenced tokens must be unlinked first.',
    request: 'Delete token',
    confirmationTitle: (tokenPath: string) => `Delete ${tokenPath}?`,
    confirmationDescription: 'This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete permanently',
    deleting: 'Deleting…',
    dependencyTitle: 'This token is still used by:',
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
      tokenInUse: 'Remove the references below before deleting this token.',
      tokenValidationFailed: 'The token set could not be saved safely.',
      unexpected: 'The token could not be deleted. Try again.',
    },
  },
  fr: {
    title: 'Supprimer le token',
    description:
      'Supprime définitivement ce token. Les références existantes doivent d’abord être retirées.',
    request: 'Supprimer le token',
    confirmationTitle: (tokenPath: string) => `Supprimer ${tokenPath} ?`,
    confirmationDescription: 'Cette action est irréversible.',
    cancel: 'Annuler',
    delete: 'Supprimer définitivement',
    deleting: 'Suppression…',
    dependencyTitle: 'Ce token est encore utilisé par :',
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
        'Retirez les références ci-dessous avant de supprimer ce token.',
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
  const [isConfirming, setIsConfirming] = useState(false);
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

      {!isConfirming ? (
        <Button
          type="button"
          variant="danger"
          size="sm"
          className="mt-3"
          onClick={() => setIsConfirming(true)}
        >
          {labels.request}
        </Button>
      ) : (
        <form
          action={formAction}
          onSubmitCapture={preserveSaveContext}
          className="border-action-danger/30 bg-action-danger/5 mt-3 rounded-md border p-3"
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="tokenSetType" value={tokenSetType} />
          <input type="hidden" name="tokenPath" value={tokenPath} />

          <p className="text-sm font-semibold">
            {labels.confirmationTitle(tokenPath)}
          </p>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {labels.confirmationDescription}
          </p>

          {formError ? (
            <div role="alert" className="mt-3">
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

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => setIsConfirming(false)}
            >
              {labels.cancel}
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              disabled={isPending}
            >
              {isPending ? labels.deleting : labels.delete}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
