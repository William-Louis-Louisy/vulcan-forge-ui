'use client';

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@phosphor-icons/react';
import { Button, Input, SegmentedControl, Select } from '@/components/ui';
import {
  explicitColorValueSchema,
  explicitLengthValueSchema,
  type ComponentContract,
  type ComponentContractV2,
  type ComponentVisualProperties,
} from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import {
  createButtonVisualCustomizationFingerprint,
  getButtonVisualProperty,
  getButtonVisualTarget,
  resetButtonVisualGroup,
  resetButtonVisualProperty,
  setButtonTypographyValue,
  setButtonVisualProperty,
  type ButtonVisualScope,
} from './button-visual-customization.utils';
import { updateButtonVisualCustomizationAction } from './update-button-visual-customization.action';
import { initialUpdateButtonVisualCustomizationActionState } from './update-button-visual-customization.state';
import { useComponentContractPreview } from './ComponentContractPreviewContext';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';

type DesignValueKind = 'dimension' | 'length' | 'radius' | 'color';
type DesignValueGroupKey =
  | 'dimensions'
  | 'spacing'
  | 'radius'
  | 'border'
  | 'surface';
type DesignValueLabelKey =
  | 'width'
  | 'minWidth'
  | 'height'
  | 'minHeight'
  | 'paddingX'
  | 'paddingY'
  | 'gap'
  | 'radius'
  | 'topLeft'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'background'
  | 'foreground'
  | 'borderWidth'
  | 'borderColor';
type InspectorOptionalGroupKey = 'border' | 'typography';

type DesignValueDescriptor = {
  group: DesignValueGroupKey;
  property: string;
  labelKey: DesignValueLabelKey;
  kind: DesignValueKind;
  tokenType: ComponentTokenOption['type'];
};

const dimensionProperties = [
  {
    group: 'dimensions',
    property: 'width',
    labelKey: 'width',
    kind: 'dimension',
    tokenType: 'spacing',
  },
  {
    group: 'dimensions',
    property: 'minWidth',
    labelKey: 'minWidth',
    kind: 'length',
    tokenType: 'spacing',
  },
  {
    group: 'dimensions',
    property: 'height',
    labelKey: 'height',
    kind: 'dimension',
    tokenType: 'spacing',
  },
  {
    group: 'dimensions',
    property: 'minHeight',
    labelKey: 'minHeight',
    kind: 'length',
    tokenType: 'spacing',
  },
] satisfies readonly DesignValueDescriptor[];

const spacingProperties = [
  {
    group: 'spacing',
    property: 'paddingX',
    labelKey: 'paddingX',
    kind: 'length',
    tokenType: 'spacing',
  },
  {
    group: 'spacing',
    property: 'paddingY',
    labelKey: 'paddingY',
    kind: 'length',
    tokenType: 'spacing',
  },
  {
    group: 'spacing',
    property: 'gap',
    labelKey: 'gap',
    kind: 'length',
    tokenType: 'spacing',
  },
] satisfies readonly DesignValueDescriptor[];

const radiusProperty = {
  group: 'radius',
  property: 'radius',
  labelKey: 'radius',
  kind: 'radius',
  tokenType: 'radius',
} satisfies DesignValueDescriptor;

const cornerProperties = [
  {
    group: 'radius',
    property: 'topLeft',
    labelKey: 'topLeft',
    kind: 'radius',
    tokenType: 'radius',
  },
  {
    group: 'radius',
    property: 'topRight',
    labelKey: 'topRight',
    kind: 'radius',
    tokenType: 'radius',
  },
  {
    group: 'radius',
    property: 'bottomRight',
    labelKey: 'bottomRight',
    kind: 'radius',
    tokenType: 'radius',
  },
  {
    group: 'radius',
    property: 'bottomLeft',
    labelKey: 'bottomLeft',
    kind: 'radius',
    tokenType: 'radius',
  },
] satisfies readonly DesignValueDescriptor[];

const fillProperties = [
  {
    group: 'surface',
    property: 'background',
    labelKey: 'background',
    kind: 'color',
    tokenType: 'color',
  },
  {
    group: 'surface',
    property: 'foreground',
    labelKey: 'foreground',
    kind: 'color',
    tokenType: 'color',
  },
] satisfies readonly DesignValueDescriptor[];

const borderProperties = [
  {
    group: 'border',
    property: 'width',
    labelKey: 'borderWidth',
    kind: 'length',
    tokenType: 'spacing',
  },
  {
    group: 'border',
    property: 'color',
    labelKey: 'borderColor',
    kind: 'color',
    tokenType: 'color',
  },
] satisfies readonly DesignValueDescriptor[];

const optionalGroups = ['border', 'typography'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getSource(value: unknown): string {
  if (!isRecord(value)) {
    return 'unset';
  }

  if (value.source === 'mode') {
    return value.value === 'fill' ? 'fill' : 'auto';
  }

  if (value.source === 'token') {
    return 'token';
  }

  if (value.source === 'value') {
    return 'explicit';
  }

  return 'unset';
}

function getTokenPath(value: unknown): string {
  return isRecord(value) &&
    value.source === 'token' &&
    typeof value.path === 'string'
    ? value.path
    : '';
}

function getExplicitValue(value: unknown): string {
  if (!isRecord(value) || value.source !== 'value') {
    return '';
  }

  return typeof value.value === 'string' || typeof value.value === 'number'
    ? String(value.value)
    : '';
}

function getScopeKeys(
  contract: ComponentContract,
  kind: ButtonVisualScope['kind'],
) {
  if (kind === 'variant') {
    return contract.variants.map((item) => item.key);
  }

  if (kind === 'size') {
    return contract.sizes.map((item) => item.key);
  }

  if (kind === 'state') {
    return contract.states.map((item) => item.key);
  }

  return [];
}

function hasCornerOverrides(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
) {
  return cornerProperties.some(
    (descriptor) =>
      getButtonVisualProperty(
        contract,
        scope,
        descriptor.group,
        descriptor.property,
      ) !== undefined,
  );
}

function getVisibleOptionalGroups(
  contract: ComponentContractV2,
  scope: ButtonVisualScope,
): InspectorOptionalGroupKey[] {
  const target = getButtonVisualTarget(contract, scope);
  const groups: InspectorOptionalGroupKey[] = [];

  if (target.border !== undefined) {
    groups.push('border');
  }

  if (target.typography !== undefined) {
    groups.push('typography');
  }

  return groups;
}

export function ButtonVisualCustomizationEditor({
  locale,
  projectSlug,
  componentKey,
  semanticContract,
  contractV2,
  tokenOptions,
}: {
  locale: Locale;
  projectSlug: string;
  componentKey: string;
  semanticContract: ComponentContract;
  contractV2: ComponentContractV2;
  tokenOptions: ComponentTokenOption[];
}) {
  const t = useTranslations('ComponentsRegistryPage.buttonCustomization');
  const router = useRouter();
  const previewContext = useComponentContractPreview();
  const lastRefreshedSavedContractRef = useRef<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    updateButtonVisualCustomizationAction,
    initialUpdateButtonVisualCustomizationActionState,
  );
  const baseScope = { kind: 'base' } as const;
  const [draft, setDraft] = useState(contractV2);
  const [scope, setScope] = useState<ButtonVisualScope>(baseScope);
  const [explicitDrafts, setExplicitDrafts] = useState<Record<string, string>>(
    {},
  );
  const [visibleOptionalGroups, setVisibleOptionalGroups] = useState<
    InspectorOptionalGroupKey[]
  >(() => getVisibleOptionalGroups(contractV2, baseScope));
  const [independentCorners, setIndependentCorners] = useState(() =>
    hasCornerOverrides(contractV2, baseScope),
  );
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const saveContextId = `component-visual:${projectSlug}:${componentKey}`;
  const currentFingerprint = createButtonVisualCustomizationFingerprint(draft);
  const initialSavedFingerprint =
    createButtonVisualCustomizationFingerprint(contractV2);
  const successfulFingerprint =
    state.status === 'success' && state.savedContract
      ? createButtonVisualCustomizationFingerprint(state.savedContract)
      : null;
  const {
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
    status: saveStatus,
  } = useActionBackedProjectSaveStatus({
    sourceId: saveContextId,
    currentFingerprint,
    initialSavedFingerprint,
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
    hasValidationError: false,
  });
  const preserveSaveContext = usePreserveSaveContext(saveContextId);

  useEffect(() => {
    if (state.status !== 'success' || !state.savedContract) {
      return;
    }

    const savedFingerprint = createButtonVisualCustomizationFingerprint(
      state.savedContract,
    );

    if (lastRefreshedSavedContractRef.current === savedFingerprint) {
      return;
    }

    lastRefreshedSavedContractRef.current = savedFingerprint;
    router.refresh();
  }, [router, state.savedContract, state.status]);

  const liveSemanticContract = previewContext?.contract ?? semanticContract;
  const scopeTargetKeys = useMemo(
    () => getScopeKeys(liveSemanticContract, scope.kind),
    [liveSemanticContract, scope.kind],
  );
  const availableOptionalGroups = optionalGroups.filter(
    (group) => !visibleOptionalGroups.includes(group),
  );

  function updateDraft(nextDraft: ComponentContractV2) {
    setDraft(nextDraft);
    previewContext?.setContractV2(nextDraft);
  }

  function setEditingScope(nextScope: ButtonVisualScope) {
    setScope(nextScope);
    setExplicitDrafts({});
    setVisibleOptionalGroups(getVisibleOptionalGroups(draft, nextScope));
    setIndependentCorners(hasCornerOverrides(draft, nextScope));
    setIsAddMenuOpen(false);
  }

  function handleScopeKindChange(kind: ButtonVisualScope['kind']) {
    if (kind === 'base') {
      setEditingScope(baseScope);
      return;
    }

    const firstKey = getScopeKeys(liveSemanticContract, kind)[0];

    if (firstKey) {
      setEditingScope({ kind, key: firstKey });
    }
  }

  function addOptionalGroup(group: InspectorOptionalGroupKey) {
    setVisibleOptionalGroups((current) =>
      optionalGroups.filter(
        (candidate) => current.includes(candidate) || candidate === group,
      ),
    );
    setIsAddMenuOpen(false);
  }

  function removeOptionalGroup(group: InspectorOptionalGroupKey) {
    let nextDraft = draft;

    if (group === 'border') {
      nextDraft = resetButtonVisualGroup(nextDraft, scope, 'border');
    } else {
      nextDraft = setButtonTypographyValue(nextDraft, scope, undefined);
    }

    updateDraft(nextDraft);
    setVisibleOptionalGroups((current) =>
      current.filter((candidate) => candidate !== group),
    );
  }

  function handleIndependentCornersChange(checked: boolean) {
    setIndependentCorners(checked);

    if (checked) {
      return;
    }

    let nextDraft = draft;

    for (const descriptor of cornerProperties) {
      nextDraft = resetButtonVisualProperty(
        nextDraft,
        scope,
        descriptor.group,
        descriptor.property,
      );
    }

    updateDraft(nextDraft);
  }

  function renderDesignValueField(
    descriptor: DesignValueDescriptor,
    layout: 'row' | 'stacked' = 'row',
  ) {
    const scopeKey = scope.kind === 'base' ? 'base' : scope.key;
    const fieldId = `${scope.kind}:${scopeKey}:${descriptor.group}:${descriptor.property}`;

    return (
      <DesignValueField
        key={`${descriptor.group}:${descriptor.property}`}
        id={fieldId}
        label={t(`properties.${descriptor.labelKey}`)}
        value={getButtonVisualProperty(
          draft,
          scope,
          descriptor.group,
          descriptor.property,
        )}
        descriptor={descriptor}
        tokenOptions={tokenOptions}
        explicitDraft={explicitDrafts[fieldId]}
        onExplicitDraftChange={(value) =>
          setExplicitDrafts((current) => ({
            ...current,
            [fieldId]: value,
          }))
        }
        onChange={(value) =>
          updateDraft(
            setButtonVisualProperty(
              draft,
              scope,
              descriptor.group,
              descriptor.property,
              value,
            ),
          )
        }
        onReset={() =>
          updateDraft(
            resetButtonVisualProperty(
              draft,
              scope,
              descriptor.group,
              descriptor.property,
            ),
          )
        }
        layout={layout}
        labels={{
          source: t('source'),
          unset: t('unset'),
          token: t('token'),
          explicit: t('explicit'),
          auto: t('modeAuto'),
          fill: t('modeFill'),
          selectToken: t('selectToken'),
          reset: t('reset'),
          inherited:
            scope.kind === 'base' ? t('templateDefault') : t('inherited'),
          valuePlaceholder:
            descriptor.kind === 'color'
              ? t('colorPlaceholder')
              : t('valuePlaceholder'),
        }}
      />
    );
  }

  const visualCustomizationPayload = JSON.stringify({
    visual: draft.visual,
    overrides: draft.overrides,
  });
  const statusLabel =
    saveStatus === 'saving'
      ? t('save.saving')
      : saveStatus === 'error'
        ? state.status === 'error'
          ? t(`save.errors.${state.formError}`)
          : t('save.invalid')
        : saveStatus === 'unsaved'
          ? t('save.unsaved')
          : t('save.saved');

  return (
    <section className="border-border-subtle bg-surface-primary relative mb-6 rounded-lg border">
      <header className="flex items-start justify-between gap-3 px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <h2 className="text-content-primary text-sm font-semibold">
            {t('title')}
          </h2>
          <p className="text-content-tertiary mt-1 max-w-2xl text-xs leading-5">
            {t('description')}
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            aria-label={t('addProperty')}
            aria-expanded={isAddMenuOpen}
            onClick={() => setIsAddMenuOpen((open) => !open)}
            className="border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default hover:text-content-primary focus-visible:outline-border-focus flex size-8 items-center justify-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <PlusIcon aria-hidden="true" size={14} weight="bold" />
          </button>

          {isAddMenuOpen ? (
            <div className="border-border-subtle bg-surface-primary shadow-soft absolute top-full right-0 z-30 mt-1 w-48 rounded-md border p-1">
              {availableOptionalGroups.length > 0 ? (
                availableOptionalGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => addOptionalGroup(group)}
                    className="text-content-secondary hover:bg-background-subtle hover:text-content-primary flex w-full items-center rounded-sm px-2.5 py-2 text-left text-xs font-semibold transition"
                  >
                    {t(`groups.${group}`)}
                  </button>
                ))
              ) : (
                <p className="text-content-tertiary px-2.5 py-2 text-xs">
                  {t('noPropertiesToAdd')}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <div className="border-border-subtle bg-background-subtle flex flex-col gap-2 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <SegmentedControl<ButtonVisualScope['kind']>
          value={scope.kind}
          options={[
            { value: 'base', label: t('scopes.base') },
            {
              value: 'variant',
              label: t('scopes.variant'),
              disabled: liveSemanticContract.variants.length === 0,
            },
            {
              value: 'size',
              label: t('scopes.size'),
              disabled: liveSemanticContract.sizes.length === 0,
            },
            {
              value: 'state',
              label: t('scopes.state'),
              disabled: liveSemanticContract.states.length === 0,
            },
          ]}
          onValueChange={handleScopeKindChange}
          ariaLabel={t('scope')}
          className="w-full sm:w-fit"
        />

        {scope.kind !== 'base' ? (
          <div className="min-w-0 sm:w-48">
            <Select
              id="button-v2-customization-target"
              value={scope.key}
              options={scopeTargetKeys.map((key) => ({
                value: key,
                label: key,
              }))}
              onValueChange={(key) =>
                setEditingScope({ kind: scope.kind, key })
              }
              placeholder={t('target')}
              size="sm"
            />
          </div>
        ) : (
          <span className="text-content-tertiary text-xs">
            {t('templateDefault')}
          </span>
        )}
      </div>

      <div className="border-border-subtle divide-border-subtle divide-y border-t">
        <InspectorGroup title={t('groups.fill')}>
          {fillProperties.map((descriptor) =>
            renderDesignValueField(descriptor),
          )}
        </InspectorGroup>

        <InspectorGroup title={t('groups.dimensions')}>
          {dimensionProperties.map((descriptor) =>
            renderDesignValueField(descriptor),
          )}
        </InspectorGroup>

        <InspectorGroup title={t('groups.spacing')}>
          {spacingProperties.map((descriptor) =>
            renderDesignValueField(descriptor),
          )}
        </InspectorGroup>

        <InspectorGroup title={t('groups.radius')}>
          <label className="text-content-secondary flex w-fit items-center gap-2 text-xs font-semibold">
            <input
              id="button-v2-independent-corners"
              type="checkbox"
              checked={independentCorners}
              onChange={(event) =>
                handleIndependentCornersChange(event.target.checked)
              }
              className="size-4"
            />
            <span>{t('independentCorners')}</span>
          </label>

          {independentCorners ? (
            <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2">
              {cornerProperties.map((descriptor) =>
                renderDesignValueField(descriptor, 'stacked'),
              )}
            </div>
          ) : (
            renderDesignValueField(radiusProperty)
          )}
        </InspectorGroup>

        {visibleOptionalGroups.includes('border') ? (
          <InspectorGroup
            title={t('groups.border')}
            onRemove={() => removeOptionalGroup('border')}
            removeLabel={t('removeProperty')}
          >
            {borderProperties.map((descriptor) =>
              renderDesignValueField(descriptor),
            )}
            <SimpleSelectProperty
              id="button-v2-border-style"
              label={t('properties.borderStyle')}
              value={getButtonVisualProperty(draft, scope, 'border', 'style')}
              options={(['none', 'solid', 'dashed', 'dotted'] as const).map(
                (value) => ({ value, label: t(`borderStyles.${value}`) }),
              )}
              inheritedLabel={
                scope.kind === 'base' ? t('templateDefault') : t('inherited')
              }
              resetLabel={t('reset')}
              onChange={(value) =>
                updateDraft(
                  setButtonVisualProperty(
                    draft,
                    scope,
                    'border',
                    'style',
                    value,
                  ),
                )
              }
              onReset={() =>
                updateDraft(
                  resetButtonVisualProperty(draft, scope, 'border', 'style'),
                )
              }
            />
          </InspectorGroup>
        ) : null}

        {visibleOptionalGroups.includes('typography') ? (
          <InspectorGroup
            title={t('groups.typography')}
            onRemove={() => removeOptionalGroup('typography')}
            removeLabel={t('removeProperty')}
          >
            <TypographyControls
              value={getButtonVisualTarget(draft, scope).typography}
              tokenOptions={tokenOptions}
              inheritedLabel={
                scope.kind === 'base' ? t('templateDefault') : t('inherited')
              }
              labels={{
                source: t('source'),
                unset: t('unset'),
                token: t('token'),
                explicit: t('explicit'),
                selectToken: t('selectToken'),
                fontFamily: t('properties.fontFamily'),
                fontSize: t('properties.fontSize'),
                fontWeight: t('properties.fontWeight'),
                lineHeight: t('properties.lineHeight'),
                letterSpacing: t('properties.letterSpacing'),
                textAlign: t('properties.textAlign'),
                valuePlaceholder: t('valuePlaceholder'),
                textAlignments: {
                  left: t('textAlignments.left'),
                  center: t('textAlignments.center'),
                  right: t('textAlignments.right'),
                  justify: t('textAlignments.justify'),
                },
              }}
              onChange={(value) =>
                updateDraft(setButtonTypographyValue(draft, scope, value))
              }
            />
          </InspectorGroup>
        ) : null}
      </div>

      <form
        action={formAction}
        onSubmitCapture={() => {
          markCurrentDraftSubmitted();
          preserveSaveContext();
        }}
        className="border-border-subtle bg-background-subtle flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="componentKey" value={componentKey} />
        <input
          type="hidden"
          name="visualCustomization"
          value={visualCustomizationPayload}
        />
        <p
          aria-live="polite"
          className={[
            'text-xs font-semibold',
            saveStatus === 'error'
              ? 'text-action-danger'
              : saveStatus === 'unsaved'
                ? 'text-action-warning'
                : 'text-content-secondary',
          ].join(' ')}
        >
          {statusLabel}
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !hasUnsavedChanges}
        >
          {isPending ? t('save.saving') : t('save.action')}
        </Button>
      </form>
    </section>
  );
}

function InspectorGroup({
  title,
  children,
  onRemove,
  removeLabel,
}: {
  title: string;
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <section data-inspector-group={title} className="min-w-0">
      <div className="flex min-h-10 items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <h3 className="text-content-primary text-xs font-semibold">{title}</h3>
        {onRemove ? (
          <button
            type="button"
            aria-label={`${removeLabel ?? 'Remove'} ${title}`}
            onClick={onRemove}
            className="text-content-tertiary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus flex size-7 items-center justify-center rounded-sm text-base transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true">−</span>
          </button>
        ) : null}
      </div>
      <div className="grid gap-3 px-3 pb-3 sm:px-4">{children}</div>
    </section>
  );
}

function DesignValueField({
  id,
  label,
  value,
  descriptor,
  tokenOptions,
  explicitDraft,
  onExplicitDraftChange,
  onChange,
  onReset,
  layout,
  labels,
}: {
  id: string;
  label: string;
  value: unknown;
  descriptor: DesignValueDescriptor;
  tokenOptions: ComponentTokenOption[];
  explicitDraft: string | undefined;
  onExplicitDraftChange: (value: string) => void;
  onChange: (value: unknown) => void;
  onReset: () => void;
  layout: 'row' | 'stacked';
  labels: {
    source: string;
    unset: string;
    token: string;
    explicit: string;
    auto: string;
    fill: string;
    selectToken: string;
    reset: string;
    inherited: string;
    valuePlaceholder: string;
  };
}) {
  const source = getSource(value);
  const availableTokens = tokenOptions.filter(
    (token) => token.type === descriptor.tokenType,
  );
  const explicitValue = explicitDraft ?? getExplicitValue(value);
  const sourceOptions = [
    { value: 'unset', label: labels.unset },
    ...(availableTokens.length > 0
      ? [{ value: 'token', label: labels.token }]
      : []),
    { value: 'explicit', label: labels.explicit },
    ...(descriptor.kind === 'dimension'
      ? [
          { value: 'auto', label: labels.auto },
          { value: 'fill', label: labels.fill },
        ]
      : []),
  ];

  function handleSourceChange(nextSource: string) {
    if (nextSource === 'unset') {
      onReset();
      return;
    }

    if (nextSource === 'auto' || nextSource === 'fill') {
      onChange({ source: 'mode', value: nextSource });
      return;
    }

    if (nextSource === 'token') {
      const token = availableTokens[0];

      if (token) {
        onChange({
          source: 'token',
          tokenType: descriptor.tokenType,
          path: token.path,
        });
      }
      return;
    }

    const defaultValue = descriptor.kind === 'color' ? '#111827' : '0px';
    onExplicitDraftChange(defaultValue);
    onChange({ source: 'value', value: defaultValue });
  }

  function handleExplicitChange(nextValue: string) {
    onExplicitDraftChange(nextValue);
    const schema =
      descriptor.kind === 'color'
        ? explicitColorValueSchema
        : explicitLengthValueSchema;

    if (schema.safeParse(nextValue).success) {
      onChange({ source: 'value', value: nextValue });
    }
  }

  return (
    <div
      className={
        layout === 'stacked'
          ? 'grid min-w-0 gap-1.5'
          : 'grid min-w-0 gap-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center'
      }
    >
      <label
        htmlFor={`${id}-source`}
        className="text-content-secondary text-xs font-semibold"
      >
        {label}
      </label>

      <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_2rem] items-center gap-2">
        <PropertySourceSelect
          id={`${id}-source`}
          value={source}
          options={sourceOptions}
          onValueChange={handleSourceChange}
          ariaLabel={labels.source}
        />

        {source === 'token' ? (
          <Select
            id={`${id}-token`}
            value={getTokenPath(value)}
            options={availableTokens.map((token) => ({
              value: token.path,
              label: token.label,
            }))}
            onValueChange={(path) =>
              onChange({
                source: 'token',
                tokenType: descriptor.tokenType,
                path,
              })
            }
            placeholder={labels.selectToken}
            size="sm"
          />
        ) : source === 'explicit' ? (
          <Input
            id={`${id}-explicit`}
            value={explicitValue}
            onChange={(event) => handleExplicitChange(event.target.value)}
            placeholder={labels.valuePlaceholder}
            size="sm"
            textMode="technical"
          />
        ) : (
          <span className="text-content-tertiary truncate text-xs">
            {source === 'auto'
              ? labels.auto
              : source === 'fill'
                ? labels.fill
                : labels.inherited}
          </span>
        )}

        {value !== undefined ? (
          <button
            type="button"
            aria-label={`${labels.reset} ${label}`}
            onClick={onReset}
            className="text-content-tertiary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus flex size-7 items-center justify-center rounded-sm text-base transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

function PropertySourceSelect({
  id,
  value,
  options,
  onValueChange,
  ariaLabel,
}: {
  id: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <Select
      id={id}
      value={value}
      options={options}
      onValueChange={onValueChange}
      placeholder={ariaLabel}
      size="xs"
      className="max-w-32 min-w-[6.75rem]"
    />
  );
}

function SimpleSelectProperty({
  id,
  label,
  value,
  options,
  inheritedLabel,
  resetLabel,
  onChange,
  onReset,
}: {
  id: string;
  label: string;
  value: unknown;
  options: Array<{ value: string; label: string }>;
  inheritedLabel: string;
  resetLabel: string;
  onChange: (value: string) => void;
  onReset: () => void;
}) {
  const resolvedValue = typeof value === 'string' ? value : '';

  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center">
      <label
        htmlFor={id}
        className="text-content-secondary text-xs font-semibold"
      >
        {label}
      </label>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_2rem] items-center gap-2">
        <Select
          id={id}
          value={resolvedValue}
          options={[{ value: '', label: inheritedLabel }, ...options]}
          onValueChange={(nextValue) =>
            nextValue ? onChange(nextValue) : onReset()
          }
          placeholder={inheritedLabel}
          size="sm"
        />
        {resolvedValue ? (
          <button
            type="button"
            aria-label={`${resetLabel} ${label}`}
            onClick={onReset}
            className="text-content-tertiary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus flex size-7 items-center justify-center rounded-sm text-base transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

function TypographyControls({
  value,
  tokenOptions,
  inheritedLabel,
  labels,
  onChange,
}: {
  value: ComponentVisualProperties['typography'];
  tokenOptions: ComponentTokenOption[];
  inheritedLabel: string;
  labels: {
    source: string;
    unset: string;
    token: string;
    explicit: string;
    selectToken: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
    valuePlaceholder: string;
    textAlignments: Record<'left' | 'center' | 'right' | 'justify', string>;
  };
  onChange: (
    value: ComponentVisualProperties['typography'] | undefined,
  ) => void;
}) {
  const source = value?.source ?? 'unset';
  const typographyTokens = tokenOptions.filter(
    (token) => token.type === 'typography',
  );
  const explicit = value?.source === 'value' ? value.value : {};

  function setExplicitField(
    field: keyof typeof explicit,
    nextValue: string | number | undefined,
  ) {
    const nextExplicit = {
      ...explicit,
      [field]: nextValue || undefined,
    };
    const cleaned = Object.fromEntries(
      Object.entries(nextExplicit).filter(
        ([, fieldValue]) => fieldValue !== undefined,
      ),
    );

    if (Object.keys(cleaned).length > 0) {
      onChange({ source: 'value', value: cleaned });
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid min-w-0 gap-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center">
        <label
          htmlFor="button-v2-typography-source"
          className="text-content-secondary text-xs font-semibold"
        >
          {labels.source}
        </label>
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
          <PropertySourceSelect
            id="button-v2-typography-source"
            value={source}
            options={[
              { value: 'unset', label: labels.unset },
              ...(typographyTokens.length > 0
                ? [{ value: 'token', label: labels.token }]
                : []),
              { value: 'value', label: labels.explicit },
            ]}
            onValueChange={(nextSource) => {
              if (nextSource === 'unset') {
                onChange(undefined);
                return;
              }

              if (nextSource === 'token') {
                const token = typographyTokens[0];
                if (token) {
                  onChange({
                    source: 'token',
                    tokenType: 'typography',
                    path: token.path,
                  });
                }
                return;
              }

              onChange({
                source: 'value',
                value: { fontSize: '14px', fontWeight: 600, lineHeight: 1.2 },
              });
            }}
            ariaLabel={labels.source}
          />

          {value?.source === 'token' ? (
            <Select
              id="button-v2-typography-token"
              value={value.path}
              options={typographyTokens.map((token) => ({
                value: token.path,
                label: token.label,
              }))}
              onValueChange={(path) =>
                onChange({ source: 'token', tokenType: 'typography', path })
              }
              placeholder={labels.selectToken}
              size="sm"
            />
          ) : (
            <span className="text-content-tertiary flex min-h-9 items-center text-xs">
              {inheritedLabel}
            </span>
          )}
        </div>
      </div>

      {value?.source === 'value' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <TypographyInput
            label={labels.fontFamily}
            value={
              typeof explicit.fontFamily === 'string' ? explicit.fontFamily : ''
            }
            onChange={(nextValue) => setExplicitField('fontFamily', nextValue)}
          />
          <TypographyInput
            label={labels.fontSize}
            value={
              typeof explicit.fontSize === 'string' ? explicit.fontSize : ''
            }
            placeholder={labels.valuePlaceholder}
            onChange={(nextValue) => {
              if (explicitLengthValueSchema.safeParse(nextValue).success) {
                setExplicitField('fontSize', nextValue);
              }
            }}
          />
          <TypographyInput
            label={labels.letterSpacing}
            value={
              typeof explicit.letterSpacing === 'string'
                ? explicit.letterSpacing
                : ''
            }
            placeholder={labels.valuePlaceholder}
            onChange={(nextValue) => {
              if (explicitLengthValueSchema.safeParse(nextValue).success) {
                setExplicitField('letterSpacing', nextValue);
              }
            }}
          />
          <LabeledControl label={labels.fontWeight}>
            <Select
              id="button-v2-typography-font-weight"
              value={String(explicit.fontWeight ?? 600)}
              options={['400', '500', '600', '700', 'bold'].map((weight) => ({
                value: weight,
                label: weight,
              }))}
              onValueChange={(weight) =>
                setExplicitField(
                  'fontWeight',
                  weight === 'bold' ? 'bold' : Number(weight),
                )
              }
              placeholder={labels.fontWeight}
              size="sm"
            />
          </LabeledControl>
          <LabeledControl label={labels.lineHeight}>
            <Select
              id="button-v2-typography-line-height"
              value={String(explicit.lineHeight ?? 1.2)}
              options={['1', '1.2', '1.5', '1.75', '2'].map((lineHeight) => ({
                value: lineHeight,
                label: lineHeight,
              }))}
              onValueChange={(lineHeight) =>
                setExplicitField('lineHeight', Number(lineHeight))
              }
              placeholder={labels.lineHeight}
              size="sm"
            />
          </LabeledControl>
          <LabeledControl label={labels.textAlign}>
            <Select
              id="button-v2-typography-text-align"
              value={explicit.textAlign ?? 'center'}
              options={(['left', 'center', 'right', 'justify'] as const).map(
                (alignment) => ({
                  value: alignment,
                  label: labels.textAlignments[alignment],
                }),
              )}
              onValueChange={(alignment) =>
                setExplicitField(
                  'textAlign',
                  alignment as 'left' | 'center' | 'right' | 'justify',
                )
              }
              placeholder={labels.textAlign}
              size="sm"
            />
          </LabeledControl>
        </div>
      ) : null}
    </div>
  );
}

function LabeledControl({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-content-secondary text-xs font-semibold">
        {label}
      </span>
      {children}
    </div>
  );
}

function TypographyInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <LabeledControl label={label}>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        size="sm"
      />
    </LabeledControl>
  );
}
