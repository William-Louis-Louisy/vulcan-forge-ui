import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ComponentResponsiveWorkspace } from './ComponentResponsiveWorkspace';

describe('ComponentResponsiveWorkspace', () => {
  it('keeps Canvas primary while Navigation and Inspector become responsive auxiliary panels', async () => {
    const user = userEvent.setup();

    render(
      <ComponentResponsiveWorkspace
        labels={{
          navigation: 'Components',
          canvas: 'Canvas',
          inspector: 'Inspector',
        }}
        componentName="Button"
        inspectorScrollContextId="component-contract:demo:button"
        navigation={<p>Navigation content</p>}
        canvas={<p>Canvas content</p>}
        inspector={<p>Inspector content</p>}
        saveAction={<button type="button">Save</button>}
      />,
    );

    const navigationPanel = screen
      .getByText('Navigation content')
      .closest('aside');
    const inspectorPanel = screen.getByText('Inspector content').closest('aside');
    const canvas = screen.getByRole('main', { name: 'Canvas' });
    const navigationTrigger = screen.getByRole('button', {
      name: 'Components',
    });
    const inspectorTrigger = screen.getByRole('button', {
      name: 'Inspector',
    });

    expect(screen.getByRole('heading', { name: 'Button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(canvas).toHaveTextContent('Canvas content');
    expect(navigationPanel).toHaveClass('hidden', 'lg:block');
    expect(inspectorPanel).toHaveClass('hidden', 'xl:block');
    expect(inspectorPanel).toHaveAttribute(
      'data-save-context-scroll-container',
      'component-contract:demo:button',
    );
    expect(navigationTrigger).toHaveClass('lg:hidden');
    expect(inspectorTrigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(navigationTrigger);

    expect(navigationPanel).toHaveClass('fixed', 'block', 'lg:static');
    expect(navigationTrigger).toHaveAttribute('aria-expanded', 'true');

    const navigationBack = within(navigationPanel as HTMLElement).getByRole(
      'button',
      { name: /Canvas/ },
    );
    expect(navigationBack).toHaveFocus();

    await user.click(navigationBack);

    expect(navigationPanel).toHaveClass('hidden', 'lg:block');
    expect(navigationTrigger).toHaveFocus();

    await user.click(inspectorTrigger);

    expect(inspectorPanel).toHaveClass(
      'fixed',
      'block',
      'sm:right-0',
      'xl:static',
    );
    expect(inspectorTrigger).toHaveAttribute('aria-expanded', 'true');

    const inspectorBack = within(inspectorPanel as HTMLElement).getByRole(
      'button',
      { name: /Canvas/ },
    );
    expect(inspectorBack).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(inspectorPanel).toHaveClass('hidden', 'xl:block');
    expect(inspectorTrigger).toHaveFocus();
  });
});
