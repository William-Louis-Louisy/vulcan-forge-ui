import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('renders selection semantics and activates options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        ariaLabel="Preview theme mode"
        value="light"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    expect(
      screen.getByRole('group', { name: 'Preview theme mode' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Dark' }));

    expect(onValueChange).toHaveBeenCalledWith('dark');
  });

  it('supports automatic keyboard activation for tabs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        ariaLabel="Preview modes"
        semantics="tabs"
        value="rendered"
        options={[
          {
            value: 'rendered',
            label: 'Rendered',
            id: 'rendered-tab',
            controls: 'preview-panel',
          },
          {
            value: 'source',
            label: 'Source',
            id: 'source-tab',
            controls: 'preview-panel',
          },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const renderedTab = screen.getByRole('tab', { name: 'Rendered' });
    renderedTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith('source');
    expect(screen.getByRole('tab', { name: 'Source' })).toHaveFocus();
  });
});
