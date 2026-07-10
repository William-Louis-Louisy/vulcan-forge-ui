import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemesResponsiveWorkspace } from './ThemesResponsiveWorkspace';

describe('ThemesResponsiveWorkspace', () => {
  it('defaults to the editor and lets mobile users open the preview', async () => {
    const user = userEvent.setup();

    render(
      <ThemesResponsiveWorkspace
        labels={{
          editor: 'Theme editor',
          preview: 'Preview',
        }}
        editor={<p>Editor content</p>}
        preview={<p>Preview content</p>}
      />,
    );

    const editorPanel = screen
      .getByText('Editor content')
      .closest('[role="tabpanel"]');
    const previewPanel = screen
      .getByText('Preview content')
      .closest('[role="tabpanel"]');

    expect(screen.getByRole('tab', { name: 'Theme editor' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(editorPanel).toHaveClass('block', 'lg:block');
    expect(previewPanel).toHaveClass('hidden', 'lg:block');

    await user.click(screen.getByRole('tab', { name: 'Preview' }));

    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(editorPanel).toHaveClass('hidden', 'lg:block');
    expect(previewPanel).toHaveClass('block', 'lg:block');
  });
});
