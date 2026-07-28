import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

import { Dialog, DialogActions } from './Dialog';

describe('Dialog', () => {
  it('uses a bottom sheet on mobile and a centered modal from sm', () => {
    const { container } = render(
      <Dialog open={false} onClose={vi.fn()} ariaLabel="Create token">
        <form>
          <DialogActions>
            <button type="button">Cancel</button>
            <button type="submit">Create</button>
          </DialogActions>
        </form>
      </Dialog>,
    );

    const dialog = container.querySelector('dialog');
    const actions = container.querySelector('form > div');

    expect(dialog).toHaveClass(
      'bottom-0',
      'w-full',
      'sm:top-1/2',
      'sm:left-1/2',
      'sm:w-[calc(100%-2rem)]',
      'sm:-translate-x-1/2',
      'sm:-translate-y-1/2',
    );
    expect(actions).toHaveClass(
      'sticky',
      'bottom-0',
      'grid-cols-2',
      'sm:justify-end',
    );
  });
});
