import { Fragment } from 'react';
import type { ExportCenterFormat } from './export-center.utils';

export type ExportCodeTokenKind =
  | 'plain'
  | 'comment'
  | 'name'
  | 'value'
  | 'keyword'
  | 'punctuation';

export type ExportCodeToken = {
  kind: ExportCodeTokenKind;
  value: string;
};

const tokenClassNames: Record<ExportCodeTokenKind, string> = {
  plain: 'text-content-secondary',
  comment: 'text-content-tertiary italic',
  name: 'text-action-primary',
  value: 'text-action-success',
  keyword: 'text-action-warning',
  punctuation: 'text-content-tertiary',
};

const typescriptTokenPattern =
  /(\/\/.*$|\/\*.*?\*\/|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|`(?:\\.|[^`])*`|\b(?:export|const|let|type|interface|function|return|as|satisfies|readonly|null|true|false)\b|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$-]*(?=\s*:))/g;

function tokenizeWithPattern(
  line: string,
  pattern: RegExp,
  getKind: (value: string) => ExportCodeTokenKind,
): ExportCodeToken[] {
  const tokens: ExportCodeToken[] = [];
  let cursor = 0;

  for (const match of line.matchAll(pattern)) {
    const index = match.index;

    if (index > cursor) {
      tokens.push({ kind: 'plain', value: line.slice(cursor, index) });
    }

    tokens.push({ kind: getKind(match[0]), value: match[0] });
    cursor = index + match[0].length;
  }

  if (cursor < line.length) {
    tokens.push({ kind: 'plain', value: line.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ kind: 'plain', value: line }];
}

function tokenizeCssLine(line: string): ExportCodeToken[] {
  const trimmedLine = line.trimStart();

  if (
    trimmedLine.startsWith('/*') ||
    trimmedLine.startsWith('*') ||
    trimmedLine.startsWith('*/')
  ) {
    return [{ kind: 'comment', value: line }];
  }

  const declaration = line.match(/^(\s*)(--[\w-]+)(\s*:\s*)(.*?)(;?\s*)$/);

  if (declaration) {
    return [
      { kind: 'plain', value: declaration[1] ?? '' },
      { kind: 'name', value: declaration[2] ?? '' },
      { kind: 'punctuation', value: declaration[3] ?? '' },
      { kind: 'value', value: declaration[4] ?? '' },
      { kind: 'punctuation', value: declaration[5] ?? '' },
    ];
  }

  const directive = line.match(/^(\s*)(@[\w-]+|:root|\[[^\]]+\])(.*)$/);

  if (directive) {
    return [
      { kind: 'plain', value: directive[1] ?? '' },
      { kind: 'keyword', value: directive[2] ?? '' },
      { kind: 'plain', value: directive[3] ?? '' },
    ];
  }

  return [{ kind: 'plain', value: line }];
}

function tokenizeTypeScriptLine(line: string): ExportCodeToken[] {
  return tokenizeWithPattern(line, typescriptTokenPattern, (value) => {
    if (value.startsWith('//') || value.startsWith('/*')) {
      return 'comment';
    }

    if (/^['"`]/.test(value) || /^\d/.test(value)) {
      return 'value';
    }

    if (
      /^(?:export|const|let|type|interface|function|return|as|satisfies|readonly|null|true|false)$/.test(
        value,
      )
    ) {
      return 'keyword';
    }

    return 'name';
  });
}

function tokenizeMarkdownLine(line: string): ExportCodeToken[] {
  if (line.startsWith('<!--')) {
    return [{ kind: 'comment', value: line }];
  }

  const heading = line.match(/^(\s*#{1,6}\s+)(.*)$/);

  if (heading) {
    return [
      { kind: 'keyword', value: heading[1] ?? '' },
      { kind: 'name', value: heading[2] ?? '' },
    ];
  }

  return tokenizeWithPattern(
    line,
    /(`[^`]+`|^\s*(?:[-*+] |\d+\. ))/g,
    (value) => (value.trimStart().startsWith('`') ? 'value' : 'keyword'),
  );
}

export function tokenizeExportLine(
  format: ExportCenterFormat,
  line: string,
): ExportCodeToken[] {
  switch (format) {
    case 'cssVariables':
    case 'tailwindV4':
      return tokenizeCssLine(line);
    case 'typescriptTheme':
    case 'reactNativeTheme':
      return tokenizeTypeScriptLine(line);
    case 'documentationMarkdown':
    case 'aiInstructions':
      return tokenizeMarkdownLine(line);
  }
}

export function ExportCodePreview({
  format,
  content,
}: {
  format: ExportCenterFormat;
  content: string;
}) {
  const lines = content.split('\n');

  return (
    <code>
      {lines.map((line, lineIndex) => (
        <Fragment key={`${lineIndex}-${line}`}>
          {tokenizeExportLine(format, line).map((token, tokenIndex) => (
            <span
              key={`${lineIndex}-${tokenIndex}-${token.kind}`}
              className={tokenClassNames[token.kind]}
            >
              {token.value}
            </span>
          ))}
          {lineIndex < lines.length - 1 ? '\n' : null}
        </Fragment>
      ))}
    </code>
  );
}
