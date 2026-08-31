import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentResponsiveWorkspace } from './ComponentResponsiveWorkspace';

const workspaceMock = vi.hoisted(() => ({
  current: null as null | {
    draft: { name: string };
    authoringSelection:
      | { kind: 'component' }
      | { kind: 'anatomyPart'; draftId: string };
  },
}));

vi.mock('./ComponentContractWorkspaceContext', () => ({
  useOptionalComponentContractWorkspace: () => workspaceMock.current,
}));

function createMatchMedia(matches = false) {
  return vi.fn((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function renderWorkspace() {
  return render(
    <ComponentResponsiveWorkspace
      labels={{
        navigation: 'Components',
        canvas: 'Canvas',
        inspector: 'Inspector',
      }}
      componentName="Button"
      inspectorScrollContextId="component-contract:demo:button"
      navigation={
        <div>
          <p>Navigation content</p>
          <button type="button">Navigation action</button>
        </div>
      }
      canvas={
        <div>
          <p>Canvas content</p>
          <button type="button">Canvas selection</button>
        </div>
      }
      inspector={
        <div>
          <p>Inspector content</p>
          <button type="button">Inspector action</button>
        </div>
      }
      saveAction={<button type="button">Save</button>}
    />,
  );
}

describe('ComponentResponsiveWorkspace', () => {
  beforeEach(() => {
    workspaceMock.current = null;
    vi.stubGlobal('matchMedia', createMatchMedia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps Canvas primary while trapping and restoring focus in responsive auxiliary panels', async () => {
    const user = userEvent.setup();

    renderWorkspace();

    const navigationPanel = screen
      .getByText('Navigation content')
      .closest('aside');
    const inspectorPanel = screen
      .getByText('Inspector content')
      .closest('aside');
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
    expect(navigationPanel).toHaveAttribute('role', 'dialog');
    expect(navigationPanel).toHaveAttribute('aria-modal', 'true');
    expect(navigationTrigger).toHaveAttribute('aria-expanded', 'true');

    const navigationBack = within(navigationPanel as HTMLElement).getByRole(
      'button',
      { name: /Canvas/ },
    );
    const navigationAction = within(navigationPanel as HTMLElement).getByRole(
      'button',
      { name: 'Navigation action' },
    );
    expect(navigationBack).toHaveFocus();

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(navigationAction).toHaveFocus();

    await user.tab();
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
    expect(inspectorPanel).toHaveAttribute('role', 'dialog');
    expect(inspectorTrigger).toHaveAttribute('aria-expanded', 'true');

    const inspectorBack = within(inspectorPanel as HTMLElement).getByRole(
      'button',
      { name: /Canvas/ },
    );
    const inspectorAction = within(inspectorPanel as HTMLElement).getByRole(
      'button',
      { name: 'Inspector action' },
    );
    expect(inspectorBack).toHaveFocus();

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(inspectorAction).toHaveFocus();

    await user.tab();
    expect(inspectorBack).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(inspectorPanel).toHaveClass('hidden', 'xl:block');
    expect(inspectorTrigger).toHaveFocus();
  });

  it('opens the responsive Inspector when Canvas authoring selection becomes contextual without reopening after Back', async () => {
    const user = userEvent.setup();
    workspaceMock.current = {
      draft: { name: 'Button' },
      authoringSelection: { kind: 'component' },
    };

    const { rerender } = renderWorkspace();
    const canvasSelection = screen.getByRole('button', {
      name: 'Canvas selection',
    });
    const inspectorPanel = screen
      .getByText('Inspector content')
      .closest('aside') as HTMLElement;

    canvasSelection.focus();
    expect(canvasSelection).toHaveFocus();

    workspaceMock.current = {
      draft: { name: 'Button' },
      authoringSelection: { kind: 'anatomyPart', draftId: 'root' },
    };
    rerender(
      <ComponentResponsiveWorkspace
        labels={{
          navigation: 'Components',
          canvas: 'Canvas',
          inspector: 'Inspector',
        }}
        componentName="Button"
        inspectorScrollContextId="component-contract:demo:button"
        navigation={<p>Navigation content</p>}
        canvas={<button type="button">Canvas selection</button>}
        inspector={<p>Inspector content</p>}
        saveAction={<button type="button">Save</button>}
      />,
    );

    await waitFor(() => {
      expect(inspectorPanel).toHaveAttribute('role', 'dialog');
    });

    const inspectorBack = within(inspectorPanel).getByRole('button', {
      name: /Canvas/,
    });
    expect(inspectorBack).toHaveFocus();

    await user.click(inspectorBack);

    expect(inspectorPanel).not.toHaveAttribute('role', 'dialog');
    expect(screen.getByRole('button', { name: 'Canvas selection' })).toHaveFocus();
  });
});
