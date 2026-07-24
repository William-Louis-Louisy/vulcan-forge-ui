'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
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
import type { AppLocale, LocalizedString } from '@/domain/i18n';
import { useRouter } from '@/i18n/navigation';
import { saveBrandProfileAction } from './save-brand-profile.action';
import { initialSaveBrandProfileActionState } from './save-brand-profile.state';
import {
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
  const [terminologyRevision, setTerminologyRevision] = useState(0);
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
    setTerminologyRevision((currentRevision) => currentRevision + 1);
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
    setTerminologyRevision((currentRevision) => currentRevision + 1);
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

  const feedback = state.formError
    ? t(`errors.${state.formError}`)
    : state.status === 'success'
      ? t('feedback.saved')
      : !isValid
        ? t('feedback.invalid')
        : hasUnsavedChanges
          ? t('feedback.unsaved')
          : t('feedback.savedState');

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
        actions={
          <div className="flex flex-wrap items-center justify-end gap-3">
            {missingTranslationCount > 0 ? (
              <Badge size="sm" variant="warning">
                {t('missingTranslations.badge', {
                  count: missingTranslationCount,
                })}
              </Badge>
            ) : (
              <Badge size="sm" variant="success">
                {t('missingTranslations.complete')}
              </Badge>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={!isValid || !hasUnsavedChanges || isPending}
            >
              {isPending ? t('actions.saving') : t('actions.save')}
            </Button>
          </div>
        }
      />

      <div className="border-border-subtle bg-background-app flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:px-6 xl:px-7">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.12em] uppercase">
            {t('locale.editing')}
          </p>
          <SegmentedControl
            value={activeLocale}
            options={localeOptions}
            onValueChange={setActiveLocale}
            ariaLabel={t('locale.ariaLabel')}
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
                : hasUnsavedChanges
                  ? 'text-action-warning'
                  : 'text-content-tertiary',
          ].join(' ')}
        >
          {feedback}
        </p>
      </div>

      <main className="min-h-0 min-w-0 flex-1 xl:overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 xl:px-7">
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
                  className={`${inputClassName} bg-background-subtle text-content-tertiary font-mono`}
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
            <div className="grid gap-5 xl:grid-cols-2">
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
            </div>
          </EditorSection>

          <EditorSection
            title={t('direction.title')}
            description={t('direction.description')}
          >
            <fieldset>
              <legend className="text-sm font-semibold">
                {t('direction.visualStyle')}
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
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
                        'focus-visible:outline-border-focus rounded-md border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2',
                        isSelected
                          ? 'border-action-accent bg-action-accent/10 text-content-primary'
                          : 'border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default',
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
                        'focus-visible:outline-border-focus rounded-md border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2',
                        isSelected
                          ? 'border-action-accent bg-action-accent/10 text-content-primary'
                          : 'border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default',
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
                defaultValue={profile.inspirationKeywords.join(', ')}
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
              <p className="border-border-subtle bg-background-subtle text-content-tertiary rounded-md border border-dashed p-4 text-sm">
                {t('terminology.empty')}
              </p>
            ) : (
              <div className="border-border-subtle divide-border-subtle divide-y rounded-md border">
                {profile.localizedContent.terminology.map((entry, index) => (
                  <div
                    key={index}
                    className="grid gap-3 p-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]"
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

                    <Field label={t('terminology.avoid')} locale={activeLocale}>
                      <input
                        key={`${terminologyRevision}-${activeLocale}-${index}`}
                        defaultValue={entry.avoid
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
                key={activeLocale}
                rows={6}
                defaultValue={profile.localizedContent.editorialRules
                  .map((rule) => rule[activeLocale] ?? '')
                  .join('\n')}
                onChange={(event) => updateEditorialRules(event.target.value)}
                className={textareaClassName}
              />
            </Field>
          </EditorSection>
        </div>
      </main>
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
    <section className="border-border-subtle grid gap-5 border-b py-6 last:border-b-0 md:py-7 lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] lg:gap-10">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 lg:block">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="text-content-tertiary mt-1 text-sm leading-6">
            {description}
          </p>
        </div>
        {action ? <div className="lg:mt-4">{action}</div> : null}
      </div>
      <div className="grid min-w-0 gap-5">{children}</div>
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

const inputClassName =
  'border-border-subtle bg-surface-primary text-content-primary focus:border-action-primary w-full rounded-md border px-3 py-2 text-sm outline-none';

const textareaClassName =
  'border-border-subtle bg-surface-primary text-content-primary focus:border-action-primary w-full resize-y rounded-md border px-3 py-2 text-sm leading-6 outline-none';
