'use client';

import {
  generateAiInstructions,
  type AiInstructionsInput,
  type AiInstructionsSection,
  type AiInstructionsStrictness,
  type AiInstructionsMissingTranslation,
} from '@/domain/ai-instructions';
import { Button } from '@/components/ui';
import { useMemo, useState } from 'react';
import {
  aiInstructionsSections,
  getAiInstructionsFileName,
  aiInstructionsStrictnessLevels,
  getSelectedAiInstructionsSections,
  createDefaultAiInstructionsSectionSelection,
  type AiInstructionsSectionSelection,
} from './ai-instructions-generator.utils';
import { useTranslations } from 'next-intl';
import type { AppLocale } from '@/domain/i18n';

type AiInstructionsGeneratorClientProps = {
  projectSlug: string;
  initialLocale: AppLocale;
  fallbackLocale: AppLocale;
  aiInstructionsInput: Omit<
    AiInstructionsInput,
    'locale' | 'fallbackLocale' | 'strictness' | 'sections'
  >;
};

type CopyStatus = 'idle' | 'success' | 'error';

export function AiInstructionsGeneratorClient({
  projectSlug,
  initialLocale,
  fallbackLocale,
  aiInstructionsInput,
}: AiInstructionsGeneratorClientProps) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  const [instructionsLocale, setInstructionsLocale] =
    useState<AppLocale>(initialLocale);

  const [strictness, setStrictness] =
    useState<AiInstructionsStrictness>('strict');

  const [sectionSelection, setSectionSelection] =
    useState<AiInstructionsSectionSelection>(() =>
      createDefaultAiInstructionsSectionSelection(),
    );

  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const selectedSections = useMemo(
    () => getSelectedAiInstructionsSections(sectionSelection),
    [sectionSelection],
  );

  const generatedInstructions = useMemo(
    () =>
      generateAiInstructions({
        ...aiInstructionsInput,
        locale: instructionsLocale,
        fallbackLocale,
        strictness,
        sections: selectedSections,
      }),
    [
      aiInstructionsInput,
      fallbackLocale,
      instructionsLocale,
      strictness,
      selectedSections,
    ],
  );

  const fileName = getAiInstructionsFileName({
    projectSlug,
    locale: instructionsLocale,
  });

  async function copyInstructions() {
    try {
      await navigator.clipboard.writeText(generatedInstructions.content);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  }

  function downloadInstructions() {
    const blob = new Blob([generatedInstructions.content], {
      type: 'text/markdown;charset=utf-8',
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }

  function toggleSection(section: AiInstructionsSection) {
    setSectionSelection((currentSelection) => ({
      ...currentSelection,
      [section]: !currentSelection[section],
    }));
  }

  return (
    <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <aside className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t('controls.title')}
        </h2>

        <div className="mt-6 grid gap-6">
          <fieldset>
            <legend className="text-sm font-semibold">
              {t('controls.locale.legend')}
            </legend>

            <div className="mt-3 grid gap-2">
              {aiInstructionsInput.project.supportedLocales.map((locale) => (
                <label
                  key={locale}
                  className="border-border-subtle bg-background-subtle flex items-center gap-3 rounded-2xl border p-3 text-sm font-semibold"
                >
                  <input
                    type="radio"
                    name="instructionsLocale"
                    value={locale}
                    checked={instructionsLocale === locale}
                    onChange={() => setInstructionsLocale(locale)}
                  />
                  {t(`controls.locale.options.${locale}`)}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">
              {t('controls.strictness.legend')}
            </legend>

            <div className="mt-3 grid gap-2">
              {aiInstructionsStrictnessLevels.map((level) => (
                <label
                  key={level}
                  className="border-border-subtle bg-background-subtle flex items-center gap-3 rounded-2xl border p-3 text-sm font-semibold"
                >
                  <input
                    type="radio"
                    name="strictness"
                    value={level}
                    checked={strictness === level}
                    onChange={() => setStrictness(level)}
                  />
                  <span>
                    <span className="block">
                      {t(`controls.strictness.options.${level}.label`)}
                    </span>
                    <span className="text-content-secondary mt-1 block text-xs leading-5 font-normal">
                      {t(`controls.strictness.options.${level}.description`)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">
              {t('controls.sections.legend')}
            </legend>

            <div className="mt-3 grid gap-2">
              {aiInstructionsSections.map((section) => (
                <label
                  key={section}
                  className="border-border-subtle bg-background-subtle flex items-center gap-3 rounded-2xl border p-3 text-sm font-semibold"
                >
                  <input
                    type="checkbox"
                    checked={sectionSelection[section]}
                    onChange={() => toggleSection(section)}
                  />
                  {t(`controls.sections.options.${section}`)}
                </label>
              ))}
            </div>

            <p className="text-content-secondary mt-3 text-xs leading-5">
              {t('controls.sections.antiHallucinationNotice')}
            </p>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Button type="button" onClick={copyInstructions}>
              {t('actions.copy')}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={downloadInstructions}
            >
              {t('actions.download')}
            </Button>
          </div>

          {copyStatus === 'success' ? (
            <p
              role="status"
              className="text-action-success text-sm font-semibold"
            >
              {t('copy.success')}
            </p>
          ) : null}

          {copyStatus === 'error' ? (
            <p
              role="alert"
              className="text-action-danger text-sm font-semibold"
            >
              {t('copy.error')}
            </p>
          ) : null}
        </div>
      </aside>

      <section className="grid gap-6">
        <MissingTranslationsPanel
          missingTranslations={generatedInstructions.missingTranslations}
        />

        <article className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t('preview.title')}
              </h2>
              <p className="text-content-secondary mt-2 text-sm">
                {t('preview.fileName', { fileName })}
              </p>
            </div>

            <p className="text-content-secondary text-sm">
              {t('preview.sectionCount', { count: selectedSections.length })}
            </p>
          </div>

          <pre className="border-border-subtle bg-background-subtle mt-6 max-h-[720px] overflow-auto rounded-2xl border p-4 text-sm leading-6">
            <code>{generatedInstructions.content}</code>
          </pre>
        </article>
      </section>
    </div>
  );
}

function MissingTranslationsPanel({
  missingTranslations,
}: {
  missingTranslations: AiInstructionsMissingTranslation[];
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t('missingTranslations.title')}
      </h2>

      {missingTranslations.length > 0 ? (
        <div className="mt-4 grid gap-3">
          <p className="text-content-secondary text-sm">
            {t('missingTranslations.count', {
              count: missingTranslations.length,
            })}
          </p>

          <ul className="grid gap-2">
            {missingTranslations.map((missingTranslation) => (
              <li
                key={`${missingTranslation.path}-${missingTranslation.requestedLocale}`}
                className="border-action-warning/30 bg-action-warning/10 rounded-2xl border p-3 text-sm"
              >
                <span className="font-mono">{missingTranslation.path}</span>
                <span className="text-content-secondary ml-2">
                  {missingTranslation.requestedLocale} →{' '}
                  {missingTranslation.fallbackLocale}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-action-success mt-4 text-sm font-semibold">
          {t('missingTranslations.empty')}
        </p>
      )}
    </section>
  );
}
