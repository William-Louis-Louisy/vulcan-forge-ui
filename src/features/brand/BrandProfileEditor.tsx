'use client';

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { useProjectSaveStatus } from '@/components/layout/ProjectTopbarBreadcrumb';
import {
  Badge,
  Button,
  ProjectWorkspaceHeader,
  SegmentedControl,
} from '@/components/ui';
import {
  brandProfileSchema,
  brandUiDensities,
  brandVisualStyles,
  type BrandProfile,
  type BrandTerminologyEntry,
} from '@/domain/design-system';
import {
  resolveLocalizedStringWithFallback,
  type AppLocale,
  type LocalizedString,
} from '@/domain/i18n';
import { useRouter } from '@/i18n/navigation';
import { saveBrandProfileAction } from './save-brand-profile.action';
import { initialSaveBrandProfileActionState } from './save-brand-profile.state';
import {
  brandLocalizedFieldKeys,
  countMissingBrandTranslations,
  type BrandLocalizedFieldKey,
} from './brand-profile.utils';

type BrandProfileEditorProps = {
  interfaceLocale: AppLocale;
  project: {
    name: string;
    slug: string;
    defaultLocale: AppLocale;
    supportedLocales: AppLocale[];
  };
  initialProfile: BrandProfile;
};

type ProfileSaveStatus = 'saved' | 'unsaved' | 'saving' | 'error';

const fieldRows: Array<{
  key: Exclude<BrandLocalizedFieldKey, 'tagline'>;
  rows: number;
}> = [
  { key: 'shortDescription', rows: 4 },
  { key: 'personality', rows: 4 },
  { key: 'audience', rows: 4 },
  { key: 'toneOfVoice', rows: 4 },
];

export function BrandProfileEditor({
  interfaceLocale,
  project,
  initialProfile,
}: BrandProfileEditorProps) {
  const t = useTranslations('BrandProfilePage');
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveBrandProfileAction,
    initialSaveBrandProfileActionState,
  );
  const [productName, setProductName] = useState(project.name);
  const [profile, setProfile] = useState(initialProfile);
  const [activeLocale, setActiveLocale] = useState<AppLocale>(() =>
    project.supportedLocales.includes(interfaceLocale)
      ? interfaceLocale
      : project.defaultLocale,
  );

  const savedProductName = state.savedProductName ?? project.name;
  const savedProfile = state.savedProfile ?? initialProfile;
  const parsedProfile = brandProfileSchema.safeParse(profile);
  const hasValidProductName =
    productName.trim().length >= 2 && productName.trim().length <= 80;
  const isValid = parsedProfile.success && hasValidProductName;
  const payload = isValid
    ? JSON.stringify({
        productName: productName.trim(),
        profile: parsedProfile.data,
      })
    : '';
  const hasUnsavedChanges =
    JSON.stringify({ productName, profile }) !==
    JSON.stringify({
      productName: savedProductName,
      profile: savedProfile,
    });
  const missingTranslationCount = countMissingBrandTranslations({
    profile,
    supportedLocales: project.supportedLocales,
  });
  const saveStatus: ProfileSaveStatus = isPending
    ? 'saving'
    : state.formError
      ? 'error'
      : hasUnsavedChanges
        ? 'unsaved'
        : 'saved';

  useProjectSaveStatus(`brand-profile:${project.slug}`, saveStatus);

  useEffect(() => {
    if (state.status === 'success') {
      router.refresh();
    }
  }, [router, state.status, state.savedProfile]);

  const localeOptions = project.supportedLocales.map((locale) => ({
    value: locale,
    label: locale.toUpperCase(),
  }));
  const activeFallbackLocale = project.defaultLocale;
  const preview = useMemo(
    () =>
      createBrandPreview({
        productName,
        profile,
        locale: activeLocale,
        fallbackLocale: activeFallbackLocale,
      }),
    [activeFallbackLocale, activeLocale, productName, profile],
  );

  function updateLocalizedField(
    field: BrandLocalizedFieldKey,
    locale: AppLocale,
    value: string,
  ) {
    setProfile((currentProfile) => {
      const localizedContent = { ...currentProfile.localizedContent };
      const localizedValue = updateLocalizedString(
        localizedContent[field],
        locale,
        value,
      );

      if (localizedValue) {
        localizedContent[field] = localizedValue;
      } else {
        delete localizedContent[field];
      }

      return {
        ...currentProfile,
        localizedContent,
      };
    });
  }

  function addTerminologyEntry() {
    setProfile((currentProfile) => ({
      ...currentProfile,
      localizedContent: {
        ...currentProfile.localizedContent,
        terminology: [
          ...currentProfile.localizedContent.terminology,
          {
            preferred: {
              [activeLocale]: '',
            },
            avoid: [],
          },
        ],
      },
    }));
  }

  function updateTerminologyEntry(
    index: number,
    updater: (entry: BrandTerminologyEntry) => BrandTerminologyEntry,
  ) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      localizedContent: {
        ...currentProfile.localizedContent,
        terminology: currentProfile.localizedContent.terminology.map(
          (entry, entryIndex) =>
            entryIndex === index ? updater(entry) : entry,
        ),
      },
    }));
  }

  function removeTerminologyEntry(index: number) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      localizedContent: {
        ...currentProfile.localizedContent,
        terminology: currentProfile.localizedContent.terminology.filter(
          (_, entryIndex) => entryIndex !== index,
        ),
      },
    }));
  }

  function updateEditorialRules(value: string) {
    const localizedLines = value.split('\n');

    setProfile((currentProfile) => {
      const previousRules = currentProfile.localizedContent.editorialRules;
      const ruleCount = Math.max(previousRules.length, localizedLines.length);
      const editorialRules = Array.from({ length: ruleCount }, (_, index) =>
        updateLocalizedString(
          previousRules[index],
          activeLocale,
          localizedLines[index] ?? '',
        ),
      ).filter((rule): rule is LocalizedString => Boolean(rule));

      return {
        ...currentProfile,
        localizedContent: {
          ...currentProfile.localizedContent,
          editorialRules,
        },
      };
    });
  }

  return (
    <form
      action={formAction}
      className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden"
    >
      <input type="hidden" name="projectSlug" value={project.slug} />
      <input type="hidden" name="payload" value={payload} />

      <ProjectWorkspaceHeader
        variant="bar"
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        projectName={productName}
        status={
          missingTranslationCount > 0 ? (
            <Badge size="sm" variant="warning">
              {t('missingTranslations.badge', {
                count: missingTranslationCount,
              })}
            </Badge>
          ) : (
            <Badge size="sm" variant="success">
              {t('missingTranslations.complete')}
            </Badge>
          )
        }
        actions={
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || !hasUnsavedChanges || isPending}
          >
            {isPending ? t('actions.saving') : t('actions.save')}
          </Button>
        }
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-content-tertiary text-xs font-semibold tracking-[0.12em] uppercase">
                {t('locale.editing')}
              </p>
              <SegmentedControl
                value={activeLocale}
                options={localeOptions}
                onValueChange={setActiveLocale}
                ariaLabel={t('locale.ariaLabel')}
                className="mt-2"
              />
            </div>

            <p
              role={state.formError ? 'alert' : 'status'}
              className={[
                'text-xs font-semibold',
                state.formError
                  ? 'text-action-danger'
                  : state.status === 'success'
                    ? 'text-action-success'
                    : 'text-content-tertiary',
              ].join(' ')}
            >
              {state.formError
                ? t(`errors.${state.formError}`)
                : state.status === 'success'
                  ? t('feedback.saved')
                  : !isValid
                    ? t('feedback.invalid')
                    : hasUnsavedChanges
                      ? t('feedback.unsaved')
                      : t('feedback.savedState')}
            </p>
          </div>
        }
      />

      <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <main className="min-w-0 xl:overflow-y-auto">
          <div className="grid gap-5 p-4 sm:p-6 xl:p-7">
            <EditorSection
              title={t('identity.title')}
              description={t('identity.description')}
            >
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.45fr)]">
                <Field label={t('identity.productName')}>
                  <input
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    aria-invalid={!hasValidProductName}
                    className={inputClassName}
                  />
                </Field>

                <Field label={t('identity.slug')}>
                  <input
                    value={project.slug}
                    readOnly
                    className={`${inputClassName} text-content-tertiary font-mono`}
                  />
                </Field>
              </div>

              <Field
                label={t('fields.tagline.label')}
                locale={activeLocale}
                description={t('fields.tagline.description')}
              >
                <input
                  value={profile.localizedContent.tagline?.[activeLocale] ?? ''}
                  onChange={(event) =>
                    updateLocalizedField(
                      'tagline',
                      activeLocale,
                      event.target.value,
                    )
                  }
                  className={inputClassName}
                />
              </Field>
            </EditorSection>

            <EditorSection
              title={t('localized.title')}
              description={t('localized.description')}
            >
              {fieldRows.map((field) => (
                <Field
                  key={field.key}
                  label={t(`fields.${field.key}.label`)}
                  description={t(`fields.${field.key}.description`)}
                  locale={activeLocale}
                >
                  <textarea
                    rows={field.rows}
                    value={
                      profile.localizedContent[field.key]?.[activeLocale] ?? ''
                    }
                    onChange={(event) =>
                      updateLocalizedField(
                        field.key,
                        activeLocale,
                        event.target.value,
                      )
                    }
                    className={textareaClassName}
                  />
                </Field>
              ))}
            </EditorSection>

            <EditorSection
              title={t('direction.title')}
              description={t('direction.description')}
            >
              <fieldset>
                <legend className="text-sm font-semibold">
                  {t('direction.visualStyle')}
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {brandVisualStyles.map((visualStyle) => {
                    const isSelected = profile.visualStyle === visualStyle;

                    return (
                      <button
                        key={visualStyle}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setProfile((currentProfile) => ({
                            ...currentProfile,
                            visualStyle,
                          }))
                        }
                        className={[
                          'focus-visible:outline-border-focus min-h-20 rounded-lg border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2',
                          isSelected
                            ? 'border-action-accent bg-action-accent/10 text-content-primary'
                            : 'border-border-subtle bg-background-subtle text-content-secondary hover:border-border-default',
                        ].join(' ')}
                      >
                        <span className="block text-sm font-semibold">
                          {t(`direction.styles.${visualStyle}.label`)}
                        </span>
                        <span className="text-content-tertiary mt-1 block text-xs leading-5">
                          {t(`direction.styles.${visualStyle}.description`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold">
                  {t('direction.uiDensity')}
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {brandUiDensities.map((uiDensity) => {
                    const isSelected = profile.uiDensity === uiDensity;

                    return (
                      <button
                        key={uiDensity}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setProfile((currentProfile) => ({
                            ...currentProfile,
                            uiDensity,
                          }))
                        }
                        className={[
                          'focus-visible:outline-border-focus rounded-lg border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2',
                          isSelected
                            ? 'border-action-accent bg-action-accent/10 text-content-primary'
                            : 'border-border-subtle bg-background-subtle text-content-secondary hover:border-border-default',
                        ].join(' ')}
                      >
                        <span className="block text-sm font-semibold">
                          {t(`direction.densities.${uiDensity}.label`)}
                        </span>
                        <span className="text-content-tertiary mt-1 block text-xs">
                          {t(`direction.densities.${uiDensity}.description`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Field
                label={t('direction.keywords.label')}
                description={t('direction.keywords.description')}
              >
                <input
                  value={profile.inspirationKeywords.join(', ')}
                  onChange={(event) =>
                    setProfile((currentProfile) => ({
                      ...currentProfile,
                      inspirationKeywords: parseCommaSeparatedValues(
                        event.target.value,
                        12,
                      ),
                    }))
                  }
                  className={inputClassName}
                />
              </Field>
            </EditorSection>

            <EditorSection
              title={t('terminology.title')}
              description={t('terminology.description')}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addTerminologyEntry}
                >
                  <PlusIcon aria-hidden="true" size={14} className="mr-1.5" />
                  {t('terminology.add')}
                </Button>
              }
            >
              {profile.localizedContent.terminology.length === 0 ? (
                <p className="border-border-subtle bg-background-subtle text-content-tertiary rounded-lg border border-dashed p-4 text-sm">
                  {t('terminology.empty')}
                </p>
              ) : (
                <div className="grid gap-3">
                  {profile.localizedContent.terminology.map((entry, index) => (
                    <div
                      key={index}
                      className="border-border-subtle bg-background-subtle grid gap-3 rounded-lg border p-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]"
                    >
                      <Field
                        label={t('terminology.preferred')}
                        locale={activeLocale}
                      >
                        <input
                          value={entry.preferred[activeLocale] ?? ''}
                          onChange={(event) =>
                            updateTerminologyEntry(index, (currentEntry) => ({
                              ...currentEntry,
                              preferred:
                                updateLocalizedString(
                                  currentEntry.preferred,
                                  activeLocale,
                                  event.target.value,
                                ) ?? {},
                            }))
                          }
                          className={inputClassName}
                        />
                      </Field>

                      <Field
                        label={t('terminology.avoid')}
                        locale={activeLocale}
                      >
                        <input
                          value={entry.avoid
                            .map((term) => term[activeLocale] ?? '')
                            .filter(Boolean)
                            .join(', ')}
                          onChange={(event) =>
                            updateTerminologyEntry(index, (currentEntry) => ({
                              ...currentEntry,
                              avoid: updateLocalizedList({
                                currentValues: currentEntry.avoid,
                                locale: activeLocale,
                                values: parseCommaSeparatedValues(
                                  event.target.value,
                                  12,
                                ),
                              }),
                            }))
                          }
                          className={inputClassName}
                        />
                      </Field>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t('terminology.remove')}
                        title={t('terminology.remove')}
                        onClick={() => removeTerminologyEntry(index)}
                        className="self-end px-2"
                      >
                        <TrashIcon aria-hidden="true" size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </EditorSection>

            <EditorSection
              title={t('editorialRules.title')}
              description={t('editorialRules.description')}
            >
              <Field
                label={t('editorialRules.label')}
                locale={activeLocale}
                description={t('editorialRules.help')}
              >
                <textarea
                  rows={6}
                  value={profile.localizedContent.editorialRules
                    .map((rule) => rule[activeLocale] ?? '')
                    .join('\n')}
                  onChange={(event) => updateEditorialRules(event.target.value)}
                  className={textareaClassName}
                />
              </Field>
            </EditorSection>
          </div>
        </main>

        <aside className="border-border-subtle bg-background-sunken min-w-0 border-t p-4 sm:p-6 xl:overflow-y-auto xl:border-t-0 xl:border-l xl:p-5">
          <div className="sticky top-0 grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                {t('preview.title')}
              </p>
              <Badge size="sm">{activeLocale.toUpperCase()}</Badge>
            </div>

            <PreviewCard title={t('preview.toneTitle')}>
              <p className="text-xl font-semibold tracking-tight">
                {preview.heading}
              </p>
              <p className="text-content-secondary mt-3 text-sm leading-6">
                {preview.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="bg-content-primary text-background-app rounded-md px-3 py-2 text-xs font-semibold">
                  {t('preview.primaryAction')}
                </span>
                <span className="border-border-default bg-surface-primary rounded-md border px-3 py-2 text-xs font-semibold">
                  {t('preview.secondaryAction')}
                </span>
              </div>
            </PreviewCard>

            <div className="bg-content-primary text-background-app shadow-soft rounded-lg p-4 font-mono text-xs leading-6">
              <p className="text-background-app/60"># §1 voice</p>
              {preview.aiRules.length > 0 ? (
                preview.aiRules.map((rule, index) => (
                  <p key={`${rule}-${index}`}>- {rule}</p>
                ))
              ) : (
                <p>- {t('preview.aiEmpty')}</p>
              )}
            </div>

            {preview.usedFallback ? (
              <p className="border-action-warning/30 bg-action-warning/10 text-action-warning rounded-lg border p-3 text-xs leading-5">
                {t('preview.fallback', {
                  locale: activeLocale.toUpperCase(),
                  fallback: activeFallbackLocale.toUpperCase(),
                })}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </form>
  );
}

function EditorSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-lg border p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-content-tertiary mt-1 max-w-3xl text-sm leading-6">
            {description}
          </p>
        </div>
        {action}
      </div>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  description,
  locale,
  children,
}: {
  label: string;
  description?: string;
  locale?: AppLocale;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span>{label}</span>
        {locale ? (
          <span className="text-content-tertiary font-mono text-[0.625rem] tracking-[0.12em] uppercase">
            {locale}
          </span>
        ) : null}
      </span>
      {description ? (
        <span className="text-content-tertiary mt-1 block text-xs leading-5">
          {description}
        </span>
      ) : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function PreviewCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-lg border p-4">
      <p className="text-content-tertiary text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function updateLocalizedString(
  currentValue: LocalizedString | undefined,
  locale: AppLocale,
  value: string,
): LocalizedString | undefined {
  const nextValue: LocalizedString = {
    ...currentValue,
    [locale]: value,
  };

  if (!nextValue.en?.trim() && !nextValue.fr?.trim()) {
    return undefined;
  }

  return nextValue;
}

function parseCommaSeparatedValues(value: string, limit: number) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function updateLocalizedList({
  currentValues,
  locale,
  values,
}: {
  currentValues: LocalizedString[];
  locale: AppLocale;
  values: string[];
}) {
  const valueCount = Math.max(currentValues.length, values.length);

  return Array.from({ length: valueCount }, (_, index) =>
    updateLocalizedString(currentValues[index], locale, values[index] ?? ''),
  ).filter((value): value is LocalizedString => Boolean(value));
}

function createBrandPreview({
  productName,
  profile,
  locale,
  fallbackLocale,
}: {
  productName: string;
  profile: BrandProfile;
  locale: AppLocale;
  fallbackLocale: AppLocale;
}) {
  const tagline = resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent.tagline ?? {},
    locale,
    fallbackLocale,
  });
  const shortDescription = resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent.shortDescription ?? {},
    locale,
    fallbackLocale,
  });
  const personality = resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent.personality ?? {},
    locale,
    fallbackLocale,
  });
  const audience = resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent.audience ?? {},
    locale,
    fallbackLocale,
  });
  const toneOfVoice = resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent.toneOfVoice ?? {},
    locale,
    fallbackLocale,
  });
  const editorialRules = profile.localizedContent.editorialRules.map((rule) =>
    resolveLocalizedStringWithFallback({
      localizedString: rule,
      locale,
      fallbackLocale,
    }),
  );
  const terminologyRules = profile.localizedContent.terminology.map((entry) => {
    const preferred = resolveLocalizedStringWithFallback({
      localizedString: entry.preferred,
      locale,
      fallbackLocale,
    });
    const avoided = entry.avoid
      .map(
        (term) =>
          resolveLocalizedStringWithFallback({
            localizedString: term,
            locale,
            fallbackLocale,
          }).value,
      )
      .filter(Boolean);

    return {
      value: avoided.length
        ? `${preferred.value} — not ${avoided.join(', ')}`
        : preferred.value,
      usedFallback: preferred.usedFallback,
    };
  });
  const resolutions = [
    tagline,
    shortDescription,
    personality,
    audience,
    toneOfVoice,
    ...editorialRules,
  ];

  return {
    heading: tagline.value || productName,
    description:
      shortDescription.value ||
      personality.value ||
      audience.value ||
      productName,
    aiRules: [
      toneOfVoice.value,
      ...editorialRules.map((rule) => rule.value),
      ...terminologyRules.map((rule) => rule.value),
    ].filter(Boolean),
    usedFallback:
      resolutions.some((resolution) => resolution.usedFallback) ||
      terminologyRules.some((rule) => rule.usedFallback),
  };
}

const inputClassName =
  'border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus min-h-11 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2';

const textareaClassName =
  'border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus w-full resize-y rounded-md border px-3 py-3 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2';
