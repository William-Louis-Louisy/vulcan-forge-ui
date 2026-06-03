export const exportCenterFormats = [
  'cssVariables',
  'tailwindV4',
  'typescriptTheme',
  'reactNativeTheme',
  'documentationMarkdown',
  'aiInstructions',
] as const;

export type ExportCenterFormat = (typeof exportCenterFormats)[number];

export const exportLogFormats = [
  'cssVariables',
  'tailwindV4',
  'typescriptTheme',
  'reactNativeTheme',
  'markdownDocumentation',
  'aiInstructions',
] as const;

export type ExportLogFormat = (typeof exportLogFormats)[number];

export function getExportCenterFileExtension(
  format: ExportCenterFormat,
): 'css' | 'ts' | 'md' {
  switch (format) {
    case 'cssVariables':
    case 'tailwindV4':
      return 'css';

    case 'typescriptTheme':
    case 'reactNativeTheme':
      return 'ts';

    case 'documentationMarkdown':
    case 'aiInstructions':
      return 'md';
  }
}

export function toExportLogFormat(format: ExportCenterFormat): ExportLogFormat {
  return format === 'documentationMarkdown' ? 'markdownDocumentation' : format;
}

export function fromExportLogFormat(
  format: ExportLogFormat,
): ExportCenterFormat {
  return format === 'markdownDocumentation' ? 'documentationMarkdown' : format;
}
