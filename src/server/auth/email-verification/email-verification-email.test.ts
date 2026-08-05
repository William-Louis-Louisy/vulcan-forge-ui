import { describe, expect, it, vi } from 'vitest';
import {
  EmailVerificationConfigurationError,
  EmailVerificationDeliveryError,
} from './email-verification.errors';
import { sendEmailVerificationEmail } from './email-verification-email';

describe('sendEmailVerificationEmail', () => {
  it('sends a localized single-use verification link through Resend', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }),
    );

    await sendEmailVerificationEmail(
      {
        email: 'william@example.com',
        idempotencyKey: 'email-verification/token-1',
        locale: 'fr',
        token: 'verification-token',
      },
      {
        apiKey: 'test-api-key',
        baseUrl: 'https://app.example.com',
        fetchImpl,
        from: 'VulcanForgeUI <auth@example.com>',
      },
    );

    const call = fetchImpl.mock.calls[0];
    const body = JSON.parse(String(call?.[1]?.body)) as {
      html: string;
      subject: string;
      text: string;
      to: string[];
    };

    expect(String(call?.[0])).toBe('https://api.resend.com/emails');
    expect(call?.[1]?.method).toBe('POST');
    expect(new Headers(call?.[1]?.headers).get('Authorization')).toBe(
      'Bearer test-api-key',
    );
    expect(new Headers(call?.[1]?.headers).get('Idempotency-Key')).toBe(
      'email-verification/token-1',
    );
    expect(body.to).toEqual(['william@example.com']);
    expect(body.subject).toContain('Vérifiez');
    expect(body.html).toContain(
      'https://app.example.com/api/auth/verify-email?locale=fr&amp;',
    );
    expect(body.text).toContain('token=verification-token');
  });

  it('fails closed when delivery configuration is missing', async () => {
    await expect(
      sendEmailVerificationEmail(
        {
          email: 'william@example.com',
          idempotencyKey: 'email-verification/token-1',
          locale: 'en',
          token: 'verification-token',
        },
        {
          apiKey: ' ',
          baseUrl: 'https://app.example.com',
          fetchImpl: vi.fn(),
          from: ' ',
        },
      ),
    ).rejects.toBeInstanceOf(EmailVerificationConfigurationError);
  });

  it('maps provider failures to a bounded delivery error', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response('unavailable', { status: 503 }),
    );

    await expect(
      sendEmailVerificationEmail(
        {
          email: 'william@example.com',
          idempotencyKey: 'email-verification/token-1',
          locale: 'en',
          token: 'verification-token',
        },
        {
          apiKey: 'test-api-key',
          baseUrl: 'https://app.example.com',
          fetchImpl,
          from: 'VulcanForgeUI <auth@example.com>',
        },
      ),
    ).rejects.toBeInstanceOf(EmailVerificationDeliveryError);
  });
});
