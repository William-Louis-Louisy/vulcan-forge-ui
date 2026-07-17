import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemesResponsiveWorkspace } from './ThemesResponsiveWorkspace';

const labels = {
  editor: 'Theme editor',
  preview: 'Preview',
  workspaceNavigation: 'Theme workspace sections',
  themeNavigation: 'Theme modes',
};

function renderWorkspace() {
  return render(
    <ThemesResponsiveWorkspace
      labels={labels}
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
      emptyState={<p>No themes available</p>}
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

  it('supports arrow-key navigation between mobile workspace tabs', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const editorTab = screen.getByRole('tab', { name: 'Theme editor' });
    const previewTab = screen.getByRole('tab', { name: 'Preview' });

    editorTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(previewTab).toHaveFocus();
    expect(previewTab).toHaveAttribute('aria-selected', 'true');
    expect(editorTab).toHaveAttribute('tabindex', '-1');
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

  it('supports arrow, Home and End keys between theme modes', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const lightTab = screen.getByRole('tab', { name: 'Light' });
    const darkTab = screen.getByRole('tab', { name: 'Dark' });

    lightTab.focus();
    await user.keyboard('{End}');

    expect(darkTab).toHaveFocus();
    expect(screen.getByText('Dark editor content')).toBeInTheDocument();

    await user.keyboard('{Home}');

    expect(lightTab).toHaveFocus();
    expect(screen.getByText('Light editor content')).toBeInTheDocument();
  });

  it('renders a dedicated state when the project has no themes', () => {
    render(
      <ThemesResponsiveWorkspace
        labels={labels}
        title="Themes"
        description="Map theme roles and review contrast."
        summary="No theme"
        themes={[]}
        emptyState={<p>No themes available</p>}
        preview={<p>Preview content</p>}
      />,
    );

    expect(screen.getByText('No themes available')).toBeInTheDocument();
    expect(
      screen.queryByRole('tablist', { name: 'Theme modes' }),
    ).not.toBeInTheDocument();
  });
});
