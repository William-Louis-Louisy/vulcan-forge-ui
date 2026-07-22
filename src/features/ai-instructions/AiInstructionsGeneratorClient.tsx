'use client';

import {
  generateAiInstructions,
  type AiInstructionsInput,
  type AiInstructionsMissingTranslation,
  type AiInstructionsSection,
  type AiInstructionsStrictness,
} from '@/domain/ai-instructions';
import type { AppLocale } from '@/domain/i18n';
import {
  createAiInstructionsSourceDataQualityReport,
  type SourceDataQualityIssue,
  type SourceDataQualityReport,
} from '@/domain/generation/source-data-quality';
import { Button } from '@/components/ui';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { CopyIcon, DownloadSimpleIcon } from '@phosphor-icons/react';
import { useActionState, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  aiInstructionsSections,
  aiInstructionsStrictnessLevels,
  createDefaultAiInstructionsSectionSelection,
  getAiInstructionsFileName,
  getSelectedAiInstructionsSections,
  type AiInstructionsSectionSelection,
} from './ai-instructions-generator.utils';
import type { AiInstructionProfileContent } from './ai-instruction-profile.schema';
import { saveAiInstructionProfileAction } from './save-ai-instruction-profile.action';
import { initialSaveAiInstructionProfileActionState } from './save-ai-instruction-profile.state';
import { AiInstructionsCodePreview } from './AiInstructionsCodePreview';
import {
  getAiInstructionsWorkspaceLabels,
  type AiInstructionsWorkspaceLabels,
} from './ai-instructions-workspace-labels';

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
  const interfaceLocale = useLocale() as AppLocale;
  const workspaceLabels = getAiInstructionsWorkspaceLabels(interfaceLocale);
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
    setCopyStatus('idle');
  }

  return (
    <div
      data-ai-instructions-layout-slot="workspace"
      className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]"
    >
      <aside
        data-ai-instructions-layout-slot="controls"
        className="border-border-subtle bg-background-app min-w-0 border-b p-4 md:p-6 xl:h-full xl:overflow-y-auto xl:border-r xl:border-b-0"
      >
        <header>
          <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.015em]">
            {workspaceLabels.pageTitle}
          </h1>
          <p className="text-content-tertiary mt-1 text-sm leading-6">
            {t('description')}
          </p>
          <p className="text-content-secondary mt-3 text-xs font-semibold xl:hidden">
            {aiInstructionsInput.project.name}
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-5">
          <LocaleControl
            supportedLocales={aiInstructionsInput.project.supportedLocales}
            selectedLocale={instructionsLocale}
            missingTranslations={generatedInstructions.missingTranslations}
            singleLocaleDescription={workspaceLabels.singleLocaleDescription}
            onSelect={(locale) => {
              setInstructionsLocale(locale);
              setCopyStatus('idle');
            }}
          />

          <StrictnessControl
            selectedStrictness={strictness}
            onSelect={(level) => {
              setStrictness(level);
              setCopyStatus('idle');
            }}
          />

          <SectionsControl
            selection={sectionSelection}
            onToggle={toggleSection}
          />

          <div className="border-action-warning/30 bg-action-warning/10 text-content-secondary rounded-md border px-3 py-3 text-xs leading-5">
            {workspaceLabels.generatedFromModel}
          </div>

          <PreferencesForm
            projectSlug={projectSlug}
            instructionsLocale={instructionsLocale}
            serializedProfile={serializedProfile}
            hasUnsavedPreferences={hasUnsavedPreferences}
            isPending={isPending}
            state={state}
            formAction={formAction}
            onSubmitCapture={preserveSaveContext}
          />

          <GenerationDiagnosticsPanel
            report={sourceDataQualityReport}
            missingTranslations={generatedInstructions.missingTranslations}
            labels={workspaceLabels}
          />
        </div>
      </aside>

      <section
        data-ai-instructions-layout-slot="preview"
        aria-label={workspaceLabels.codePreview}
        className="border-border-subtle bg-background-app min-w-0 border-t xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-t-0"
      >
        <header className="border-border-default bg-surface-primary sticky top-0 z-10 flex min-w-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-content-tertiary text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
              {workspaceLabels.preview}
            </p>
            <p className="mt-1 truncate font-mono text-xs font-semibold">
              {fileName}
            </p>
            <p className="text-content-tertiary mt-1 text-[0.6875rem] leading-5">
              {strictness} · {instructionsLocale} ·{' '}
              {workspaceLabels.selectedSections(selectedSections.length)} ·{' '}
              {workspaceLabels.characterCount(
                generatedInstructions.content.length,
              )}
            </p>
            <div aria-live="polite" className="mt-1 text-xs font-semibold">
              {copyStatus === 'success' ? (
                <p className="text-action-success">{t('copy.success')}</p>
              ) : null}
              {copyStatus === 'error' ? (
                <p role="alert" className="text-action-danger">
                  {t('copy.error')}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="border-action-success/30 bg-action-success/10 text-action-success rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold">
              {workspaceLabels.upToDate}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => void copyInstructions()}
            >
              <CopyIcon
                aria-hidden="true"
                size={18}
                weight="bold"
                className="size-[1.125rem] shrink-0"
              />
              {t('actions.copy')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-label={t('actions.download')}
              title={t('actions.download')}
              onClick={downloadInstructions}
              className="size-9 px-0"
            >
              <DownloadSimpleIcon
                aria-hidden="true"
                size={20}
                weight="bold"
                className="size-5 shrink-0"
              />
            </Button>
          </div>
        </header>

        <pre
          tabIndex={0}
          className="bg-background-sunken min-h-[38rem] min-w-0 flex-1 overflow-auto p-4 font-mono text-xs leading-6 md:p-6 xl:min-h-0"
        >
          <AiInstructionsCodePreview content={generatedInstructions.content} />
        </pre>
      </section>
    </div>
  );
}

function LocaleControl({
  supportedLocales,
  selectedLocale,
  missingTranslations,
  singleLocaleDescription,
  onSelect,
}: {
  supportedLocales: readonly AppLocale[];
  selectedLocale: AppLocale;
  missingTranslations: AiInstructionsMissingTranslation[];
  singleLocaleDescription: string;
  onSelect: (locale: AppLocale) => void;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');
  const isSingleLocale = supportedLocales.length === 1;

  return (
    <fieldset>
      <legend className="text-xs font-semibold">
        {t('controls.locale.legend')}
      </legend>

      {isSingleLocale ? (
        <div className="border-border-subtle bg-surface-primary mt-3 flex min-h-11 items-center gap-3 rounded-md border px-3">
          <span
            aria-hidden="true"
            className="bg-action-success size-2 shrink-0 rounded-full"
          />
          <span className="text-sm font-semibold">
            {t(`controls.locale.options.${selectedLocale}`)}
          </span>
          <span className="text-content-tertiary ml-auto text-[0.625rem] font-semibold tracking-[0.12em] uppercase">
            {selectedLocale}
          </span>
        </div>
      ) : (
        <div className="border-border-subtle bg-background-subtle mt-3 grid grid-cols-2 rounded-md border p-1">
          {supportedLocales.map((locale) => {
            const isSelected = selectedLocale === locale;

            return (
              <label key={locale} className="cursor-pointer">
                <input
                  type="radio"
                  name="instructionsLocale"
                  value={locale}
                  checked={isSelected}
                  onChange={() => onSelect(locale)}
                  className="sr-only"
                />
                <span
                  className={[
                    'focus-within:outline-border-focus flex min-h-9 items-center justify-center rounded-sm px-3 text-xs font-semibold transition focus-within:outline-2 focus-within:outline-offset-2',
                    isSelected
                      ? 'bg-content-primary text-background-app'
                      : 'text-content-secondary hover:text-content-primary',
                  ].join(' ')}
                >
                  {t(`controls.locale.options.${locale}`)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {isSingleLocale ? (
        <p className="text-content-tertiary mt-2 text-xs leading-5">
          {singleLocaleDescription}
        </p>
      ) : null}

      <p
        className={[
          'mt-2 text-xs leading-5',
          missingTranslations.length > 0
            ? 'text-action-warning'
            : 'text-action-success',
        ].join(' ')}
      >
        {missingTranslations.length > 0
          ? t('missingTranslations.count', {
              count: missingTranslations.length,
            })
          : t('missingTranslations.empty')}
      </p>
    </fieldset>
  );
}

function StrictnessControl({
  selectedStrictness,
  onSelect,
}: {
  selectedStrictness: AiInstructionsStrictness;
  onSelect: (strictness: AiInstructionsStrictness) => void;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <fieldset>
      <legend className="text-xs font-semibold">
        {t('controls.strictness.legend')}
      </legend>

      <div className="mt-3 grid gap-2">
        {aiInstructionsStrictnessLevels.map((level) => {
          const isSelected = selectedStrictness === level;

          return (
            <label
              key={level}
              className={[
                'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition',
                isSelected
                  ? 'border-action-primary bg-action-primary/5'
                  : 'border-border-subtle bg-surface-primary hover:border-border-strong',
              ].join(' ')}
            >
              <input
                type="radio"
                name="strictness"
                value={level}
                checked={isSelected}
                onChange={() => onSelect(level)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={[
                  'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                  isSelected ? 'border-action-primary' : 'border-border-strong',
                ].join(' ')}
              >
                {isSelected ? (
                  <span className="bg-action-primary size-2 rounded-full" />
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">
                  {t(`controls.strictness.options.${level}.label`)}
                </span>
                <span className="text-content-tertiary mt-1 block text-xs leading-5">
                  {t(`controls.strictness.options.${level}.description`)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SectionsControl({
  selection,
  onToggle,
}: {
  selection: AiInstructionsSectionSelection;
  onToggle: (section: AiInstructionsSection) => void;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <fieldset>
      <legend className="text-xs font-semibold">
        {t('controls.sections.legend')}
      </legend>

      <div className="border-border-subtle bg-surface-primary mt-3 divide-y overflow-hidden rounded-md border">
        {aiInstructionsSections.map((section) => {
          const isSelected = selection[section];

          return (
            <label
              key={section}
              className="hover:bg-background-subtle flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 transition"
            >
              <span className="text-xs font-semibold">
                {t(`controls.sections.options.${section}`)}
              </span>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(section)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={[
                  'relative h-5 w-9 shrink-0 rounded-full border transition',
                  isSelected
                    ? 'border-action-primary bg-action-primary'
                    : 'border-border-default bg-background-subtle',
                ].join(' ')}
              >
                <span
                  className={[
                    'bg-action-primary-content absolute top-0.5 size-3.5 rounded-full transition-transform',
                    isSelected ? 'translate-x-[1.125rem]' : 'translate-x-0.5',
                  ].join(' ')}
                />
              </span>
            </label>
          );
        })}
      </div>

      <p className="text-content-tertiary mt-2 text-xs leading-5">
        {t('controls.sections.antiHallucinationNotice')}
      </p>
    </fieldset>
  );
}

function PreferencesForm({
  projectSlug,
  instructionsLocale,
  serializedProfile,
  hasUnsavedPreferences,
  isPending,
  state,
  formAction,
  onSubmitCapture,
}: {
  projectSlug: string;
  instructionsLocale: AppLocale;
  serializedProfile: string;
  hasUnsavedPreferences: boolean;
  isPending: boolean;
  state: typeof initialSaveAiInstructionProfileActionState;
  formAction: (payload: FormData) => void;
  onSubmitCapture: () => void;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <form
      action={formAction}
      onSubmitCapture={onSubmitCapture}
      className="border-border-subtle bg-surface-primary rounded-md border p-3"
    >
      <input type="hidden" name="locale" value={instructionsLocale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="profile" value={serializedProfile} />

      <div className="grid gap-3">
        <div>
          <p className="text-xs font-semibold">
            {hasUnsavedPreferences
              ? t('preferences.unsaved')
              : t('preferences.saved')}
          </p>
          <p className="text-content-tertiary mt-1 text-xs leading-5">
            {t('preferences.description')}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending || !hasUnsavedPreferences}
          className="w-full"
        >
          {isPending ? t('preferences.saving') : t('preferences.save')}
        </Button>
      </div>

      {state.status === 'success' ? (
        <p
          role="status"
          className="text-action-success mt-3 text-xs font-semibold"
        >
          {t('preferences.success')}
        </p>
      ) : null}

      {state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-3 text-xs font-semibold"
        >
          {t(`preferences.errors.${state.formError}`)}
        </p>
      ) : null}
    </form>
  );
}

function GenerationDiagnosticsPanel({
  report,
  missingTranslations,
  labels,
}: {
  report: SourceDataQualityReport;
  missingTranslations: AiInstructionsMissingTranslation[];
  labels: AiInstructionsWorkspaceLabels;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');
  const diagnosticsCount = report.summary.total + missingTranslations.length;

  return (
    <details className="border-border-subtle bg-surface-primary rounded-md border">
      <summary className="hover:bg-background-subtle flex cursor-pointer list-none items-start justify-between gap-3 rounded-md p-3 transition">
        <span className="min-w-0">
          <span className="block text-xs font-semibold">
            {labels.diagnostics}
          </span>
          <span className="text-content-tertiary mt-1 block text-xs leading-5">
            {labels.diagnosticsDescription}
          </span>
        </span>
        <span className="border-border-subtle bg-background-subtle shrink-0 rounded-full border px-2 py-1 text-[0.625rem] font-semibold">
          {diagnosticsCount}
        </span>
      </summary>

      <div className="border-border-subtle grid gap-4 border-t p-3">
        {diagnosticsCount === 0 ? (
          <p className="text-action-success text-xs font-semibold">
            {labels.noDiagnostics}
          </p>
        ) : null}

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold">{labels.sourceQuality}</h2>
            <span className="border-border-subtle rounded-full border px-2 py-1 text-[0.625rem] font-semibold">
              {t(`sourceQuality.status.${report.status}`)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
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
            <ul className="mt-3 grid gap-2">
              {report.issues.map((issue) => (
                <SourceQualityIssueItem
                  key={issue.id}
                  issue={issue}
                  labels={{
                    title: getAiInstructionsSourceQualityIssueTitle(t, issue),
                    severity: t(`sourceQuality.severity.${issue.severity}`),
                  }}
                />
              ))}
            </ul>
          ) : (
            <p className="text-action-success mt-3 text-xs font-semibold">
              {t('sourceQuality.empty')}
            </p>
          )}
        </section>

        <section className="border-border-subtle border-t pt-4">
          <h2 className="text-xs font-semibold">{labels.translations}</h2>

          {missingTranslations.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {missingTranslations.map((missingTranslation) => (
                <li
                  key={`${missingTranslation.path}-${missingTranslation.requestedLocale}`}
                  className="border-action-warning/30 bg-action-warning/10 rounded-sm border p-2 text-xs"
                >
                  <span className="font-mono break-all">
                    {missingTranslation.path}
                  </span>
                  <span className="text-content-tertiary ml-2">
                    {missingTranslation.requestedLocale} →{' '}
                    {missingTranslation.fallbackLocale}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-action-success mt-3 text-xs font-semibold">
              {t('missingTranslations.empty')}
            </p>
          )}
        </section>
      </div>
    </details>
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
    <div className="border-border-subtle bg-background-subtle rounded-sm border p-2 text-center">
      <p className="text-content-tertiary truncate text-[0.5625rem] font-semibold tracking-[0.08em] uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
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
    <li className="border-border-subtle bg-background-subtle rounded-sm border p-2 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">{labels.title}</p>
          <p className="text-content-tertiary mt-1 font-mono break-all">
            {issue.path}
          </p>
          {issue.label ? (
            <p className="text-content-secondary mt-1">{issue.label}</p>
          ) : null}
        </div>
        <span className="border-border-subtle shrink-0 rounded-full border px-2 py-1 text-[0.625rem] font-semibold">
          {labels.severity}
        </span>
      </div>
    </li>
  );
}

function getAiInstructionsSourceQualityIssueTitle(
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
