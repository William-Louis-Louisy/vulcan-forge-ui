import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemesResponsiveWorkspace } from './ThemesResponsiveWorkspace';

function renderWorkspace() {
  return render(
    <ThemesResponsiveWorkspace
      labels={{
        editor: 'Theme editor',
        preview: 'Preview',
        themeNavigation: 'Theme modes',
      }}
      title="Themes"
      description="Map theme roles and review contrast."
      summary="2 themes"
      themes={[
        {
          id: 'light-theme',
          label: 'Light',
          content: <p>Light editor content</p>,
        },
        {
          id: 'dark-theme',
          label: 'Dark',
          content: <p>Dark editor content</p>,
        },
      ]}
      preview={<p>Preview content</p>}
    />,
  );
}

describe('ThemesResponsiveWorkspace', () => {
  it('defaults to the editor and lets mobile users open the preview', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const editorPanel = screen
      .getByText('Light editor content')
      .closest('#themes-workspace-panel-editor');
    const previewPanel = screen
      .getByText('Preview content')
      .closest('[role="tabpanel"]');

    expect(screen.getByRole('tab', { name: 'Theme editor' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(editorPanel).toHaveClass('flex', 'lg:flex');
    expect(previewPanel).toHaveClass('hidden', 'lg:block');

    await user.click(screen.getByRole('tab', { name: 'Preview' }));

    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(editorPanel).toHaveClass('hidden', 'lg:flex');
    expect(previewPanel).toHaveClass('block', 'lg:block');
  });

  it('shows one active theme editor at a time', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    expect(screen.getByText('Light editor content')).toBeInTheDocument();
    expect(screen.queryByText('Dark editor content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Dark' }));

    expect(screen.queryByText('Light editor content')).not.toBeInTheDocument();
    expect(screen.getByText('Dark editor content')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Dark' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
