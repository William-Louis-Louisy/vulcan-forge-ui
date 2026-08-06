import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailVerificationLinkBootstrap } from './EmailVerificationLinkBootstrap';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mocks.replace,
  }),
}));

describe('EmailVerificationLinkBootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    window.history.replaceState({}, '', '/en/verify-email');
  });

  it('removes the token fragment before preparing confirmation', async () => {
    window.history.replaceState({}, '', '/en/verify-email#token=opaque-value');
    let capturedInit: RequestInit | undefined;
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        capturedInit = init;

        return new Response(JSON.stringify({ status: 'confirm' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
    );
    vi.stubGlobal('fetch', fetchImpl);

    render(<EmailVerificationLinkBootstrap locale="en" />);

    expect(window.location.hash).toBe('');

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith(
        '/en/verify-email?status=confirm',
      );
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      '/api/auth/verify-email/prepare',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
      }),
    );
    expect(JSON.parse(String(capturedInit?.body))).toEqual({
      token: 'opaque-value',
    });
  });

  it('does nothing when the page has no token fragment', () => {
    const fetchImpl = vi.fn();
    vi.stubGlobal('fetch', fetchImpl);

    render(<EmailVerificationLinkBootstrap locale="en" />);

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('uses the invalid state for an untrusted response payload', async () => {
    window.history.replaceState({}, '', '/fr/verify-email#token=opaque-value');
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ status: 'unknown' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }),
      ),
    );

    render(<EmailVerificationLinkBootstrap locale="fr" />);

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith(
        '/fr/verify-email?status=invalid',
      );
    });
  });
});
