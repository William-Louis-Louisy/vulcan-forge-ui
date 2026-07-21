'use client';

import {
  generateMarkdownDocumentation,
  type MarkdownDocumentationInput,
  type MarkdownDocumentationMissingTranslation,
  type MarkdownDocumentationSection,
} from '@/domain/documentation';
import {
  ArrowClockwiseIcon,
  CopyIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui';
import {
  createDefaultDocumentationSectionSelection,
  documentationSections,
  getDocumentationFileName,
  getSelectedDocumentationSections,
  type DocumentationSectionSelection,
} from './documentation-generator.utils';
import {
  createDocumentationSourceDataQualityReport,
  type SourceDataQualityIssue,
  type SourceDataQualityReport,
} from '@/domain/generation/source-data-quality';
import {
  formatDocumentationCharacterCount,
  getDocumentationWorkspaceLabels,
  type DocumentationWorkspaceLabels,
} from './documentation-workspace-labels';
import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DocumentationMarkdownPreview } from './DocumentationMarkdownPreview';
import type { AppLocale } from '@/domain/i18n';
import type { DocumentationProfileContent } from './documentation-profile.schema';
import { initialSaveDocumentationProfileActionState } from './save-documentation-profile.state';
import { saveDocumentationProfileAction } from './save-documentation-profile.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useTranslations } from 'next-intl';

type DocumentationGeneratorClientProps = {
  interfaceLocale: AppLocale;
  projectSlug: string;
  initialProfile: DocumentationProfileContent;
  fallbackLocale: AppLocale;
  documentationInput: Omit<
    MarkdownDocumentationInput,
    'locale' | 'fallbackLocale' | 'sections'
  >;
};

type CopyStatus = 'idle' | 'success' | 'error';
type PreviewMode = 'rendered' | 'source';

export function DocumentationGeneratorClient({
  interfaceLocale,
  projectSlug,
  initialProfile,
  fallbackLocale,
  documentationInput,
}: DocumentationGeneratorClientProps) {
  const t = useTranslations('DocumentationGeneratorPage');
  const workspaceLabels = getDocumentationWorkspaceLabels(interfaceLocale);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const preserveSaveContext = usePreserveSaveContext(
    `documentation-profile:${projectSlug}`,
  );
  const [state, formAction, isPending] = useActionState(
    saveDocumentationProfileAction,
    initialSaveDocumentationProfileActionState,
  );
  const [documentationLocale, setDocumentationLocale] = useState<AppLocale>(
    initialProfile.locale,
  );
  const [sectionSelection, setSectionSelection] =
    useState<DocumentationSectionSelection>(() => {
      const defaultSelection = createDefaultDocumentationSectionSelection();

      return {
        ...defaultSelection,
        overview: initialProfile.sections.includes('overview'),
        tokens: initialProfile.sections.includes('tokens'),
        themes: initialProfile.sections.includes('themes'),
        components: initialProfile.sections.includes('components'),
        accessibility: initialProfile.sections.includes('accessibility'),
      };
    });
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('rendered');
  const [generationStatus, setGenerationStatus] = useState(false);

  const selectedSections = useMemo(
    () => getSelectedDocumentationSections(sectionSelection),
    [sectionSelection],
  );
  const generatedDocumentation = useMemo(
    () =>
      generateMarkdownDocumentation({
        ...documentationInput,
        locale: documentationLocale,
        fallbackLocale,
        sections: selectedSections,
      }),
    [documentationInput, documentationLocale, fallbackLocale, selectedSections],
  );
  const sourceDataQualityReport = useMemo(
    () => createDocumentationSourceDataQualityReport(documentationInput),
    [documentationInput],
  );
  const fileName = getDocumentationFileName({
    projectSlug,
    locale: documentationLocale,
  });
  const currentProfile: DocumentationProfileContent = {
    locale: documentationLocale,
    sections: selectedSections,
    format: 'markdown',
  };
  const serializedProfile = JSON.stringify(currentProfile);
  const serializedInitialProfile = JSON.stringify(initialProfile);
  const hasUnsavedPreferences = serializedProfile !== serializedInitialProfile;

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(generatedDocumentation.markdown);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  }

  function downloadMarkdown() {
    const blob = new Blob([generatedDocumentation.markdown], {
      type: 'text/markdown;charset=utf-8',
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }

  function selectLocale(locale: AppLocale) {
    setDocumentationLocale(locale);
    resetTransientStatus();
  }

  function toggleSection(section: MarkdownDocumentationSection) {
    setSectionSelection((currentSelection) => ({
      ...currentSelection,
      [section]: !currentSelection[section],
    }));
    resetTransientStatus();
  }

  function generatePreview() {
    setPreviewMode('rendered');
    setGenerationStatus(true);
    previewScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetTransientStatus() {
    setCopyStatus('idle');
    setGenerationStatus(false);
  }

  return (
    <div
      data-documentation-layout-slot="workspace"
      className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]"
    >
      <aside
        data-documentation-layout-slot="controls"
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
          <p className="text-content-secondary mt-3 text-xs font-semibold">
            {documentationInput.project.name}
          </p>
        </header>

        <div className="mt-6 grid gap-6">
          <LocaleControl
            supportedLocales={documentationInput.project.supportedLocales}
            selectedLocale={documentationLocale}
            missingTranslations={generatedDocumentation.missingTranslations}
            onSelect={selectLocale}
          />

          <SectionControls
            selection={sectionSelection}
            onToggle={toggleSection}
          />

          <FormatControl labels={workspaceLabels} />

          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
            <Button
              type="button"
              onClick={generatePreview}
              disabled={selectedSections.length === 0}
              className="gap-2"
            >
              <ArrowClockwiseIcon aria-hidden="true" size={16} weight="bold" />
              {workspaceLabels.generate}
            </Button>
            <Button
              type="button"
              variant="secondary"
              aria-label={t('actions.copy')}
              title={t('actions.copy')}
              onClick={copyMarkdown}
              className="size-10 px-0"
            >
              <CopyIcon aria-hidden="true" size={16} weight="bold" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              aria-label={t('actions.download')}
              title={t('actions.download')}
              onClick={downloadMarkdown}
              className="size-10 px-0"
            >
              <DownloadSimpleIcon aria-hidden="true" size={16} weight="bold" />
            </Button>
          </div>

          <div aria-live="polite" className="min-h-5 text-xs font-semibold">
            {generationStatus ? (
              <p className="text-action-success">{workspaceLabels.generated}</p>
            ) : null}
            {copyStatus === 'success' ? (
              <p className="text-action-success">{t('copy.success')}</p>
            ) : null}
            {copyStatus === 'error' ? (
              <p role="alert" className="text-action-danger">
                {t('copy.error')}
              </p>
            ) : null}
          </div>

          <PreferencesForm
            projectSlug={projectSlug}
            documentationLocale={documentationLocale}
            serializedProfile={serializedProfile}
            selectedSectionCount={selectedSections.length}
            hasUnsavedPreferences={hasUnsavedPreferences}
            state={state}
            isPending={isPending}
            formAction={formAction}
            onSubmitCapture={preserveSaveContext}
          />

          <GenerationDiagnostics
            report={sourceDataQualityReport}
            missingTranslations={generatedDocumentation.missingTranslations}
            labels={workspaceLabels}
          />
        </div>
      </aside>

      <section
        data-documentation-layout-slot="preview"
        className="bg-surface-primary min-w-0 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden"
      >
        <header className="border-border-subtle bg-surface-primary sticky top-0 z-10 flex min-w-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-content-tertiary truncate font-mono text-xs">
              {t('preview.title')} · {fileName} ·{' '}
              {formatDocumentationCharacterCount(
                workspaceLabels.characterCount,
                generatedDocumentation.markdown.length,
              )}
            </p>
            <p className="text-content-secondary mt-1 text-xs">
              {t('preview.sectionCount', { count: selectedSections.length })}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={workspaceLabels.previewModes}
            className="border-border-subtle bg-background-subtle inline-flex w-fit rounded-md border p-1"
          >
            <PreviewModeButton
              mode="rendered"
              selectedMode={previewMode}
              onSelect={setPreviewMode}
            >
              {workspaceLabels.rendered}
            </PreviewModeButton>
            <PreviewModeButton
              mode="source"
              selectedMode={previewMode}
              onSelect={setPreviewMode}
            >
              {workspaceLabels.source}
            </PreviewModeButton>
          </div>
        </header>

        <div
          ref={previewScrollRef}
          id="documentation-preview-panel"
          role="tabpanel"
          aria-labelledby={`documentation-preview-${previewMode}`}
          className="min-h-[36rem] min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto"
        >
          {previewMode === 'rendered' ? (
            <DocumentationMarkdownPreview
              markdown={generatedDocumentation.markdown}
            />
          ) : (
            <pre className="bg-background-sunken min-h-full min-w-full overflow-x-auto p-5 text-xs leading-6 sm:p-8">
              <code>{generatedDocumentation.markdown}</code>
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}

function LocaleControl({
  supportedLocales,
  selectedLocale,
  missingTranslations,
  onSelect,
}: {
  supportedLocales: readonly AppLocale[];
  selectedLocale: AppLocale;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
  onSelect: (locale: AppLocale) => void;
}) {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        {t('controls.locale.legend')}
      </legend>
      <div className="border-border-subtle bg-background-subtle mt-3 grid grid-cols-2 rounded-md border p-1">
        {supportedLocales.map((locale) => {
          const isSelected = selectedLocale === locale;

          return (
            <label key={locale} className="cursor-pointer">
              <input
                type="radio"
                name="documentationLocale"
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

function SectionControls({
  selection,
  onToggle,
}: {
  selection: DocumentationSectionSelection;
  onToggle: (section: MarkdownDocumentationSection) => void;
}) {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        {t('controls.sections.legend')}
      </legend>
      <div className="border-border-subtle bg-surface-primary mt-3 divide-y overflow-hidden rounded-md border">
        {documentationSections.map((section) => {
          const isSelected = selection[section];

          return (
            <label
              key={section}
              className="hover:bg-background-subtle flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3 py-2 text-sm font-medium transition"
            >
              <span>{t(`controls.sections.options.${section}`)}</span>
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
    </fieldset>
  );
}

function FormatControl({ labels }: { labels: DocumentationWorkspaceLabels }) {
  return (
    <section aria-labelledby="documentation-format-title">
      <h2 id="documentation-format-title" className="text-sm font-semibold">
        {labels.format}
      </h2>
      <div className="border-border-subtle bg-surface-primary mt-3 rounded-md border p-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="border-action-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border"
          >
            <span className="bg-action-primary size-2 rounded-full" />
          </span>
          <div>
            <p className="text-sm font-semibold">{labels.markdown}</p>
            <p className="text-content-tertiary mt-1 text-xs leading-5">
              {labels.markdownDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreferencesForm({
  projectSlug,
  documentationLocale,
  serializedProfile,
  selectedSectionCount,
  hasUnsavedPreferences,
  state,
  isPending,
  formAction,
  onSubmitCapture,
}: {
  projectSlug: string;
  documentationLocale: AppLocale;
  serializedProfile: string;
  selectedSectionCount: number;
  hasUnsavedPreferences: boolean;
  state: typeof initialSaveDocumentationProfileActionState;
  isPending: boolean;
  formAction: (payload: FormData) => void;
  onSubmitCapture: () => void;
}) {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <form
      action={formAction}
      onSubmitCapture={onSubmitCapture}
      className="border-border-subtle border-t pt-4"
    >
      <input type="hidden" name="locale" value={documentationLocale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="profile" value={serializedProfile} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
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
          variant="secondary"
          size="sm"
          disabled={
            isPending || selectedSectionCount === 0 || !hasUnsavedPreferences
          }
          className="shrink-0"
        >
          {isPending ? t('preferences.saving') : t('preferences.save')}
        </Button>
      </div>

      {state.status === 'success' ? (
        <p
          role="status"
          className="text-action-success mt-2 text-xs font-semibold"
        >
          {t('preferences.success')}
        </p>
      ) : null}
      {state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`preferences.errors.${state.formError}`)}
        </p>
      ) : null}
    </form>
  );
}

function GenerationDiagnostics({
  report,
  missingTranslations,
  labels,
}: {
  report: SourceDataQualityReport;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
  labels: DocumentationWorkspaceLabels;
}) {
  const t = useTranslations('DocumentationGeneratorPage');
  const issueCount = report.issues.length + missingTranslations.length;

  return (
    <details className="border-border-subtle bg-surface-primary overflow-hidden rounded-md border">
      <summary className="hover:bg-background-subtle flex cursor-pointer list-none items-start justify-between gap-3 px-3 py-3 transition marker:hidden">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{labels.diagnostics}</p>
          <p className="text-content-tertiary mt-1 text-xs leading-5">
            {labels.diagnosticsDescription}
          </p>
        </div>
        <span className="border-border-subtle bg-background-subtle shrink-0 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold">
          {issueCount}
        </span>
      </summary>

      <div className="border-border-subtle grid gap-4 border-t p-3">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold">{labels.sourceIssues}</h3>
            <span className={getSourceQualityStatusClassName(report.status)}>
              {t(`sourceQuality.status.${report.status}`)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            <DiagnosticMetric
              label={t('sourceQuality.summary.total')}
              value={report.summary.total}
            />
            <DiagnosticMetric
              label={t('sourceQuality.summary.critical')}
              value={report.summary.critical}
            />
            <DiagnosticMetric
              label={t('sourceQuality.summary.warning')}
              value={report.summary.warning}
            />
            <DiagnosticMetric
              label={t('sourceQuality.summary.info')}
              value={report.summary.info}
            />
          </div>

          {report.issues.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {report.issues.map((issue) => (
                <SourceQualityIssueItem
                  key={issue.id}
                  issue={issue}
                  title={getDocumentationSourceQualityIssueTitle(t, issue)}
                  severity={t(`sourceQuality.severity.${issue.severity}`)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-action-success mt-3 text-xs font-semibold">
              {labels.noSourceIssues}
            </p>
          )}
        </section>

        <section className="border-border-subtle border-t pt-4">
          <h3 className="text-xs font-semibold">
            {labels.translationFallbacks}
          </h3>
          {missingTranslations.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {missingTranslations.map((missingTranslation) => (
                <li
                  key={`${missingTranslation.path}-${missingTranslation.requestedLocale}`}
                  className="border-action-warning/30 bg-action-warning/10 rounded-sm border p-2 text-xs"
                >
                  <p className="font-mono break-all">
                    {missingTranslation.path}
                  </p>
                  <p className="text-content-secondary mt-1">
                    {missingTranslation.requestedLocale.toUpperCase()} →{' '}
                    {missingTranslation.fallbackLocale.toUpperCase()}
                  </p>
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

function PreviewModeButton({
  mode,
  selectedMode,
  onSelect,
  children,
}: {
  mode: PreviewMode;
  selectedMode: PreviewMode;
  onSelect: (mode: PreviewMode) => void;
  children: ReactNode;
}) {
  const isSelected = mode === selectedMode;

  return (
    <button
      id={`documentation-preview-${mode}`}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls="documentation-preview-panel"
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(mode)}
      className={[
        'focus-visible:outline-border-focus rounded-sm px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2',
        isSelected
          ? 'bg-content-primary text-background-app'
          : 'text-content-secondary hover:text-content-primary',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function DiagnosticMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-border-subtle bg-background-subtle min-w-0 rounded-sm border p-2">
      <p className="text-content-tertiary truncate text-[0.625rem] font-semibold uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function SourceQualityIssueItem({
  issue,
  title,
  severity,
}: {
  issue: SourceDataQualityIssue;
  title: string;
  severity: string;
}) {
  return (
    <li className="border-border-subtle bg-background-subtle rounded-sm border p-2 text-xs">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold">{title}</p>
        <span className="border-border-subtle shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold">
          {severity}
        </span>
      </div>
      <p className="text-content-tertiary mt-1 font-mono break-all">
        {issue.path}
      </p>
      {issue.label ? (
        <p className="text-content-secondary mt-1">{issue.label}</p>
      ) : null}
    </li>
  );
}

function getSourceQualityStatusClassName(
  status: SourceDataQualityReport['status'],
): string {
  return [
    'shrink-0 rounded-full px-2 py-1 text-[0.6875rem] font-semibold',
    status === 'ready'
      ? 'bg-action-success/10 text-action-success'
      : status === 'insufficient'
        ? 'bg-action-danger/10 text-action-danger'
        : 'bg-action-warning/10 text-action-warning',
  ].join(' ');
}

function getDocumentationSourceQualityIssueTitle(
  t: ReturnType<typeof useTranslations<'DocumentationGeneratorPage'>>,
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
