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
  type ExportCenterFormat,
} from './export-center.utils';
import { Button } from '@/components/ui';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ExportCenterInput } from './export-center.queries';
import { generateAiInstructions } from '@/domain/ai-instructions';
import { generateMarkdownDocumentation } from '@/domain/documentation';
import type { AiInstructionsMissingTranslation } from '@/domain/ai-instructions';
import type { MarkdownDocumentationMissingTranslation } from '@/domain/documentation';
import type { DocumentationProfileContent } from '@/features/documentation/documentation-profile.schema';
import type { AiInstructionProfileContent } from '@/features/ai-instructions/ai-instruction-profile.schema';

type CopyStatus = 'idle' | 'success' | 'error';

type ExportCenterOutput = {
  format: ExportCenterFormat;
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
}: ExportCenterClientProps) {
  const t = useTranslations('ExportCenterPage');

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
        fileName: cssVariables.fileName,
        content: cssVariables.content,
        skippedTokens: cssVariables.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'tailwindV4',
        fileName: tailwindV4.fileName,
        content: tailwindV4.content,
        skippedTokens: tailwindV4.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'typescriptTheme',
        fileName: typescriptTheme.fileName,
        content: typescriptTheme.content,
        skippedTokens: typescriptTheme.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'reactNativeTheme',
        fileName: reactNativeTheme.fileName,
        content: reactNativeTheme.content,
        skippedTokens: reactNativeTheme.skippedTokens,
        missingTranslations: [],
      },
      {
        format: 'documentationMarkdown',
        fileName: `${projectSlug}-documentation-${documentationProfile.locale}.md`,
        content: documentationMarkdown.markdown,
        skippedTokens: [],
        missingTranslations: documentationMarkdown.missingTranslations,
      },
      {
        format: 'aiInstructions',
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

  async function copyExportContent() {
    try {
      await navigator.clipboard.writeText(selectedOutput.content);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  }

  function downloadExportContent() {
    const blob = new Blob([selectedOutput.content], {
      type: 'text/plain;charset=utf-8',
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = selectedOutput.fileName;
    link.click();

    URL.revokeObjectURL(objectUrl);
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
              onChange={(event) =>
                setIncludeDeprecated(event.currentTarget.checked)
              }
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
            <Button type="button" onClick={copyExportContent}>
              {t('actions.copy')}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={downloadExportContent}
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
        <ExportDiagnosticsPanel output={selectedOutput} />

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

          <pre className="border-border-subtle bg-background-subtle mt-6 max-h-[720px] overflow-auto rounded-2xl border p-4 text-sm leading-6">
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
