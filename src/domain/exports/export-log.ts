export const exportLogFormats = [
  'cssVariables',
  'tailwindV4',
  'typescriptTheme',
  'reactNativeTheme',
  'markdownDocumentation',
  'aiInstructions',
] as const;

export type ExportLogFormat = (typeof exportLogFormats)[number];
