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
import { Button, Input, Select } from '@/components/ui';
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

type DesignValueDescriptor = {
  group: 'dimensions' | 'spacing' | 'radius' | 'border' | 'surface';
  property: string;
  labelKey: string;
  kind: DesignValueKind;
  tokenType: ComponentTokenOption['type'];
};

const propertyGroups: Array<{
  titleKey: string;
  properties: DesignValueDescriptor[];
}> = [
  {
    titleKey: 'dimensions',
    properties: [
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
    ],
  },
  {
    titleKey: 'spacing',
    properties: [
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
    ],
  },
  {
    titleKey: 'radius',
    properties: [
      {
        group: 'radius',
        property: 'radius',
        labelKey: 'radius',
        kind: 'radius',
        tokenType: 'radius',
      },
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
    ],
  },
  {
    titleKey: 'border',
    properties: [
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
    ],
  },
  {
    titleKey: 'surface',
    properties: [
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
    ],
  },
];

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
  const [draft, setDraft] = useState(contractV2);
  const [scope, setScope] = useState<ButtonVisualScope>({ kind: 'base' });
  const [explicitDrafts, setExplicitDrafts] = useState<Record<string, string>>(
    {},
  );
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

  function updateDraft(nextDraft: ComponentContractV2) {
    setDraft(nextDraft);
    previewContext?.setContractV2(nextDraft);
  }

  function handleScopeKindChange(kind: ButtonVisualScope['kind']) {
    setExplicitDrafts({});

    if (kind === 'base') {
      setScope({ kind: 'base' });
      return;
    }

    const firstKey = getScopeKeys(liveSemanticContract, kind)[0];

    if (firstKey) {
      setScope({ kind, key: firstKey });
    }
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
    <section className="border-border-subtle bg-background-subtle mb-6 rounded-xl border p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-content-primary text-base font-semibold">
            {t('title')}
          </h2>
          <p className="text-content-secondary mt-1 max-w-2xl text-xs leading-5">
            {t('description')}
          </p>
        </div>
        <span className="border-border-subtle bg-surface-primary text-content-tertiary w-fit rounded-full border px-2.5 py-1 font-mono text-[0.6875rem]">
          V2 · button
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <LabeledControl label={t('scope')}>
          <Select<ButtonVisualScope['kind']>
            value={scope.kind}
            options={[
              { value: 'base', label: t('scopes.base') },
              { value: 'variant', label: t('scopes.variant') },
              { value: 'size', label: t('scopes.size') },
              { value: 'state', label: t('scopes.state') },
            ]}
            onValueChange={handleScopeKindChange}
            placeholder={t('scope')}
            size="sm"
          />
        </LabeledControl>

        {scope.kind !== 'base' ? (
          <LabeledControl label={t('target')}>
            <Select
              value={scope.key}
              options={scopeTargetKeys.map((key) => ({
                value: key,
                label: key,
              }))}
              onValueChange={(key) => {
                setExplicitDrafts({});
                setScope({ kind: scope.kind, key });
              }}
              placeholder={t('target')}
              size="sm"
            />
          </LabeledControl>
        ) : (
          <div className="border-border-subtle bg-surface-primary text-content-secondary flex min-h-9 items-center rounded-md border px-3 text-xs">
            {t('templateDefault')}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-5">
        {propertyGroups.map((group) => (
          <VisualGroup
            key={group.titleKey}
            title={t(`groups.${group.titleKey}`)}
          >
            {group.properties.map((descriptor) => {
              const fieldId = `${scope.kind}:${scope.kind === 'base' ? 'base' : scope.key}:${descriptor.group}:${descriptor.property}`;

              return (
                <DesignValueField
                  key={`${descriptor.group}:${descriptor.property}`}
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
                      scope.kind === 'base'
                        ? t('templateDefault')
                        : t('inherited'),
                    valuePlaceholder:
                      descriptor.kind === 'color'
                        ? t('colorPlaceholder')
                        : t('valuePlaceholder'),
                  }}
                />
              );
            })}
          </VisualGroup>
        ))}

        <VisualGroup title={t('groups.border')}>
          <SimpleSelectProperty
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
                setButtonVisualProperty(draft, scope, 'border', 'style', value),
              )
            }
            onReset={() =>
              updateDraft(
                resetButtonVisualProperty(draft, scope, 'border', 'style'),
              )
            }
          />
        </VisualGroup>

        <VisualGroup title={t('groups.surface')}>
          <SimpleSelectProperty
            label={t('properties.elevation')}
            value={
              isRecord(
                getButtonVisualProperty(draft, scope, 'surface', 'elevation'),
              )
                ? (
                    getButtonVisualProperty(
                      draft,
                      scope,
                      'surface',
                      'elevation',
                    ) as Record<string, unknown>
                  ).value
                : undefined
            }
            options={(['none', 'sm', 'md', 'lg', 'xl'] as const).map(
              (value) => ({ value, label: t(`elevations.${value}`) }),
            )}
            inheritedLabel={
              scope.kind === 'base' ? t('templateDefault') : t('inherited')
            }
            resetLabel={t('reset')}
            onChange={(value) =>
              updateDraft(
                setButtonVisualProperty(draft, scope, 'surface', 'elevation', {
                  source: 'value',
                  value,
                }),
              )
            }
            onReset={() =>
              updateDraft(
                resetButtonVisualProperty(draft, scope, 'surface', 'elevation'),
              )
            }
          />
        </VisualGroup>

        <TypographyEditor
          value={getButtonVisualTarget(draft, scope).typography}
          tokenOptions={tokenOptions}
          inheritedLabel={
            scope.kind === 'base' ? t('templateDefault') : t('inherited')
          }
          labels={{
            title: t('groups.typography'),
            source: t('source'),
            unset: t('unset'),
            token: t('token'),
            explicit: t('explicit'),
            selectToken: t('selectToken'),
            reset: t('reset'),
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
      </div>

      <form
        action={formAction}
        onSubmitCapture={() => {
          markCurrentDraftSubmitted();
          preserveSaveContext();
        }}
        className="border-border-subtle mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
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

function VisualGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-border-subtle bg-surface-primary grid gap-3 rounded-lg border p-3">
      <legend className="text-content-primary px-1 text-xs font-semibold">
        {title}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
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

function DesignValueField({
  label,
  value,
  descriptor,
  tokenOptions,
  explicitDraft,
  onExplicitDraftChange,
  onChange,
  onReset,
  labels,
}: {
  label: string;
  value: unknown;
  descriptor: DesignValueDescriptor;
  tokenOptions: ComponentTokenOption[];
  explicitDraft: string | undefined;
  onExplicitDraftChange: (value: string) => void;
  onChange: (value: unknown) => void;
  onReset: () => void;
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
    <div className="border-border-subtle grid min-w-0 gap-2 rounded-md border p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-content-secondary text-xs font-semibold">
          {label}
        </span>
        {value === undefined ? (
          <span className="text-content-tertiary text-[0.6875rem]">
            {labels.inherited}
          </span>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="text-content-tertiary hover:text-content-primary text-[0.6875rem] font-semibold"
          >
            {labels.reset}
          </button>
        )}
      </div>

      <Select
        value={source}
        options={[
          { value: 'unset', label: labels.unset },
          { value: 'token', label: labels.token },
          { value: 'explicit', label: labels.explicit },
          ...(descriptor.kind === 'dimension'
            ? [
                { value: 'auto', label: labels.auto },
                { value: 'fill', label: labels.fill },
              ]
            : []),
        ]}
        onValueChange={handleSourceChange}
        placeholder={labels.source}
        size="sm"
      />

      {source === 'token' ? (
        <Select
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
      ) : null}

      {source === 'explicit' ? (
        <Input
          value={explicitValue}
          onChange={(event) => handleExplicitChange(event.target.value)}
          placeholder={labels.valuePlaceholder}
          size="sm"
          textMode="code"
        />
      ) : null}
    </div>
  );
}

function SimpleSelectProperty({
  label,
  value,
  options,
  inheritedLabel,
  resetLabel,
  onChange,
  onReset,
}: {
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
    <div className="border-border-subtle grid min-w-0 gap-2 rounded-md border p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-content-secondary text-xs font-semibold">
          {label}
        </span>
        {resolvedValue ? (
          <button
            type="button"
            onClick={onReset}
            className="text-content-tertiary hover:text-content-primary text-[0.6875rem] font-semibold"
          >
            {resetLabel}
          </button>
        ) : (
          <span className="text-content-tertiary text-[0.6875rem]">
            {inheritedLabel}
          </span>
        )}
      </div>
      <Select
        value={resolvedValue}
        options={[{ value: '', label: inheritedLabel }, ...options]}
        onValueChange={(nextValue) =>
          nextValue ? onChange(nextValue) : onReset()
        }
        placeholder={inheritedLabel}
        size="sm"
      />
    </div>
  );
}

function TypographyEditor({
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
    title: string;
    source: string;
    unset: string;
    token: string;
    explicit: string;
    selectToken: string;
    reset: string;
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
    <VisualGroup title={labels.title}>
      <div className="grid gap-3 sm:col-span-2">
        <div className="flex items-center justify-between gap-2">
          {value ? (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-content-tertiary hover:text-content-primary ml-auto text-[0.6875rem] font-semibold"
            >
              {labels.reset}
            </button>
          ) : (
            <span className="text-content-tertiary ml-auto text-[0.6875rem]">
              {inheritedLabel}
            </span>
          )}
        </div>
        <Select
          value={source}
          options={[
            { value: 'unset', label: labels.unset },
            { value: 'token', label: labels.token },
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
          placeholder={labels.source}
          size="sm"
        />

        {value?.source === 'token' ? (
          <Select
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
        ) : null}

        {value?.source === 'value' ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <TypographyInput
              label={labels.fontFamily}
              value={
                typeof explicit.fontFamily === 'string'
                  ? explicit.fontFamily
                  : ''
              }
              onChange={(nextValue) =>
                setExplicitField('fontFamily', nextValue)
              }
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
    </VisualGroup>
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
