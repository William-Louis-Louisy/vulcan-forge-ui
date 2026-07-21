import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DocumentationMarkdownPreview,
  parseGeneratedMarkdown,
} from './DocumentationMarkdownPreview';

describe('DocumentationMarkdownPreview', () => {
  it('parses the generated Markdown block types', () => {
    expect(
      parseGeneratedMarkdown(`# Aurora System

A calm design system.

## Tokens

| Path | Description |
| --- | --- |
| color.content | Content \\| foreground |

- **Status:** stable
- Use \`color.content\``),
    ).toEqual([
      { type: 'heading', level: 1, text: 'Aurora System' },
      { type: 'paragraph', text: 'A calm design system.' },
      { type: 'heading', level: 2, text: 'Tokens' },
      {
        type: 'table',
        headers: ['Path', 'Description'],
        rows: [['color.content', 'Content | foreground']],
      },
      {
        type: 'list',
        items: ['**Status:** stable', 'Use `color.content`'],
      },
    ]);
  });

  it('renders headings, tables and inline Markdown without raw HTML', () => {
    render(
      <DocumentationMarkdownPreview
        markdown={`# Aurora System

## Tokens

| Path | Description |
| --- | --- |
| color.content | Primary content |

- **Status:** stable
- Use \`color.content\``}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Aurora System' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Tokens' }),
    ).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByText('color.content')).toBeInTheDocument();
    expect(within(table).getByText('Primary content')).toBeInTheDocument();
    expect(screen.getByText('Status:').tagName).toBe('STRONG');
    expect(
      screen.getByText('color.content', { selector: 'code' }),
    ).toBeInTheDocument();
  });
});
