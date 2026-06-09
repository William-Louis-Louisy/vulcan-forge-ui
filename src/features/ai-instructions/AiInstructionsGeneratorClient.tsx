'use client';

import {
  generateAiInstructions,
  type AiInstructionsInput,
  type AiInstructionsSection,
  type AiInstructionsStrictness,
  type AiInstructionsMissingTranslation,
} from '@/domain/ai-instructions';
import { Button } from '@/components/ui';
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
import {
  createAiInstructionsSourceDataQualityReport,
  type SourceDataQualityIssue,
  type SourceDataQualityReport,
} from '@/domain/generation/source-data-quality';
import { useActionState, useMemo, useState } from 'react';
import type { AiInstructionProfileContent } from './ai-instruction-profile.schema';
import { saveAiInstructionProfileAction } from './save-ai-instruction-profile.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { initialSaveAiInstructionProfileActionState } from './save-ai-instruction-profile.state';

type AiInstructionsGeneratorClientProps = {
  projectSlug: string;
  initialProfile: AiInstructionProfileContent;
  fallbackLocale: AppLocale;
  aiInstructionsInput: Omit<
    AiInstructionsInput,
    'locale' | 'fallbackLocale' | 'strictness' | 'sections'
  >;
};

type CopyStatus = 'idle' | 'success' | 'error';

export function AiInstructionsGeneratorClient({
  projectSlug,
  initialProfile,
  fallbackLocale,
  aiInstructionsInput,
}: AiInstructionsGeneratorClientProps) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  const [state, formAction, isPending] = useActionState(
    saveAiInstructionProfileAction,
    initialSaveAiInstructionProfileActionState,
  );

  const [instructionsLocale, setInstructionsLocale] = useState<AppLocale>(
    initialProfile.locale,
  );

  const [strictness, setStrictness] = useState<AiInstructionsStrictness>(
    initialProfile.strictness,
  );

  const [sectionSelection, setSectionSelection] =
    useState<AiInstructionsSectionSelection>(() => {
      const defaultSelection = createDefaultAiInstructionsSectionSelection();

      return {
        ...defaultSelection,
        tokenRules: initialProfile.sections.includes('tokenRules'),
        componentRules: initialProfile.sections.includes('componentRules'),
        accessibilityRules:
          initialProfile.sections.includes('accessibilityRules'),
        forbiddenPatterns:
          initialProfile.sections.includes('forbiddenPatterns'),
      };
    });

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

  const sourceDataQualityReport = useMemo(
    () => createAiInstructionsSourceDataQualityReport(aiInstructionsInput),
    [aiInstructionsInput],
  );

  const fileName = getAiInstructionsFileName({
    projectSlug,
    locale: instructionsLocale,
  });

  const currentProfile: AiInstructionProfileContent = {
    locale: instructionsLocale,
    strictness,
    sections: selectedSections,
  };

  const serializedProfile = JSON.stringify(currentProfile);
  const serializedInitialProfile = JSON.stringify(initialProfile);
  const hasUnsavedPreferences = serializedProfile !== serializedInitialProfile;

  const preserveSaveContext = usePreserveSaveContext(
    `ai-instruction-profile:${projectSlug}`,
  );

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

          <form
            action={formAction}
            onSubmitCapture={preserveSaveContext}
            className="border-border-subtle rounded-2xl border p-4"
          >
            <input type="hidden" name="locale" value={instructionsLocale} />
            <input type="hidden" name="projectSlug" value={projectSlug} />
            <input type="hidden" name="profile" value={serializedProfile} />

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {hasUnsavedPreferences
                    ? t('preferences.unsaved')
                    : t('preferences.saved')}
                </p>

                <p className="text-content-secondary mt-1 text-xs leading-5">
                  {t('preferences.description')}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending || !hasUnsavedPreferences}
              >
                {isPending ? t('preferences.saving') : t('preferences.save')}
              </Button>
            </div>

            {state.status === 'success' ? (
              <p
                role="status"
                className="text-action-success mt-3 text-sm font-semibold"
              >
                {t('preferences.success')}
              </p>
            ) : null}

            {state.formError ? (
              <p
                role="alert"
                className="text-action-danger mt-3 text-sm font-semibold"
              >
                {t(`preferences.errors.${state.formError}`)}
              </p>
            ) : null}
          </form>

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
        <SourceDataQualityPanel report={sourceDataQualityReport} />

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

function SourceDataQualityPanel({
  report,
}: {
  report: SourceDataQualityReport;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sourceQuality.title')}
          </h2>

          <p className="text-content-secondary mt-2 text-sm leading-6">
            {t('sourceQuality.description')}
          </p>
        </div>

        <span className="border-border-subtle rounded-full border px-3 py-1 text-xs font-semibold">
          {t(`sourceQuality.status.${report.status}`)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <SourceQualityMetric
          label={t('sourceQuality.summary.total')}
          value={String(report.summary.total)}
        />
        <SourceQualityMetric
          label={t('sourceQuality.summary.critical')}
          value={String(report.summary.critical)}
        />
        <SourceQualityMetric
          label={t('sourceQuality.summary.warning')}
          value={String(report.summary.warning)}
        />
        <SourceQualityMetric
          label={t('sourceQuality.summary.info')}
          value={String(report.summary.info)}
        />
      </div>

      {report.issues.length > 0 ? (
        <ul className="mt-5 grid gap-2">
          {report.issues.map((issue) => (
            <SourceQualityIssueItem
              key={issue.id}
              issue={issue}
              labels={{
                title: getDocumentationSourceQualityIssueTitle(t, issue),
                severity: t(`sourceQuality.severity.${issue.severity}`),
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="text-action-success mt-5 text-sm font-semibold">
          {t('sourceQuality.empty')}
        </p>
      )}
    </section>
  );
}

function SourceQualityMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-border-subtle bg-background-subtle rounded-2xl border p-3">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function SourceQualityIssueItem({
  issue,
  labels,
}: {
  issue: SourceDataQualityIssue;
  labels: {
    title: string;
    severity: string;
  };
}) {
  return (
    <li className="border-border-subtle bg-background-subtle rounded-2xl border p-3 text-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold">{labels.title}</p>

          <p className="text-content-tertiary mt-1 font-mono text-xs break-all">
            {issue.path}
          </p>

          {issue.label ? (
            <p className="text-content-secondary mt-1 text-xs">{issue.label}</p>
          ) : null}
        </div>

        <span className="border-border-subtle rounded-full border px-3 py-1 text-xs font-semibold">
          {labels.severity}
        </span>
      </div>
    </li>
  );
}

function getDocumentationSourceQualityIssueTitle(
  t: ReturnType<typeof useTranslations<'AiInstructionsGeneratorPage'>>,
  issue: SourceDataQualityIssue,
) {
  const count = issue.count ?? 0;

  switch (issue.code) {
    case 'missingProjectDescription':
      return t('sourceQuality.issues.missingProjectDescription');
    case 'missingTokens':
      return t('sourceQuality.issues.missingTokens');
    case 'missingTokenDescriptions':
      return t('sourceQuality.issues.missingTokenDescriptions', { count });
    case 'missingThemes':
      return t('sourceQuality.issues.missingThemes');
    case 'missingAccessibilityReport':
      return t('sourceQuality.issues.missingAccessibilityReport');
    case 'missingAccessibilityContrastPairs':
      return t('sourceQuality.issues.missingAccessibilityContrastPairs');
    case 'missingComponents':
      return t('sourceQuality.issues.missingComponents');
    case 'componentMissingAnatomy':
      return t('sourceQuality.issues.componentMissingAnatomy');
    case 'componentMissingVariants':
      return t('sourceQuality.issues.componentMissingVariants');
    case 'componentMissingStates':
      return t('sourceQuality.issues.componentMissingStates');
    case 'componentMissingAccessibilityRules':
      return t('sourceQuality.issues.componentMissingAccessibilityRules');
    case 'componentMissingForbiddenPatterns':
      return t('sourceQuality.issues.componentMissingForbiddenPatterns');
  }
}
