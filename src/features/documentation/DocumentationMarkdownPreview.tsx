import { Fragment, type ReactNode } from 'react';

type MarkdownHeadingBlock = {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  text: string;
};

type MarkdownParagraphBlock = {
  type: 'paragraph';
  text: string;
};

type MarkdownListBlock = {
  type: 'list';
  items: string[];
};

type MarkdownTableBlock = {
  type: 'table';
  headers: string[];
  rows: string[][];
};

type MarkdownBlock =
  | MarkdownHeadingBlock
  | MarkdownParagraphBlock
  | MarkdownListBlock
  | MarkdownTableBlock;

type DocumentationMarkdownPreviewProps = {
  markdown: string;
};

export function DocumentationMarkdownPreview({
  markdown,
}: DocumentationMarkdownPreviewProps) {
  const blocks = parseGeneratedMarkdown(markdown);

  return (
    <article className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10 xl:px-12 xl:py-12">
      {blocks.map((block, index) => (
        <MarkdownBlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </article>
  );
}

export function parseGeneratedMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);

    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1]!.length as 1 | 2 | 3 | 4,
        text: heading[2]!,
      });
      index += 1;
      continue;
    }

    if (isMarkdownTableStart(lines, index)) {
      const headers = parseMarkdownTableRow(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && isMarkdownTableRow(lines[index] ?? '')) {
        rows.push(parseMarkdownTableRow(lines[index] ?? ''));
        index += 1;
      }

      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];

      while (index < lines.length && (lines[index] ?? '').startsWith('- ')) {
        items.push((lines[index] ?? '').slice(2));
        index += 1;
      }

      blocks.push({ type: 'list', items });
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index] ?? '';

      if (
        nextLine.trim() === '' ||
        /^(#{1,4})\s+/.test(nextLine) ||
        nextLine.startsWith('- ') ||
        isMarkdownTableStart(lines, index)
      ) {
        break;
      }

      paragraphLines.push(nextLine.trim());
      index += 1;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function MarkdownBlockView({ block }: { block: MarkdownBlock }) {
  if (block.type === 'heading') {
    const content = renderInlineMarkdown(block.text);

    if (block.level === 1) {
      return (
        <h1 className="text-content-primary font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {content}
        </h1>
      );
    }

    if (block.level === 2) {
      return (
        <h2 className="border-border-subtle text-content-primary mt-10 border-t pt-8 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          {content}
        </h2>
      );
    }

    if (block.level === 3) {
      return (
        <h3 className="text-content-primary mt-8 text-lg font-semibold tracking-tight">
          {content}
        </h3>
      );
    }

    return (
      <h4 className="text-content-primary mt-6 text-sm font-semibold tracking-wide uppercase">
        {content}
      </h4>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p className="text-content-secondary mt-4 text-sm leading-7 sm:text-base">
        {renderInlineMarkdown(block.text)}
      </p>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="text-content-secondary mt-4 list-disc space-y-2 pl-5 text-sm leading-6 sm:text-base">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="border-border-subtle mt-5 overflow-x-auto rounded-md border">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead className="bg-background-subtle text-content-tertiary">
          <tr>
            {block.headers.map((header, index) => (
              <th
                key={`${header}-${index}`}
                className="px-4 py-3 font-semibold"
              >
                {renderInlineMarkdown(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className="border-border-subtle border-t"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className="text-content-secondary px-4 py-3 align-top"
                >
                  {renderInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInlineMarkdown(value: string): ReactNode[] {
  return value
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={`${part}-${index}`}
            className="border-border-subtle bg-background-subtle rounded-sm border px-1 py-0.5 font-mono text-[0.9em]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    });
}

function isMarkdownTableStart(lines: string[], index: number): boolean {
  const line = lines[index] ?? '';
  const separator = lines[index + 1] ?? '';

  return isMarkdownTableRow(line) && isMarkdownTableSeparator(separator);
}

function isMarkdownTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|');
}

function isMarkdownTableSeparator(line: string): boolean {
  if (!isMarkdownTableRow(line)) {
    return false;
  }

  return parseMarkdownTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseMarkdownTableRow(line: string): string[] {
  const trimmed = line.trim().slice(1, -1);
  const cells: string[] = [];
  let current = '';
  let escaped = false;

  for (const character of trimmed) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }

    if (character === '\\') {
      escaped = true;
      continue;
    }

    if (character === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  cells.push(current.trim());
  return cells;
}
