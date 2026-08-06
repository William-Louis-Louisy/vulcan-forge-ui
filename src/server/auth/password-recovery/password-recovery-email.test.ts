import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  EmailVerificationConfigurationError,
  EmailVerificationDeliveryError,
} from '@/server/auth/email-verification/email-verification.errors';
import { sendPasswordRecoveryEmail } from './password-recovery-email';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('sendPasswordRecoveryEmail', () => {
  it('sends a fragment-protected reset link through Resend', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 200 }));

    await sendPasswordRecoveryEmail(
      {
        email: 'william@example.com',
        idempotencyKey: 'password-recovery/challenge-1',
        kind: 'reset',
        locale: 'fr',
        token: 'opaque-token',
      },
      {
        apiKey: 'test-key',
        baseUrl: 'https://app.example.com',
        fetchImpl,
        from: 'VulcanForgeUI <auth@example.com>',
        transport: 'resend',
      },
    );

    const call = fetchImpl.mock.calls[0];
    const body = JSON.parse(String(call?.[1]?.body)) as {
      html: string;
      text: string;
    };

    expect(String(call?.[0])).toBe('https://api.resend.com/emails');
    expect(body.html).toContain(
      'https://app.example.com/fr/reset-password#token=opaque-token',
    );
    expect(body.html).not.toContain('?token=');
    expect(body.text).toContain(
      'https://app.example.com/fr/reset-password#token=opaque-token',
    );
  });

  it('captures a password-changed notification without a token', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 200 }));

    await sendPasswordRecoveryEmail(
      {
        email: 'william@example.com',
        idempotencyKey: 'password-changed/user-1/event-1',
        kind: 'changed',
        locale: 'en',
      },
      {
        fetchImpl,
        mailpitBaseUrl: 'http://localhost:8025',
        transport: 'mailpit',
      },
    );

    const call = fetchImpl.mock.calls[0];
    const body = JSON.parse(String(call?.[1]?.body)) as {
      HTML: string;
      Tags: string[];
      Text: string;
    };

    expect(String(call?.[0])).toBe('http://localhost:8025/api/v1/send');
    expect(body.Tags).toEqual(['password-changed']);
    expect(body.HTML).not.toContain('reset-password');
    expect(body.Text).not.toContain('opaque-token');
  });

  it('requires a token for reset messages', async () => {
    await expect(
      sendPasswordRecoveryEmail(
        {
          email: 'william@example.com',
          idempotencyKey: 'password-recovery/challenge-1',
          kind: 'reset',
          locale: 'en',
        },
        {
          fetchImpl: vi.fn(),
          transport: 'mailpit',
        },
      ),
    ).rejects.toBeInstanceOf(EmailVerificationConfigurationError);
  });

  it('maps provider rejection to a bounded delivery error', async () => {
    await expect(
      sendPasswordRecoveryEmail(
        {
          email: 'william@example.com',
          idempotencyKey: 'password-recovery/challenge-1',
          kind: 'reset',
          locale: 'en',
          token: 'opaque-token',
        },
        {
          apiKey: 'test-key',
          baseUrl: 'https://app.example.com',
          fetchImpl: vi.fn(async () => new Response('no', { status: 503 })),
          from: 'VulcanForgeUI <auth@example.com>',
          transport: 'resend',
        },
      ),
    ).rejects.toBeInstanceOf(EmailVerificationDeliveryError);
  });
});
