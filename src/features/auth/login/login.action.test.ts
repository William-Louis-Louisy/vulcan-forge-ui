import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginAction } from './login.action';
import { initialLoginActionState } from './login.state';

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock('@/auth', () => ({
  signIn: mocks.signIn,
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));

function createLoginFormData(returnTo?: string) {
  const formData = new FormData();
  formData.set('locale', 'en');
  formData.set('email', 'william@example.com');
  formData.set('password', 'a login password');

  if (returnTo !== undefined) {
    formData.set('returnTo', returnTo);
  }

  return formData;
}

describe('loginAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signIn.mockResolvedValue(undefined);
  });

  it('uses a validated internal destination', async () => {
    const returnTo = '/en/app/projects/project-1/tokens?set=color';

    await loginAction(initialLoginActionState, createLoginFormData(returnTo));

    expect(mocks.signIn).toHaveBeenCalledWith('credentials', {
      email: 'william@example.com',
      password: 'a login password',
      redirectTo: returnTo,
    });
    expect(mocks.redirect).toHaveBeenCalledWith(returnTo);
  });

  it.each([
    'https://example.com/en/app',
    '//example.com/en/app',
    '/fr/app',
    '/en/login',
  ])('falls back for an unsafe destination: %s', async (returnTo) => {
    await loginAction(initialLoginActionState, createLoginFormData(returnTo));

    expect(mocks.signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({
        redirectTo: '/en/app',
      }),
    );
    expect(mocks.redirect).toHaveBeenCalledWith('/en/app');
  });
});
