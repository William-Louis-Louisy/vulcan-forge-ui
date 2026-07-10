import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ComponentResponsiveWorkspace } from './ComponentResponsiveWorkspace';

describe('ComponentResponsiveWorkspace', () => {
  it('defaults to the editor and lets mobile users switch sections', async () => {
    const user = userEvent.setup();

    render(
      <ComponentResponsiveWorkspace
        labels={{
          registry: 'Components',
          editor: 'Editor',
          preview: 'Preview',
        }}
        editorScrollContextId="component-contract:demo:button"
        registry={<p>Registry content</p>}
        editor={<p>Editor content</p>}
        preview={<p>Preview content</p>}
      />,
    );

    const registryPanel = screen
      .getByText('Registry content')
      .closest('[role="tabpanel"]');
    const editorPanel = screen
      .getByText('Editor content')
      .closest('[role="tabpanel"]');
    const previewPanel = screen
      .getByText('Preview content')
      .closest('[role="tabpanel"]');

    expect(screen.getByRole('tab', { name: 'Editor' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(registryPanel).toHaveClass('hidden', 'lg:block');
    expect(editorPanel).toHaveClass('block', 'lg:block');
    expect(previewPanel).toHaveClass('hidden', 'lg:grid');
    expect(editorPanel).toHaveAttribute(
      'data-save-context-scroll-container',
      'component-contract:demo:button',
    );

    await user.click(screen.getByRole('tab', { name: 'Preview' }));

    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(editorPanel).toHaveClass('hidden', 'lg:block');
    expect(previewPanel).toHaveClass('grid', 'lg:grid');

    await user.click(screen.getByRole('tab', { name: 'Components' }));

    expect(registryPanel).toHaveClass('block', 'lg:block');
    expect(previewPanel).toHaveClass('hidden', 'lg:grid');
  });
});
