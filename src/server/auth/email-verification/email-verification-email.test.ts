import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  EmailVerificationConfigurationError,
  EmailVerificationDeliveryError,
} from './email-verification.errors';
import { sendEmailVerificationEmail } from './email-verification-email';

const verificationInput = {
  email: 'william@example.com',
  idempotencyKey: 'email-verification/token-1',
  locale: 'fr' as const,
  token: 'verification-token',
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('sendEmailVerificationEmail', () => {
  it('sends a localized single-use verification link through Resend', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(JSON.stringify({ id: 'email-1' }), { status: 200 }),
    );

    await sendEmailVerificationEmail(verificationInput, {
      apiKey: 'test-api-key',
      baseUrl: 'https://app.example.com',
      fetchImpl,
      from: 'VulcanForgeUI <auth@example.com>',
      transport: 'resend',
    });

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
      'https://app.example.com/fr/verify-email#token=verification-token',
    );
    expect(body.html).not.toContain('/api/auth/verify-email?');
    expect(body.text).toContain(
      'https://app.example.com/fr/verify-email#token=verification-token',
    );
  });

  it('captures local verification messages through the Mailpit HTTP API', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(JSON.stringify({ ID: 'message-1' }), { status: 200 }),
    );

    await sendEmailVerificationEmail(verificationInput, {
      baseUrl: 'http://localhost:3000',
      fetchImpl,
      mailpitBaseUrl: 'http://localhost:8025',
      transport: 'mailpit',
    });

    const call = fetchImpl.mock.calls[0];
    const body = JSON.parse(String(call?.[1]?.body)) as {
      From: { Email: string; Name?: string };
      Headers: Record<string, string>;
      HTML: string;
      Subject: string;
      Tags: string[];
      Text: string;
      To: { Email: string }[];
    };

    expect(String(call?.[0])).toBe('http://localhost:8025/api/v1/send');
    expect(new Headers(call?.[1]?.headers).get('Authorization')).toBeNull();
    expect(body.From).toEqual({
      Email: 'auth@vulcanforge.local',
      Name: 'VulcanForgeUI',
    });
    expect(body.To).toEqual([{ Email: 'william@example.com' }]);
    expect(body.Tags).toEqual(['email-verification']);
    expect(body.Headers['X-VulcanForge-Idempotency-Key']).toBe(
      'email-verification/token-1',
    );
    expect(body.HTML).toContain(
      'http://localhost:3000/fr/verify-email#token=verification-token',
    );
    expect(body.Text).toContain(
      'http://localhost:3000/fr/verify-email#token=verification-token',
    );
  });

  it('fails closed when Resend configuration is missing', async () => {
    await expect(
      sendEmailVerificationEmail(verificationInput, {
        apiKey: ' ',
        baseUrl: 'https://app.example.com',
        fetchImpl: vi.fn(),
        from: ' ',
        transport: 'resend',
      }),
    ).rejects.toBeInstanceOf(EmailVerificationConfigurationError);
  });

  it('does not allow the local Mailpit transport in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await expect(
      sendEmailVerificationEmail(verificationInput, {
        baseUrl: 'https://app.example.com',
        fetchImpl: vi.fn(),
        transport: 'mailpit',
      }),
    ).rejects.toBeInstanceOf(EmailVerificationConfigurationError);
  });

  it('maps provider failures to a bounded delivery error', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response('unavailable', { status: 503 }),
    );

    await expect(
      sendEmailVerificationEmail(verificationInput, {
        apiKey: 'test-api-key',
        baseUrl: 'https://app.example.com',
        fetchImpl,
        from: 'VulcanForgeUI <auth@example.com>',
        transport: 'resend',
      }),
    ).rejects.toBeInstanceOf(EmailVerificationDeliveryError);
  });
});
