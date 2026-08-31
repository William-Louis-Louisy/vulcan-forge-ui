'use client';

import { Button, Select, Textarea } from '@/components/ui';
import {
  stringifyDesignTokenValue,
  type DesignToken,
} from '@/domain/design-system';
import type { ComponentContractEditorLabels } from './ComponentContractEditorSections';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import { normalizeComponentPreviewTokenRole } from './component-token-bindings.utils';
import { getComponentPreviewTokenRoleType } from './component-preview-role-bindings';
import { ComponentPreviewRoleField } from './ComponentPreviewRoleField';
import { getComponentTokenBindingInspectorState } from './component-token-binding-inspector.utils';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

export function ComponentTokenBindingInspector({
  labels,
  tokenOptions,
}: {
  labels: ComponentContractEditorLabels;
  tokenOptions: ComponentTokenOption[];
}) {
  const {
    draft,
    setDraft,
    activeLocale,
    setActiveLocale,
    authoringSelection,
    setAuthoringSelection,
  } = useComponentContractWorkspace();

  if (authoringSelection.kind !== 'tokenBinding') {
    return null;
  }

  const selectedBinding = draft.tokenBindings.find(
    (binding) => binding.draftId === authoringSelection.draftId,
  );

  if (!selectedBinding) {
    return null;
  }

  const binding = selectedBinding;
  const previewRole = normalizeComponentPreviewTokenRole(binding.key);
  const constrainedTokenType = previewRole
    ? getComponentPreviewTokenRoleType(previewRole)
    : null;
  const hasCompatibleConstrainedType =
    constrainedTokenType === null || binding.tokenType === constrainedTokenType;
  const tokenTypeOptions = createTokenTypeOptions(constrainedTokenType, labels);
  const tokenOptionsForType = tokenOptions.filter(
    (tokenOption) => tokenOption.type === binding.tokenType,
  );
  const hasCurrentTokenPath = tokenOptionsForType.some(
    (tokenOption) => tokenOption.path === binding.tokenPath,
  );
  const inspectorState = getComponentTokenBindingInspectorState({
    binding,
    tokenOptions,
    componentType: draft.type,
  });
  const descriptionLabel =
    activeLocale === 'en'
      ? labels.fields.descriptionEn
      : labels.fields.descriptionFr;
  const displayName =
    previewRole !== null
      ? labels.visualTokens.roles[previewRole]
      : binding.key.trim() || labels.visualTokens.customRole;

  function updateBinding(nextBinding: typeof binding) {
    setDraft({
      ...draft,
      tokenBindings: draft.tokenBindings.map((candidate) =>
        candidate.draftId === binding.draftId ? nextBinding : candidate,
      ),
    });
  }

  function removeBinding() {
    setDraft({
      ...draft,
      tokenBindings: draft.tokenBindings.filter(
        (candidate) => candidate.draftId !== binding.draftId,
      ),
    });
    setAuthoringSelection({ kind: 'component' });
  }

  return (
    <section className="min-w-0">
      <header className="border-border-subtle border-b pb-4">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setAuthoringSelection({ kind: 'component' })}
          className="-ml-2"
        >
          ← {draft.name}
        </Button>
        <p className="text-content-tertiary mt-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
          {labels.visualTokens.title}
        </p>
        <h3 className="mt-1 truncate text-lg font-semibold tracking-tight">
          {displayName}
        </h3>
        <p className="text-content-tertiary mt-1 text-xs">
          {labels.visualTokens.scope}: {labels.visualTokens.componentScope}
        </p>
      </header>

      <div className="grid min-w-0 gap-5 pt-4">
        <ComponentPreviewRoleField
          labels={labels.visualTokens}
          binding={binding}
          bindings={draft.tokenBindings}
          onChange={updateBinding}
        />

        <div className="grid min-w-0 gap-3">
          <div className="grid min-w-0 gap-1.5">
            <label
              htmlFor={`token-binding-type-inspector-${binding.draftId}`}
              className="text-content-secondary text-xs font-semibold"
            >
              {labels.visualTokens.tokenType}
            </label>
            <Select<DesignToken['type']>
              id={`token-binding-type-inspector-${binding.draftId}`}
              value={binding.tokenType}
              options={tokenTypeOptions}
              onValueChange={(tokenType) =>
                updateBinding({ ...binding, tokenType, tokenPath: '' })
              }
              placeholder={labels.visualTokens.tokenType}
              disabled={
                constrainedTokenType !== null && hasCompatibleConstrainedType
              }
              invalid={!hasCompatibleConstrainedType}
              size="sm"
            />
          </div>

          <div className="grid min-w-0 gap-1.5">
            <label
              htmlFor={`token-binding-path-inspector-${binding.draftId}`}
              className="text-content-secondary text-xs font-semibold"
            >
              {labels.visualTokens.tokenPath}
            </label>
            <Select
              id={`token-binding-path-inspector-${binding.draftId}`}
              value={binding.tokenPath}
              options={[
                ...(!hasCurrentTokenPath && binding.tokenPath
                  ? [{ value: binding.tokenPath, label: binding.tokenPath }]
                  : []),
                ...tokenOptionsForType.map((tokenOption) => ({
                  value: tokenOption.path,
                  label: tokenOption.label,
                  description: labels.visualTokens.tokenTypes[tokenOption.type],
                })),
              ]}
              onValueChange={(tokenPath) =>
                updateBinding({ ...binding, tokenPath })
              }
              placeholder={labels.visualTokens.selectToken}
              size="sm"
              textMode="technical"
            />
          </div>
        </div>

        <BindingDiagnostics
          labels={labels}
          state={inspectorState}
          bindingTokenType={binding.tokenType}
        />

        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="text-content-secondary text-xs font-semibold">
              {descriptionLabel}
            </span>
            <div
              role="group"
              aria-label={labels.localizedContent.editing}
              className="border-border-subtle bg-surface-primary inline-flex shrink-0 rounded-md border p-0.5"
            >
              {(['fr', 'en'] as const).map((localeOption) => {
                const isActive = localeOption === activeLocale;

                return (
                  <button
                    key={localeOption}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveLocale(localeOption)}
                    className={[
                      'rounded-sm px-2 py-1 font-mono text-[0.6875rem] font-semibold transition',
                      isActive
                        ? 'bg-content-primary text-background-app'
                        : 'text-content-secondary hover:text-content-primary',
                    ].join(' ')}
                  >
                    {labels.localizedContent.locales[localeOption]}
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea
            aria-label={descriptionLabel}
            value={binding.description[activeLocale]}
            onChange={(event) =>
              updateBinding({
                ...binding,
                description: {
                  ...binding.description,
                  [activeLocale]: event.target.value,
                },
              })
            }
            rows={4}
          />
        </div>

        <div className="border-border-subtle border-t pt-4">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={removeBinding}
            className="text-action-danger"
          >
            {labels.fields.remove}
          </Button>
        </div>
      </div>
    </section>
  );
}

function BindingDiagnostics({
  labels,
  state,
  bindingTokenType,
}: {
  labels: ComponentContractEditorLabels;
  state: ReturnType<typeof getComponentTokenBindingInspectorState>;
  bindingTokenType: DesignToken['type'];
}) {
  const resolutionTone =
    state.resolutionState === 'resolved'
      ? 'success'
      : state.resolutionState === 'unassigned'
        ? 'neutral'
        : 'warning';
  const resolutionClassName = {
    success:
      'border-action-success/30 bg-action-success/10 text-action-success',
    warning:
      'border-action-warning/30 bg-action-warning/10 text-action-warning',
    neutral: 'border-border-subtle bg-background-subtle text-content-secondary',
  }[resolutionTone];
  const resolutionLabel =
    labels.visualTokens.diagnostics[state.resolutionState];
  const actualType = state.token?.type;

  return (
    <div className="grid min-w-0 gap-2">
      <p className="text-content-secondary text-xs font-semibold">
        {labels.visualTokens.diagnostics.title}
      </p>
      <div className={`${resolutionClassName} rounded-md border px-3 py-2.5`}>
        <p className="text-xs font-semibold">{resolutionLabel}</p>
        {state.resolutionState === 'typeMismatch' && actualType ? (
          <dl className="mt-2 grid gap-1 text-[0.6875rem]">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <dt>{labels.visualTokens.diagnostics.expectedType}</dt>
              <dd>{labels.visualTokens.tokenTypes[bindingTokenType]}</dd>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-3">
              <dt>{labels.visualTokens.diagnostics.actualType}</dt>
              <dd>{labels.visualTokens.tokenTypes[actualType]}</dd>
            </div>
          </dl>
        ) : null}
        {state.token && state.token.type === bindingTokenType ? (
          <dl className="mt-2 grid gap-1 text-[0.6875rem]">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <dt>{labels.visualTokens.resolvedValue}</dt>
              <dd className="max-w-[60%] truncate font-mono">
                {stringifyDesignTokenValue(state.token.resolvedValue)}
              </dd>
            </div>
            <div className="flex min-w-0 items-center justify-between gap-3">
              <dt>{labels.visualTokens.tokenStatus}</dt>
              <dd>{labels.statuses[state.token.status]}</dd>
            </div>
          </dl>
        ) : null}
      </div>

      <div
        className={[
          'rounded-md border px-3 py-2.5 text-xs leading-5',
          state.hasRendererEffect
            ? 'border-border-subtle bg-background-subtle text-content-secondary'
            : 'border-action-info/30 bg-action-info/10 text-action-info',
        ].join(' ')}
      >
        <span className="font-semibold">
          {labels.visualTokens.previewEffect}:{' '}
        </span>
        {state.hasRendererEffect
          ? labels.visualTokens.previewEffectActive
          : labels.visualTokens.previewEffectUnavailable}
      </div>
    </div>
  );
}

function createTokenTypeOptions(
  constrainedTokenType: DesignToken['type'] | null,
  labels: ComponentContractEditorLabels,
) {
  if (constrainedTokenType) {
    return [
      {
        value: constrainedTokenType,
        label: labels.visualTokens.tokenTypes[constrainedTokenType],
      },
    ];
  }

  return (['color', 'spacing', 'radius', 'typography', 'motion'] as const).map(
    (tokenType) => ({
      value: tokenType,
      label: labels.visualTokens.tokenTypes[tokenType],
    }),
  );
}
