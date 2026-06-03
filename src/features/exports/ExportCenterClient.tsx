'use client';

import {
  generateTailwindV4Export,
  generateCssVariablesExport,
  generateTypeScriptThemeExport,
  generateReactNativeThemeExport,
  type CssVariablesExportSkippedToken,
} from '@/domain/exports';
import {
  exportCenterFormats,
  fromExportLogFormat,
  type ExportCenterFormat,
} from './export-center.utils';
import type {
  ExportCenterLog,
  ExportCenterInput,
} from './export-center.queries';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/domain/i18n';
import { useMemo, useState, useTransition } from 'react';
import { generateAiInstructions } from '@/domain/ai-instructions';
import { generateMarkdownDocumentation } from '@/domain/documentation';
import { logExportAction, type LogExportStatus } from './log-export.action';
import type { AiInstructionsMissingTranslation } from '@/domain/ai-instructions';
import type { MarkdownDocumentationMissingTranslation } from '@/domain/documentation';
import type { DocumentationProfileContent } from '@/features/documentation/documentation-profile.schema';
import type { AiInstructionProfileContent } from '@/features/ai-instructions/ai-instruction-profile.schema';

type CopyStatus = 'idle' | 'success' | 'error';

type ExportCenterOutput = {
  format: ExportCenterFormat;
  locale: AppLocale | null;
  fileName: string;
  content: string;
  skippedTokens: CssVariablesExportSkippedToken[];
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
  const [isLoggingExport, startLoggingExportTransition] = useTransition();
  const [logStatus, setLogStatus] = useState<'idle' | 'error'>('idle');

  const [selectedFormat, setSelectedFormat] =
    useState<ExportCenterFormat>('cssVariables');

  const [includeDeprecated, setIncludeDeprecated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

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
        missingTranslations: [],
      },
      {
        format: 'tailwindV4',
        locale: null,
        fileName: tailwindV4.fileName,
        content: tailwindV4.content,
        skippedTokens: tailwindV4.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'typescriptTheme',
        locale: null,
        fileName: typescriptTheme.fileName,
        content: typescriptTheme.content,
        skippedTokens: typescriptTheme.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'reactNativeTheme',
        locale: null,
        fileName: reactNativeTheme.fileName,
        content: reactNativeTheme.content,
        skippedTokens: reactNativeTheme.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'documentationMarkdown',
        locale: documentationProfile.locale,
        fileName: `${projectSlug}-documentation-${documentationProfile.locale}.md`,
        content: documentationMarkdown.markdown,
        skippedTokens: [],
        missingTranslations: documentationMarkdown.missingTranslations,
      },
      {
        format: 'aiInstructions',
        locale: aiInstructionProfile.locale,
        fileName: aiInstructions.fileName,
        content: aiInstructions.content,
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

  function logSelectedExport({
    status,
    errorMessage = null,
  }: {
    status: LogExportStatus;
    errorMessage?: string | null;
  }) {
    setLogStatus('idle');

    startLoggingExportTransition(() => {
      void logExportAction({
        projectSlug,
        pageLocale,
        format: selectedOutput.format,
        exportLocale: selectedOutput.locale,
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

  async function copyExportContent() {
    try {
      await navigator.clipboard.writeText(selectedOutput.content);
      setCopyStatus('success');
      logSelectedExport({ status: 'success' });
    } catch {
      setCopyStatus('error');
      logSelectedExport({
        status: 'failed',
        errorMessage: 'Unable to copy export content to clipboard.',
      });
    }
  }

  function downloadExportContent() {
    try {
      const blob = new Blob([selectedOutput.content], {
        type: 'text/plain;charset=utf-8',
      });

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = selectedOutput.fileName;
      link.click();

      URL.revokeObjectURL(objectUrl);

      logSelectedExport({ status: 'success' });
    } catch {
      logSelectedExport({
        status: 'failed',
        errorMessage: 'Unable to download export content.',
      });
    }
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
              {t('controls.format.legend')}
            </legend>

            <div className="mt-3 grid gap-2">
              {exportCenterFormats.map((format) => (
                <label
                  key={format}
                  className="border-border-subtle bg-background-subtle flex items-start gap-3 rounded-2xl border p-3 text-sm"
                >
                  <input
                    className="mt-1"
                    type="radio"
                    name="exportFormat"
                    value={format}
                    checked={selectedFormat === format}
                    onChange={() => {
                      setSelectedFormat(format);
                      setCopyStatus('idle');
                      setLogStatus('idle');
                    }}
                  />

                  <span>
                    <span className="block font-semibold">
                      {formatLabels[format]}
                    </span>

                    <span className="text-content-secondary mt-1 block text-xs leading-5">
                      {formatDescriptions[format]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="border-border-subtle flex items-start gap-3 rounded-2xl border p-4 text-sm">
            <input
              className="mt-1"
              type="checkbox"
              checked={includeDeprecated}
              onChange={(event) => {
                setIncludeDeprecated(event.currentTarget.checked);
                setCopyStatus('idle');
                setLogStatus('idle');
              }}
            />

            <span>
              <span className="block font-semibold">
                {t('controls.includeDeprecated.label')}
              </span>

              <span className="text-content-secondary mt-1 block text-xs leading-5">
                {t('controls.includeDeprecated.description')}
              </span>
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Button
              type="button"
              onClick={copyExportContent}
              disabled={isLoggingExport}
            >
              {t('actions.copy')}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={downloadExportContent}
              disabled={isLoggingExport}
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

          {isLoggingExport ? (
            <p className="text-content-secondary text-sm font-semibold">
              {t('logs.saving')}
            </p>
          ) : null}

          {logStatus === 'error' ? (
            <p
              role="alert"
              className="text-action-danger text-sm font-semibold"
            >
              {t('logs.error')}
            </p>
          ) : null}
        </div>
      </aside>

      <section className="grid gap-6">
        <ExportDiagnosticsPanel output={selectedOutput} />

        <ExportLogsPanel logs={exportLogs} />

        <article className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t('preview.title')}
              </h2>

              <p className="text-content-secondary mt-2 text-sm">
                {t('preview.fileName', {
                  fileName: selectedOutput.fileName,
                })}
              </p>
            </div>

            <p className="text-content-secondary text-sm">
              {t('preview.format', {
                format: formatLabels[selectedOutput.format],
              })}
            </p>
          </div>

          <pre className="border-border-subtle bg-background-subtle mt-6 max-h-180 overflow-auto rounded-2xl border p-4 text-sm leading-6">
            <code>{selectedOutput.content}</code>
          </pre>
        </article>
      </section>
    </div>
  );
}

function ExportDiagnosticsPanel({ output }: { output: ExportCenterOutput }) {
  const t = useTranslations('ExportCenterPage');

  const hasSkippedTokens = output.skippedTokens.length > 0;
  const hasMissingTranslations = output.missingTranslations.length > 0;

  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t('diagnostics.title')}
      </h2>

      {!hasSkippedTokens && !hasMissingTranslations ? (
        <p className="text-action-success mt-4 text-sm font-semibold">
          {t('diagnostics.empty')}
        </p>
      ) : null}

      {hasSkippedTokens ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">
            {t('diagnostics.skippedTokens.title')}
          </h3>

          <ul className="mt-3 grid gap-2">
            {output.skippedTokens.map((token) => (
              <li
                key={`${token.path}-${token.reason}`}
                className="border-action-warning/30 bg-action-warning/10 rounded-2xl border p-3 text-sm"
              >
                <span className="font-mono">{token.path}</span>
                <span className="text-content-secondary ml-2">
                  {t(`diagnostics.skippedTokens.reasons.${token.reason}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasMissingTranslations ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">
            {t('diagnostics.missingTranslations.title')}
          </h3>

          <ul className="mt-3 grid gap-2">
            {output.missingTranslations.map((translation) => (
              <li
                key={`${translation.path}-${translation.requestedLocale}`}
                className="border-action-warning/30 bg-action-warning/10 rounded-2xl border p-3 text-sm"
              >
                <span className="font-mono">{translation.path}</span>
                <span className="text-content-secondary ml-2">
                  {translation.requestedLocale} → {translation.fallbackLocale}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function ExportLogsPanel({ logs }: { logs: ExportCenterLog[] }) {
  const t = useTranslations('ExportCenterPage');

  const formatLabels: Record<ExportCenterFormat, string> = {
    cssVariables: t('formats.cssVariables.label'),
    tailwindV4: t('formats.tailwindV4.label'),
    typescriptTheme: t('formats.typescriptTheme.label'),
    reactNativeTheme: t('formats.reactNativeTheme.label'),
    documentationMarkdown: t('formats.documentationMarkdown.label'),
    aiInstructions: t('formats.aiInstructions.label'),
  };

  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t('logs.title')}
      </h2>

      {logs.length === 0 ? (
        <p className="text-content-secondary mt-4 text-sm">{t('logs.empty')}</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {logs.map((log) => {
            const uiFormat = fromExportLogFormat(log.format);

            return (
              <li
                key={log.id}
                className="border-border-subtle rounded-2xl border p-4 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{formatLabels[uiFormat]}</p>

                  <span
                    className={
                      log.status === 'success'
                        ? 'text-action-success font-semibold'
                        : 'text-action-danger font-semibold'
                    }
                  >
                    {t(`logs.status.${log.status}`)}
                  </span>
                </div>

                <p className="text-content-secondary mt-2">
                  {t('logs.createdAt', {
                    date: new Date(log.createdAt),
                  })}
                </p>

                {log.locale ? (
                  <p className="text-content-secondary mt-1">
                    {t('logs.locale', { locale: log.locale })}
                  </p>
                ) : null}

                {log.errorMessage ? (
                  <p className="text-action-danger mt-2 font-semibold">
                    {log.errorMessage}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
