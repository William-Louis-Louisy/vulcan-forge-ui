'use client';

import { useActionState, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import {
  accessibilityTargets,
  designSystemPlatforms,
  visualDirections,
  type CreateDesignSystemValidationMessageKey,
} from './create-design-system.schema';
import { createDesignSystemAction } from './create-design-system.action';
import {
  createDesignSystemSteps,
  initialCreateDesignSystemActionState,
  type CreateDesignSystemActionState,
  type CreateDesignSystemStep,
} from './create-design-system.state';

type CreateDesignSystemWizardProps = {
  locale: Locale;
};

type WizardValues = CreateDesignSystemActionState['values'];

type WizardErrors = Partial<
  Record<keyof WizardValues, CreateDesignSystemValidationMessageKey[]>
>;

function getFirstError(
  errors: WizardErrors | undefined,
  field: keyof WizardValues,
) {
  return errors?.[field]?.[0] ?? null;
}

function toggleArrayValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function validateStep(
  step: CreateDesignSystemStep,
  values: WizardValues,
): WizardErrors {
  const errors: WizardErrors = {};

  if (step === 'basics') {
    if (values.name.trim().length < 2) {
      errors.name = ['nameMinLength'];
    }

    if (values.name.trim().length > 80) {
      errors.name = ['nameTooLong'];
    }

    if (values.description.trim().length > 240) {
      errors.description = ['descriptionTooLong'];
    }
  }

  if (step === 'platformsLanguages') {
    if (values.platforms.length === 0) {
      errors.platforms = ['platformRequired'];
    }

    if (!['en', 'fr'].includes(values.defaultLocale)) {
      errors.defaultLocale = ['defaultLocaleInvalid'];
    }

    if (values.supportedLocales.length === 0) {
      errors.supportedLocales = ['supportedLocaleRequired'];
    }
  }

  if (step === 'visualDirection' && !values.visualDirection) {
    errors.visualDirection = ['visualDirectionRequired'];
  }

  if (step === 'accessibilityTarget' && !values.accessibilityTarget) {
    errors.accessibilityTarget = ['accessibilityTargetInvalid'];
  }

  return errors;
}

function hasErrors(errors: WizardErrors) {
  return Object.values(errors).some((fieldErrors) => fieldErrors?.length);
}

export function CreateDesignSystemWizard({
  locale,
}: CreateDesignSystemWizardProps) {
  const t = useTranslations('CreateDesignSystemPage');

  const [state, formAction, isPending] = useActionState(
    createDesignSystemAction,
    initialCreateDesignSystemActionState,
  );

  const safeState = state ?? initialCreateDesignSystemActionState;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [values, setValues] = useState<WizardValues>(safeState.values);
  const [clientErrors, setClientErrors] = useState<WizardErrors>({});

  const currentStep = createDesignSystemSteps[currentStepIndex] ?? 'basics';
  const isFirstStep = currentStepIndex === 0;
  const isReviewStep = currentStep === 'review';

  const visibleErrors = useMemo(() => {
    return {
      ...safeState.fieldErrors,
      ...clientErrors,
    };
  }, [clientErrors, safeState.fieldErrors]);

  function updateValue<Field extends keyof WizardValues>(
    field: Field,
    value: WizardValues[Field],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function goToPreviousStep() {
    setClientErrors({});
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  function goToNextStep() {
    const errors = validateStep(currentStep, values);

    if (hasErrors(errors)) {
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    setCurrentStepIndex((index) =>
      Math.min(index + 1, createDesignSystemSteps.length - 1),
    );
  }

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="name" value={values.name} />
      <input type="hidden" name="description" value={values.description} />
      <input type="hidden" name="defaultLocale" value={values.defaultLocale} />
      <input
        type="hidden"
        name="visualDirection"
        value={values.visualDirection}
      />
      <input
        type="hidden"
        name="accessibilityTarget"
        value={values.accessibilityTarget}
      />

      {values.platforms.map((platform) => (
        <input key={platform} type="hidden" name="platforms" value={platform} />
      ))}

      {values.supportedLocales.map((supportedLocale) => (
        <input
          key={supportedLocale}
          type="hidden"
          name="supportedLocales"
          value={supportedLocale}
        />
      ))}

      <ol className="grid gap-2 sm:grid-cols-5" aria-label={t('steps.label')}>
        {createDesignSystemSteps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = index < currentStepIndex;

          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => {
                  if (index <= currentStepIndex) {
                    setClientErrors({});
                    setCurrentStepIndex(index);
                  }
                }}
                aria-current={isActive ? 'step' : undefined}
                className={[
                  'w-full rounded-xl border px-3 py-3 text-left text-xs font-semibold transition',
                  isActive
                    ? 'border-action-primary bg-action-primary/10 text-action-primary'
                    : 'border-border-subtle bg-background-subtle text-content-secondary',
                  isCompleted ? 'text-content-primary' : '',
                  index > currentStepIndex
                    ? 'cursor-not-allowed opacity-70'
                    : 'hover:border-action-primary',
                ].join(' ')}
              >
                <span className="block text-[0.65rem] tracking-[0.18em] uppercase">
                  {t('steps.step', { number: index + 1 })}
                </span>
                <span className="mt-1 block">{t(`steps.${step}`)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {safeState.formError ? (
        <p
          role="alert"
          className="border-action-danger/30 bg-action-danger/10 text-action-danger mt-6 rounded-lg border px-4 py-3 text-sm"
        >
          {t(`validation.${safeState.formError}`)}
        </p>
      ) : null}

      <div className="border-border-subtle bg-surface-primary shadow-soft mt-8 rounded-3xl border p-6">
        {currentStep === 'basics' ? (
          <BasicsStep
            values={values}
            errors={visibleErrors}
            onChange={updateValue}
          />
        ) : null}

        {currentStep === 'platformsLanguages' ? (
          <PlatformsLanguagesStep
            values={values}
            errors={visibleErrors}
            onChange={updateValue}
          />
        ) : null}

        {currentStep === 'visualDirection' ? (
          <VisualDirectionStep
            values={values}
            errors={visibleErrors}
            onChange={updateValue}
          />
        ) : null}

        {currentStep === 'accessibilityTarget' ? (
          <AccessibilityTargetStep
            values={values}
            errors={visibleErrors}
            onChange={updateValue}
          />
        ) : null}

        {currentStep === 'review' ? <ReviewStep values={values} /> : null}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          disabled={isFirstStep || isPending}
          onClick={goToPreviousStep}
        >
          {t('actions.back')}
        </Button>

        {isReviewStep ? (
          <Button type="submit" disabled={isPending}>
            {isPending ? t('form.submitPending') : t('form.submit')}
          </Button>
        ) : (
          <Button type="button" disabled={isPending} onClick={goToNextStep}>
            {t('actions.continue')}
          </Button>
        )}
      </div>
    </form>
  );
}

function BasicsStep({
  values,
  errors,
  onChange,
}: {
  values: WizardValues;
  errors: WizardErrors;
  onChange: <Field extends keyof WizardValues>(
    field: Field,
    value: WizardValues[Field],
  ) => void;
}) {
  const t = useTranslations('CreateDesignSystemPage');

  const nameError = getFirstError(errors, 'name');
  const descriptionError = getFirstError(errors, 'description');

  return (
    <fieldset className="space-y-5">
      <legend className="text-xl font-semibold tracking-tight">
        {t('basics.title')}
      </legend>

      <p className="text-content-secondary text-sm leading-6">
        {t('basics.description')}
      </p>

      <div>
        <label htmlFor="name" className="text-sm font-medium">
          {t('form.nameLabel')}
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? 'name-error' : 'name-help'}
          className="border-border-default bg-surface-primary text-content-primary mt-2 min-h-11 w-full rounded-lg border px-3"
        />
        <p id="name-help" className="text-content-tertiary mt-2 text-sm">
          {t('form.nameHelp')}
        </p>
        {nameError ? (
          <p id="name-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${nameError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          {t('form.descriptionLabel')}
        </label>
        <textarea
          id="description"
          value={values.description}
          rows={4}
          onChange={(event) => onChange('description', event.target.value)}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={
            descriptionError ? 'description-error' : 'description-help'
          }
          className="border-border-default bg-surface-primary text-content-primary mt-2 w-full rounded-lg border px-3 py-3"
        />
        <p id="description-help" className="text-content-tertiary mt-2 text-sm">
          {t('form.descriptionHelp')}
        </p>
        {descriptionError ? (
          <p id="description-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${descriptionError}`)}
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}

function PlatformsLanguagesStep({
  values,
  errors,
  onChange,
}: {
  values: WizardValues;
  errors: WizardErrors;
  onChange: <Field extends keyof WizardValues>(
    field: Field,
    value: WizardValues[Field],
  ) => void;
}) {
  const t = useTranslations('CreateDesignSystemPage');

  const platformError = getFirstError(errors, 'platforms');
  const defaultLocaleError = getFirstError(errors, 'defaultLocale');
  const supportedLocalesError = getFirstError(errors, 'supportedLocales');

  return (
    <fieldset className="space-y-6">
      <legend className="text-xl font-semibold tracking-tight">
        {t('platformsLanguages.title')}
      </legend>

      <p className="text-content-secondary text-sm leading-6">
        {t('platformsLanguages.description')}
      </p>

      <div>
        <p className="text-sm font-medium">{t('form.platformsLabel')}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {designSystemPlatforms.map((platform) => (
            <label
              key={platform}
              className="border-border-default bg-background-subtle flex cursor-pointer items-start gap-3 rounded-xl border p-4"
            >
              <input
                type="checkbox"
                checked={values.platforms.includes(platform)}
                onChange={() =>
                  onChange(
                    'platforms',
                    toggleArrayValue(values.platforms, platform),
                  )
                }
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-semibold">
                  {t(`form.platforms.${platform}.label`)}
                </span>
                <span className="text-content-secondary mt-1 block text-sm">
                  {t(`form.platforms.${platform}.description`)}
                </span>
              </span>
            </label>
          ))}
        </div>

        {platformError ? (
          <p className="text-action-danger mt-2 text-sm">
            {t(`validation.${platformError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="defaultLocale" className="text-sm font-medium">
          {t('form.defaultLocaleLabel')}
        </label>
        <select
          id="defaultLocale"
          value={values.defaultLocale}
          onChange={(event) => onChange('defaultLocale', event.target.value)}
          aria-invalid={Boolean(defaultLocaleError)}
          className="border-border-default bg-surface-primary text-content-primary mt-2 min-h-11 w-full rounded-lg border px-3"
        >
          <option value="en">{t('form.locales.en')}</option>
          <option value="fr">{t('form.locales.fr')}</option>
        </select>
        <p className="text-content-tertiary mt-2 text-sm">
          {t('form.defaultLocaleHelp')}
        </p>
        {defaultLocaleError ? (
          <p className="text-action-danger mt-2 text-sm">
            {t(`validation.${defaultLocaleError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium">{t('form.supportedLocalesLabel')}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(['en', 'fr'] as const).map((supportedLocale) => (
            <label
              key={supportedLocale}
              className="border-border-default bg-background-subtle flex cursor-pointer items-center gap-3 rounded-xl border p-4"
            >
              <input
                type="checkbox"
                checked={values.supportedLocales.includes(supportedLocale)}
                onChange={() =>
                  onChange(
                    'supportedLocales',
                    toggleArrayValue(values.supportedLocales, supportedLocale),
                  )
                }
              />
              <span className="text-sm font-semibold">
                {t(`form.locales.${supportedLocale}`)}
              </span>
            </label>
          ))}
        </div>

        {supportedLocalesError ? (
          <p className="text-action-danger mt-2 text-sm">
            {t(`validation.${supportedLocalesError}`)}
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}

function VisualDirectionStep({
  values,
  errors,
  onChange,
}: {
  values: WizardValues;
  errors: WizardErrors;
  onChange: <Field extends keyof WizardValues>(
    field: Field,
    value: WizardValues[Field],
  ) => void;
}) {
  const t = useTranslations('CreateDesignSystemPage');
  const visualDirectionError = getFirstError(errors, 'visualDirection');

  return (
    <fieldset className="space-y-5">
      <legend className="text-xl font-semibold tracking-tight">
        {t('visualDirection.title')}
      </legend>

      <p className="text-content-secondary text-sm leading-6">
        {t('visualDirection.description')}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {visualDirections.map((direction) => (
          <label
            key={direction}
            className="border-border-default bg-background-subtle flex cursor-pointer gap-3 rounded-xl border p-4"
          >
            <input
              type="radio"
              name="visualDirectionChoice"
              checked={values.visualDirection === direction}
              onChange={() => onChange('visualDirection', direction)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-semibold">
                {t(`form.visualDirections.${direction}.label`)}
              </span>
              <span className="text-content-secondary mt-1 block text-sm">
                {t(`form.visualDirections.${direction}.description`)}
              </span>
            </span>
          </label>
        ))}
      </div>

      {visualDirectionError ? (
        <p className="text-action-danger text-sm">
          {t(`validation.${visualDirectionError}`)}
        </p>
      ) : null}
    </fieldset>
  );
}

function AccessibilityTargetStep({
  values,
  errors,
  onChange,
}: {
  values: WizardValues;
  errors: WizardErrors;
  onChange: <Field extends keyof WizardValues>(
    field: Field,
    value: WizardValues[Field],
  ) => void;
}) {
  const t = useTranslations('CreateDesignSystemPage');
  const accessibilityTargetError = getFirstError(errors, 'accessibilityTarget');

  return (
    <fieldset className="space-y-5">
      <legend className="text-xl font-semibold tracking-tight">
        {t('accessibilityTarget.title')}
      </legend>

      <p className="text-content-secondary text-sm leading-6">
        {t('accessibilityTarget.description')}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {accessibilityTargets.map((target) => (
          <label
            key={target}
            className="border-border-default bg-background-subtle flex cursor-pointer gap-3 rounded-xl border p-4"
          >
            <input
              type="radio"
              name="accessibilityTargetChoice"
              checked={values.accessibilityTarget === target}
              onChange={() => onChange('accessibilityTarget', target)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-semibold">
                {t(`form.accessibilityTargets.${target}.label`)}
              </span>
              <span className="text-content-secondary mt-1 block text-sm">
                {t(`form.accessibilityTargets.${target}.description`)}
              </span>
            </span>
          </label>
        ))}
      </div>

      {accessibilityTargetError ? (
        <p className="text-action-danger text-sm">
          {t(`validation.${accessibilityTargetError}`)}
        </p>
      ) : null}
    </fieldset>
  );
}

function ReviewStep({ values }: { values: WizardValues }) {
  const t = useTranslations('CreateDesignSystemPage');

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {t('review.title')}
        </h2>
        <p className="text-content-secondary mt-2 text-sm leading-6">
          {t('review.description')}
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <ReviewItem label={t('form.nameLabel')} value={values.name} />
        <ReviewItem
          label={t('form.descriptionLabel')}
          value={values.description || t('review.emptyDescription')}
        />
        <ReviewItem
          label={t('form.platformsLabel')}
          value={values.platforms
            .map((platform) =>
              t(
                `form.platforms.${
                  platform as (typeof designSystemPlatforms)[number]
                }.label`,
              ),
            )
            .join(', ')}
        />
        <ReviewItem
          label={t('form.defaultLocaleLabel')}
          value={t(`form.locales.${values.defaultLocale as 'en' | 'fr'}`)}
        />
        <ReviewItem
          label={t('form.supportedLocalesLabel')}
          value={values.supportedLocales
            .map((supportedLocale) =>
              t(`form.locales.${supportedLocale as 'en' | 'fr'}`),
            )
            .join(', ')}
        />
        <ReviewItem
          label={t('visualDirection.title')}
          value={t(
            `form.visualDirections.${
              values.visualDirection as (typeof visualDirections)[number]
            }.label`,
          )}
        />
        <ReviewItem
          label={t('accessibilityTarget.title')}
          value={t(
            `form.accessibilityTargets.${
              values.accessibilityTarget as (typeof accessibilityTargets)[number]
            }.label`,
          )}
        />
      </dl>
    </section>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle bg-background-subtle rounded-xl border p-4">
      <dt className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </dt>
      <dd className="text-content-primary mt-2 text-sm font-semibold">
        {value}
      </dd>
    </div>
  );
}
