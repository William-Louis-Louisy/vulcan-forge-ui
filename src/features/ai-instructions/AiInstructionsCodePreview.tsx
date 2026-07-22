import { Fragment } from 'react';

export type AiInstructionsCodeTokenKind =
  | 'plain'
  | 'comment'
  | 'heading'
  | 'marker'
  | 'value';

export type AiInstructionsCodeToken = {
  kind: AiInstructionsCodeTokenKind;
  value: string;
};

const tokenClassNames: Record<AiInstructionsCodeTokenKind, string> = {
  plain: 'text-content-secondary',
  comment: 'text-content-tertiary italic',
  heading: 'text-action-primary',
  marker: 'text-action-warning',
  value: 'text-action-success',
};

function tokenizeInlineCode(line: string): AiInstructionsCodeToken[] {
  const tokens: AiInstructionsCodeToken[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let cursor = 0;

  for (const match of line.matchAll(pattern)) {
    const index = match.index;

    if (index > cursor) {
      tokens.push({ kind: 'plain', value: line.slice(cursor, index) });
    }

    tokens.push({ kind: 'value', value: match[0] });
    cursor = index + match[0].length;
  }

  if (cursor < line.length) {
    tokens.push({ kind: 'plain', value: line.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ kind: 'plain', value: line }];
}

export function tokenizeAiInstructionsLine(
  line: string,
): AiInstructionsCodeToken[] {
  const trimmedLine = line.trimStart();

  if (trimmedLine.startsWith('<!--') || trimmedLine.startsWith('//')) {
    return [{ kind: 'comment', value: line }];
  }

  const heading = line.match(/^(\s*#{1,6}\s+)(.*)$/);

  if (heading) {
    return [
      { kind: 'marker', value: heading[1] ?? '' },
      { kind: 'heading', value: heading[2] ?? '' },
    ];
  }

  const listItem = line.match(/^(\s*(?:[-*+] |\d+\. ))(.*)$/);

  if (listItem) {
    return [
      { kind: 'marker', value: listItem[1] ?? '' },
      ...tokenizeInlineCode(listItem[2] ?? ''),
    ];
  }

  const quote = line.match(/^(\s*>\s?)(.*)$/);

  if (quote) {
    return [
      { kind: 'marker', value: quote[1] ?? '' },
      ...tokenizeInlineCode(quote[2] ?? ''),
    ];
  }

  return tokenizeInlineCode(line);
}

export function AiInstructionsCodePreview({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <code>
      {lines.map((line, lineIndex) => (
        <Fragment key={`${lineIndex}-${line}`}>
          {tokenizeAiInstructionsLine(line).map((token, tokenIndex) => (
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
