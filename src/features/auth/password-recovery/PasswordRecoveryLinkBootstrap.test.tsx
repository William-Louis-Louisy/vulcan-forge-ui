import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordRecoveryLinkBootstrap } from './PasswordRecoveryLinkBootstrap';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mocks.replace,
  }),
}));

describe('PasswordRecoveryLinkBootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    window.history.replaceState({}, '', '/en/reset-password');
  });

  it('removes the fragment before preparing the reset token', async () => {
    window.history.replaceState(
      {},
      '',
      '/en/reset-password#token=opaque-token',
    );
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ status: 'confirm' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchImpl);

    render(<PasswordRecoveryLinkBootstrap locale="en" />);

    expect(window.location.hash).toBe('');

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith(
        '/en/reset-password?status=confirm',
      );
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      '/api/auth/password-recovery/prepare',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
      }),
    );
  });

  it('does nothing without a fragment token', () => {
    const fetchImpl = vi.fn();
    vi.stubGlobal('fetch', fetchImpl);

    render(<PasswordRecoveryLinkBootstrap locale="en" />);

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
