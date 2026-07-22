'use client';

import {
  generateCssVariablesExport,
  generateReactNativeThemeExport,
  generateTailwindV4Export,
  generateTypeScriptThemeExport,
  type CssVariablesExportSkippedToken,
  type CssVariablesExportThemeResolutionIssue,
} from '@/domain/exports';
import {
  exportCenterFormats,
  fromExportLogFormat,
  type ExportCenterFormat,
} from './export-center.utils';
import type {
  ExportCenterInput,
  ExportCenterLog,
} from './export-center.queries';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/domain/i18n';
import { useMemo, useState, useTransition } from 'react';
import { generateAiInstructions } from '@/domain/ai-instructions';
import { generateMarkdownDocumentation } from '@/domain/documentation';
import { logExportAction, type LogExportStatus } from './log-export.action';
import type { AiInstructionsMissingTranslation } from '@/domain/ai-instructions';
import type { MarkdownDocumentationMissingTranslation } from '@/domain/documentation';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import type { DocumentationProfileContent } from '@/features/documentation/documentation-profile.schema';
import type { AiInstructionProfileContent } from '@/features/ai-instructions/ai-instruction-profile.schema';
import { CopyIcon, DownloadSimpleIcon } from '@phosphor-icons/react';
import {
  formatDiagnosticsCount,
  formatExportCharacterCount,
  formatExportFileSize,
  getExportCenterWorkspaceLabels,
  type ExportCenterWorkspaceLabels,
} from './export-center-workspace-labels';
import { ExportCodePreview } from './ExportCodePreview';

type CopyStatus = {
  format: ExportCenterFormat;
  state: 'success' | 'error';
} | null;

type ExportCenterOutput = {
  format: ExportCenterFormat;
  locale: AppLocale | null;
  fileName: string;
  content: string;
  skippedTokens: CssVariablesExportSkippedToken[];
  themeResolutionIssues: CssVariablesExportThemeResolutionIssue[];
  missingTranslations: Array<
    MarkdownDocumentationMissingTranslation | AiInstructionsMissingTranslation
  >;
};

type ExportCenterClientProps = {
  projectSlug: string;
  fallbackLocale: ExportCenterInput['project']['defaultLocale'];
  exportCenterInput: ExportCenterInput;
  documentationProfile: DocumentationProfileContent;
  aiInstructionProfile: AiInstructionProfileContent;
  exportLogs: ExportCenterLog[];
};

type FormatPresentation = {
  extension: 'CSS' | 'TS' | 'MD';
  extensionClassName: string;
  platforms: string[];
};

function getSelectedExportOutput({
  outputs,
  selectedFormat,
}: {
  outputs: ExportCenterOutput[];
  selectedFormat: ExportCenterFormat;
}): ExportCenterOutput {
  const output = outputs.find(
    (candidateOutput) => candidateOutput.format === selectedFormat,
  );

  if (!output) {
    throw new Error(`Missing export output for format: ${selectedFormat}`);
  }

  return output;
}

function getOutputDiagnosticsCount(output: ExportCenterOutput): number {
  return (
    output.skippedTokens.length +
    output.themeResolutionIssues.length +
    output.missingTranslations.length
  );
}

function getFormatPresentation({
  format,
  labels,
}: {
  format: ExportCenterFormat;
  labels: ExportCenterWorkspaceLabels;
}): FormatPresentation {
  switch (format) {
    case 'cssVariables':
      return {
        extension: 'CSS',
        extensionClassName:
          'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
        platforms: [labels.web],
      };
    case 'tailwindV4':
      return {
        extension: 'CSS',
        extensionClassName:
          'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300',
        platforms: [labels.web, 'Tailwind 4+'],
      };
    case 'typescriptTheme':
      return {
        extension: 'TS',
        extensionClassName:
          'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
        platforms: [labels.web, labels.sharedPackages],
      };
    case 'reactNativeTheme':
      return {
        extension: 'TS',
        extensionClassName:
          'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
        platforms: ['iOS', 'Android'],
      };
    case 'documentationMarkdown':
      return {
        extension: 'MD',
        extensionClassName:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        platforms: [labels.documentation],
      };
    case 'aiInstructions':
      return {
        extension: 'MD',
        extensionClassName:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        platforms: [labels.artificialIntelligence],
      };
  }
}

export function ExportCenterClient({
  projectSlug,
  fallbackLocale,
  exportCenterInput,
  documentationProfile,
  aiInstructionProfile,
  exportLogs,
}: ExportCenterClientProps) {
  const t = useTranslations('ExportCenterPage');
  const router = useRouter();
  const pageLocale = useLocale() as AppLocale;
  const workspaceLabels = getExportCenterWorkspaceLabels(pageLocale);
  const [isLoggingExport, startLoggingExportTransition] = useTransition();
  const [logStatus, setLogStatus] = useState<'idle' | 'error'>('idle');
  const [selectedFormat, setSelectedFormat] =
    useState<ExportCenterFormat>('cssVariables');
  const [includeDeprecated, setIncludeDeprecated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const preserveSaveContext = usePreserveSaveContext(
    `export-center:${projectSlug}`,
  );

  const formatLabels: Record<ExportCenterFormat, string> = {
    cssVariables: t('formats.cssVariables.label'),
    tailwindV4: t('formats.tailwindV4.label'),
    typescriptTheme: t('formats.typescriptTheme.label'),
    reactNativeTheme: t('formats.reactNativeTheme.label'),
    documentationMarkdown: t('formats.documentationMarkdown.label'),
    aiInstructions: t('formats.aiInstructions.label'),
  };

  const formatDescriptions: Record<ExportCenterFormat, string> = {
    cssVariables: t('formats.cssVariables.description'),
    tailwindV4: t('formats.tailwindV4.description'),
    typescriptTheme: t('formats.typescriptTheme.description'),
    reactNativeTheme: t('formats.reactNativeTheme.description'),
    documentationMarkdown: t('formats.documentationMarkdown.description'),
    aiInstructions: t('formats.aiInstructions.description'),
  };

  const exportOutputs = useMemo<ExportCenterOutput[]>(() => {
    const commonExportInput = {
      projectName: exportCenterInput.project.name,
      tokens: exportCenterInput.tokens,
      themes: exportCenterInput.themes,
      includeDeprecated,
    };

    const cssVariables = generateCssVariablesExport(commonExportInput);
    const tailwindV4 = generateTailwindV4Export(commonExportInput);
    const typescriptTheme = generateTypeScriptThemeExport(commonExportInput);
    const reactNativeTheme = generateReactNativeThemeExport(commonExportInput);
    const documentationMarkdown = generateMarkdownDocumentation({
      ...exportCenterInput,
      locale: documentationProfile.locale,
      fallbackLocale,
      sections: documentationProfile.sections,
    });
    const aiInstructions = generateAiInstructions({
      project: exportCenterInput.project,
      tokens: exportCenterInput.tokens,
      components: exportCenterInput.components,
      locale: aiInstructionProfile.locale,
      fallbackLocale,
      strictness: aiInstructionProfile.strictness,
      sections: aiInstructionProfile.sections,
    });

    return [
      {
        format: 'cssVariables',
        locale: null,
        fileName: cssVariables.fileName,
        content: cssVariables.content,
        skippedTokens: cssVariables.skippedTokens,
        themeResolutionIssues: cssVariables.themeResolutionIssues,
        missingTranslations: [],
      },
      {
        format: 'tailwindV4',
        locale: null,
        fileName: tailwindV4.fileName,
        content: tailwindV4.content,
        skippedTokens: tailwindV4.skippedTokens,
        themeResolutionIssues: tailwindV4.themeResolutionIssues,
        missingTranslations: [],
      },
      {
        format: 'typescriptTheme',
        locale: null,
        fileName: typescriptTheme.fileName,
        content: typescriptTheme.content,
        skippedTokens: typescriptTheme.skippedTokens,
        themeResolutionIssues: typescriptTheme.themeResolutionIssues,
        missingTranslations: [],
      },
      {
        format: 'reactNativeTheme',
        locale: null,
        fileName: reactNativeTheme.fileName,
        content: reactNativeTheme.content,
        skippedTokens: reactNativeTheme.skippedTokens,
        themeResolutionIssues: reactNativeTheme.themeResolutionIssues,
        missingTranslations: [],
      },
      {
        format: 'documentationMarkdown',
        locale: documentationProfile.locale,
        fileName: `${projectSlug}-documentation-${documentationProfile.locale}.md`,
        content: documentationMarkdown.markdown,
        themeResolutionIssues: [],
        skippedTokens: [],
        missingTranslations: documentationMarkdown.missingTranslations,
      },
      {
        format: 'aiInstructions',
        locale: aiInstructionProfile.locale,
        fileName: aiInstructions.fileName,
        content: aiInstructions.content,
        themeResolutionIssues: [],
        skippedTokens: [],
        missingTranslations: aiInstructions.missingTranslations,
      },
    ];
  }, [
    aiInstructionProfile,
    documentationProfile,
    exportCenterInput,
    fallbackLocale,
    includeDeprecated,
    projectSlug,
  ]);

  const selectedOutput = getSelectedExportOutput({
    outputs: exportOutputs,
    selectedFormat,
  });
  const selectedPresentation = getFormatPresentation({
    format: selectedOutput.format,
    labels: workspaceLabels,
  });
  const outputByFormat = useMemo(
    () =>
      new Map(exportOutputs.map((output) => [output.format, output] as const)),
    [exportOutputs],
  );

  function selectFormat(format: ExportCenterFormat) {
    setSelectedFormat(format);
    setCopyStatus(null);
    setLogStatus('idle');
  }

  function logExport({
    output,
    status,
    errorMessage = null,
  }: {
    output: ExportCenterOutput;
    status: LogExportStatus;
    errorMessage?: string | null;
  }) {
    preserveSaveContext();
    setLogStatus('idle');

    startLoggingExportTransition(() => {
      void logExportAction({
        projectSlug,
        pageLocale,
        format: output.format,
        exportLocale: output.locale,
        status,
        errorMessage,
      }).then((result) => {
        if (result.status === 'error') {
          setLogStatus('error');
          return;
        }

        router.refresh();
      });
    });
  }

  async function copyExportContent(output: ExportCenterOutput) {
    selectFormat(output.format);

    try {
      await navigator.clipboard.writeText(output.content);
      setCopyStatus({ format: output.format, state: 'success' });
      logExport({ output, status: 'success' });
    } catch {
      setCopyStatus({ format: output.format, state: 'error' });
      logExport({
        output,
        status: 'failed',
        errorMessage: 'Unable to copy export content to clipboard.',
      });
    }
  }

  function downloadExportContent(output: ExportCenterOutput) {
    selectFormat(output.format);

    try {
      const blob = new Blob([output.content], {
        type: 'text/plain;charset=utf-8',
      });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = output.fileName;
      link.click();
      URL.revokeObjectURL(objectUrl);

      logExport({ output, status: 'success' });
    } catch {
      logExport({
        output,
        status: 'failed',
        errorMessage: 'Unable to download export content.',
      });
    }
  }

  return (
    <div
      data-export-layout-slot="workspace"
      className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[minmax(0,1fr)_30rem] xl:overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_34rem]"
    >
      <main
        data-export-layout-slot="catalog"
        className="bg-background-app min-w-0 px-4 py-5 md:px-6 md:py-6 xl:h-full xl:overflow-y-auto xl:px-8"
      >
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] font-semibold tracking-[-0.015em]">
                {workspaceLabels.pageTitle}
              </h1>
              <span className="border-action-success/30 bg-action-success/10 text-action-success rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold">
                {workspaceLabels.allFormatsAvailable}
              </span>
            </div>
            <p className="text-content-tertiary mt-2 max-w-3xl text-sm leading-6">
              {workspaceLabels.generatedFromModel}
            </p>
            <p className="text-content-secondary mt-2 text-xs font-semibold xl:hidden">
              {exportCenterInput.project.name}
            </p>
          </div>

          <label className="border-border-subtle bg-surface-primary flex max-w-sm cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5">
            <input
              type="checkbox"
              checked={includeDeprecated}
              onChange={(event) => {
                setIncludeDeprecated(event.currentTarget.checked);
                setCopyStatus(null);
                setLogStatus('idle');
              }}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={[
                'relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition',
                includeDeprecated
                  ? 'border-action-primary bg-action-primary'
                  : 'border-border-default bg-background-subtle',
              ].join(' ')}
            >
              <span
                className={[
                  'bg-action-primary-content absolute top-0.5 size-3.5 rounded-full transition-transform',
                  includeDeprecated
                    ? 'translate-x-[1.125rem]'
                    : 'translate-x-0.5',
                ].join(' ')}
              />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold">
                {workspaceLabels.includeDeprecated}
              </span>
              <span className="text-content-tertiary mt-1 block text-xs leading-5">
                {workspaceLabels.includeDeprecatedDescription}
              </span>
            </span>
          </label>
        </header>

        <section
          aria-label={t('controls.format.legend')}
          className="mt-6 grid gap-3 md:grid-cols-2"
        >
          {exportCenterFormats.map((format) => {
            const output = outputByFormat.get(format);

            if (!output) {
              return null;
            }

            const presentation = getFormatPresentation({
              format,
              labels: workspaceLabels,
            });
            const diagnosticsCount = getOutputDiagnosticsCount(output);
            const isSelected = selectedFormat === format;

            return (
              <article
                key={format}
                className={[
                  'bg-surface-primary min-w-0 rounded-md border transition',
                  isSelected
                    ? 'border-action-primary ring-action-primary/20 ring-2'
                    : 'border-border-subtle hover:border-border-strong',
                ].join(' ')}
              >
                <div className="flex min-h-32 flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={[
                          'flex size-9 shrink-0 items-center justify-center rounded-sm border font-mono text-[0.6875rem] font-semibold',
                          presentation.extensionClassName,
                        ].join(' ')}
                      >
                        {presentation.extension}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold">
                          {formatLabels[format]}
                        </h2>
                        <p className="text-content-tertiary mt-1 text-xs leading-5">
                          {formatDescriptions[format]}
                        </p>
                      </div>
                    </div>
                    <span
                      className={[
                        'shrink-0 rounded-full px-2 py-1 text-[0.625rem] font-semibold',
                        diagnosticsCount === 0
                          ? 'bg-action-success/10 text-action-success'
                          : 'bg-action-warning/10 text-action-warning',
                      ].join(' ')}
                    >
                      {diagnosticsCount === 0
                        ? workspaceLabels.ready
                        : workspaceLabels.needsReview}
                    </span>
                  </div>

                  <div className="text-content-tertiary mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem]">
                    <span className="font-mono">{output.fileName}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {formatExportFileSize(output.content, pageLocale)}
                    </span>
                    {presentation.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="border-border-subtle bg-background-subtle rounded-full border px-2 py-0.5"
                      >
                        {platform}
                      </span>
                    ))}
                    {output.locale ? (
                      <span className="border-border-subtle bg-background-subtle rounded-full border px-2 py-0.5 uppercase">
                        {output.locale}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="border-border-subtle flex items-center gap-2 border-t px-3 py-2">
                  <Button
                    type="button"
                    variant={isSelected ? 'primary' : 'ghost'}
                    size="sm"
                    aria-pressed={isSelected}
                    onClick={() => selectFormat(format)}
                  >
                    {isSelected
                      ? workspaceLabels.selected
                      : workspaceLabels.preview}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto gap-2"
                    disabled={isLoggingExport}
                    onClick={() => void copyExportContent(output)}
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
                    disabled={isLoggingExport}
                    onClick={() => downloadExportContent(output)}
                    className="size-11 px-0"
                  >
                    <DownloadSimpleIcon
                      aria-hidden="true"
                      size={20}
                      weight="bold"
                      className="size-5 shrink-0"
                    />
                  </Button>
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-5" aria-live="polite">
          {copyStatus?.state === 'success' ? (
            <p className="text-action-success text-xs font-semibold">
              {t('copy.success')}
            </p>
          ) : null}
          {copyStatus?.state === 'error' ? (
            <p
              role="alert"
              className="text-action-danger text-xs font-semibold"
            >
              {t('copy.error')}
            </p>
          ) : null}
          {isLoggingExport ? (
            <p className="text-content-secondary text-xs font-semibold">
              {t('logs.saving')}
            </p>
          ) : null}
          {logStatus === 'error' ? (
            <p
              role="alert"
              className="text-action-danger text-xs font-semibold"
            >
              {t('logs.error')}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-5">
          <ExportDiagnosticsPanel
            output={selectedOutput}
            labels={workspaceLabels}
          />
          <ExportLogsPanel
            logs={exportLogs}
            outputs={outputByFormat}
            formatLabels={formatLabels}
            labels={workspaceLabels}
          />
        </div>
      </main>

      <aside
        data-export-layout-slot="preview"
        className="border-border-subtle bg-background-app min-w-0 border-t xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-t-0 xl:border-l"
      >
        <header className="border-border-default bg-surface-primary sticky top-0 z-10 flex min-w-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-content-tertiary text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
              {workspaceLabels.codePreview}
            </p>
            <p className="mt-1 truncate font-mono text-xs font-semibold">
              {selectedOutput.fileName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              disabled={isLoggingExport}
              onClick={() => void copyExportContent(selectedOutput)}
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
              disabled={isLoggingExport}
              onClick={() => downloadExportContent(selectedOutput)}
              className="size-11 px-0"
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
          className="bg-background-sunken min-h-[34rem] min-w-0 flex-1 overflow-auto p-4 font-mono text-xs leading-6 xl:min-h-0"
        >
          <ExportCodePreview
            format={selectedOutput.format}
            content={selectedOutput.content}
          />
        </pre>

        <footer className="border-border-default bg-surface-primary grid grid-cols-2 gap-3 border-t p-4 text-xs sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
          <PreviewMetric
            label={workspaceLabels.fileSize}
            value={formatExportFileSize(selectedOutput.content, pageLocale)}
          />
          <PreviewMetric
            label={workspaceLabels.characterCount}
            value={formatExportCharacterCount(
              selectedOutput.content,
              pageLocale,
            )}
          />
          <PreviewMetric
            label={workspaceLabels.currentLocale}
            value={
              selectedOutput.locale?.toUpperCase() ?? workspaceLabels.noLocale
            }
          />
          <PreviewMetric
            label={workspaceLabels.outputDetails}
            value={selectedPresentation.platforms.join(' · ')}
          />
        </footer>
      </aside>
    </div>
  );
}

function ExportDiagnosticsPanel({
  output,
  labels,
}: {
  output: ExportCenterOutput;
  labels: ExportCenterWorkspaceLabels;
}) {
  const t = useTranslations('ExportCenterPage');
  const hasSkippedTokens = output.skippedTokens.length > 0;
  const hasThemeResolutionIssues = output.themeResolutionIssues.length > 0;
  const hasMissingTranslations = output.missingTranslations.length > 0;
  const issueCount = getOutputDiagnosticsCount(output);

  const themeResolutionReasonLabels: Record<
    ExportCenterOutput['themeResolutionIssues'][number]['reason'],
    string
  > = {
    tokenNotFound: t('diagnostics.themeResolutionIssues.reasons.tokenNotFound'),
    tokenUnresolved: t(
      'diagnostics.themeResolutionIssues.reasons.tokenUnresolved',
    ),
    unsupportedValue: t(
      'diagnostics.themeResolutionIssues.reasons.unsupportedValue',
    ),
  };

  return (
    <details className="border-border-subtle bg-surface-primary overflow-hidden rounded-md border">
      <summary className="hover:bg-background-subtle flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 transition marker:hidden">
        <div>
          <h2 className="text-sm font-semibold">{labels.diagnosticsSummary}</h2>
          <p className="text-content-tertiary mt-1 text-xs">
            {issueCount === 0
              ? t('diagnostics.empty')
              : formatDiagnosticsCount(labels.diagnosticsCount, issueCount)}
          </p>
        </div>
        <span
          className={[
            'rounded-full px-2 py-1 text-[0.6875rem] font-semibold',
            issueCount === 0
              ? 'bg-action-success/10 text-action-success'
              : 'bg-action-warning/10 text-action-warning',
          ].join(' ')}
        >
          {issueCount === 0 ? labels.ready : issueCount}
        </span>
      </summary>

      <div className="border-border-subtle grid gap-4 border-t p-4">
        {!hasSkippedTokens &&
        !hasThemeResolutionIssues &&
        !hasMissingTranslations ? (
          <p className="text-action-success text-sm font-semibold">
            {t('diagnostics.empty')}
          </p>
        ) : null}

        {hasSkippedTokens ? (
          <section>
            <h3 className="text-xs font-semibold">
              {t('diagnostics.skippedTokens.title')}
            </h3>
            <ul className="mt-2 grid gap-2">
              {output.skippedTokens.map((token) => (
                <li
                  key={`${token.path}-${token.reason}`}
                  className="border-action-warning/30 bg-action-warning/10 rounded-sm border p-2 text-xs"
                >
                  <span className="font-mono">{token.path}</span>
                  <span className="text-content-secondary ml-2">
                    {t(`diagnostics.skippedTokens.reasons.${token.reason}`)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasThemeResolutionIssues ? (
          <section>
            <h3 className="text-xs font-semibold">
              {t('diagnostics.themeResolutionIssues.title')}
            </h3>
            <ul className="mt-2 grid gap-2 text-xs">
              {output.themeResolutionIssues.map((issue) => (
                <li
                  key={`${issue.themeMode}-${issue.path}-${issue.referencePath}`}
                  className="border-action-warning/30 bg-action-warning/10 rounded-sm border p-2"
                >
                  <span className="font-semibold">{issue.themeName}</span> ·{' '}
                  <span className="font-mono">{issue.path}</span> →{' '}
                  <span className="font-mono">{issue.referencePath}</span> ·{' '}
                  {themeResolutionReasonLabels[issue.reason]}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasMissingTranslations ? (
          <section>
            <h3 className="text-xs font-semibold">
              {t('diagnostics.missingTranslations.title')}
            </h3>
            <ul className="mt-2 grid gap-2">
              {output.missingTranslations.map((translation) => (
                <li
                  key={`${translation.path}-${translation.requestedLocale}`}
                  className="border-action-warning/30 bg-action-warning/10 rounded-sm border p-2 text-xs"
                >
                  <span className="font-mono break-all">
                    {translation.path}
                  </span>
                  <span className="text-content-secondary ml-2">
                    {translation.requestedLocale.toUpperCase()} →{' '}
                    {translation.fallbackLocale.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </details>
  );
}

function ExportLogsPanel({
  logs,
  outputs,
  formatLabels,
  labels,
}: {
  logs: ExportCenterLog[];
  outputs: ReadonlyMap<ExportCenterFormat, ExportCenterOutput>;
  formatLabels: Record<ExportCenterFormat, string>;
  labels: ExportCenterWorkspaceLabels;
}) {
  const t = useTranslations('ExportCenterPage');

  return (
    <section className="border-border-subtle bg-surface-primary overflow-hidden rounded-md border">
      <header className="border-border-subtle border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{labels.recentExportLog}</h2>
        <p className="text-content-tertiary mt-1 text-xs leading-5">
          {labels.recentExportDescription}
        </p>
      </header>

      {logs.length === 0 ? (
        <p className="text-content-secondary p-4 text-sm">
          {labels.noRecentExports}
        </p>
      ) : (
        <div className="divide-border-subtle divide-y">
          <div className="text-content-tertiary hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] gap-4 px-4 py-2 text-[0.625rem] font-semibold tracking-[0.12em] uppercase md:grid">
            <span>{labels.status}</span>
            <span>{labels.file}</span>
            <span>{labels.locale}</span>
            <span>{labels.generatedAt}</span>
          </div>
          {logs.map((log) => {
            const format = fromExportLogFormat(log.format);
            const output = outputs.get(format);

            return (
              <article
                key={log.id}
                className="grid gap-2 px-4 py-3 text-xs md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] md:items-center md:gap-4"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={[
                      'size-2 shrink-0 rounded-full',
                      log.status === 'success'
                        ? 'bg-action-success'
                        : 'bg-action-danger',
                    ].join(' ')}
                  />
                  <span className="truncate font-semibold">
                    {formatLabels[format]}
                  </span>
                  <span
                    className={[
                      'ml-auto shrink-0 font-semibold md:hidden',
                      log.status === 'success'
                        ? 'text-action-success'
                        : 'text-action-danger',
                    ].join(' ')}
                  >
                    {t(`logs.status.${log.status}`)}
                  </span>
                </div>
                <p className="text-content-secondary truncate font-mono">
                  {output?.fileName ?? formatLabels[format]}
                </p>
                <p className="text-content-tertiary uppercase">
                  {log.locale ?? '—'}
                </p>
                <p className="text-content-tertiary whitespace-nowrap">
                  {t('logs.createdAt', {
                    date: new Date(log.createdAt),
                  })}
                </p>
                {log.errorMessage ? (
                  <p className="text-action-danger md:col-span-4">
                    {log.errorMessage}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-content-tertiary text-[0.625rem] font-semibold tracking-[0.1em] uppercase">
        {label}
      </p>
      <p
        className="mt-1 truncate font-mono text-xs font-semibold"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
