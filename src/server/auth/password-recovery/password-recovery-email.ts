import type { AppLocale } from '@/domain/i18n';
import {
  EMAIL_VERIFICATION_DELIVERY_TIMEOUT_MS,
  MAILPIT_DEFAULT_BASE_URL,
  MAILPIT_SEND_PATH,
  RESEND_EMAIL_ENDPOINT,
} from '@/server/auth/email-verification/email-verification.constants';
import {
  EmailVerificationConfigurationError,
  EmailVerificationDeliveryError,
} from '@/server/auth/email-verification/email-verification.errors';

type EmailKind = 'changed' | 'reset';
type EmailTransport = 'mailpit' | 'resend';

type EmailCopy = {
  action?: string;
  heading: string;
  introduction: string;
  notice: string;
  subject: string;
};

const copyByKind: Record<EmailKind, Record<AppLocale, EmailCopy>> = {
  reset: {
    en: {
      subject: 'Reset your VulcanForgeUI password',
      heading: 'Reset your password',
      introduction: 'A password reset was requested for your account.',
      action: 'Choose a new password',
      notice:
        'This link expires in 30 minutes and can be used once. Ignore this message if you did not request it.',
    },
    fr: {
      subject: 'Réinitialisez votre mot de passe VulcanForgeUI',
      heading: 'Réinitialisez votre mot de passe',
      introduction:
        'Une réinitialisation du mot de passe a été demandée pour votre compte.',
      action: 'Choisir un nouveau mot de passe',
      notice:
        'Ce lien expire dans 30 minutes et ne peut être utilisé qu’une fois. Ignorez ce message si vous n’êtes pas à l’origine de la demande.',
    },
  },
  changed: {
    en: {
      subject: 'Your VulcanForgeUI password was changed',
      heading: 'Your password was changed',
      introduction: 'The password for your account has just been changed.',
      notice:
        'Existing sessions have been invalidated. Contact support if you did not make this change.',
    },
    fr: {
      subject: 'Votre mot de passe VulcanForgeUI a été modifié',
      heading: 'Votre mot de passe a été modifié',
      introduction: 'Le mot de passe de votre compte vient d’être modifié.',
      notice:
        'Les sessions existantes ont été invalidées. Contactez le support si vous n’êtes pas à l’origine de cette modification.',
    },
  },
};

export type SendPasswordRecoveryEmailInput = {
  email: string;
  idempotencyKey: string;
  kind: EmailKind;
  locale: AppLocale;
  token?: string;
};

export type SendPasswordRecoveryEmailOptions = {
  apiKey?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  from?: string;
  mailpitBaseUrl?: string;
  timeoutMs?: number;
  transport?: EmailTransport;
};

function requiredUrl(value: string | undefined, fallback: string | null) {
  const rawValue = value?.trim() || fallback;

  if (!rawValue) {
    throw new EmailVerificationConfigurationError();
  }

  try {
    const url = new URL(rawValue);

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('invalid protocol');
    }

    return url.origin;
  } catch {
    throw new EmailVerificationConfigurationError();
  }
}

function getTransport(override?: EmailTransport) {
  const configured = override ?? process.env.AUTH_EMAIL_TRANSPORT;
  const transport =
    configured ??
    (process.env.NODE_ENV === 'production' ? 'resend' : 'mailpit');

  if (
    !['mailpit', 'resend'].includes(transport) ||
    (process.env.NODE_ENV === 'production' && transport !== 'resend')
  ) {
    throw new EmailVerificationConfigurationError();
  }

  return transport as EmailTransport;
}

function createResetUrl(
  input: SendPasswordRecoveryEmailInput,
  baseUrl?: string,
) {
  if (input.kind !== 'reset') {
    return null;
  }

  if (!input.token) {
    throw new EmailVerificationConfigurationError();
  }

  const url = new URL(
    `/${input.locale}/reset-password`,
    requiredUrl(
      baseUrl ?? process.env.AUTH_EMAIL_BASE_URL,
      process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000',
    ),
  );
  url.hash = new URLSearchParams({ token: input.token }).toString();

  return url.toString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function createContent(
  input: SendPasswordRecoveryEmailInput,
  resetUrl: string | null,
) {
  const copy = copyByKind[input.kind][input.locale];
  const safeUrl = resetUrl ? escapeHtml(resetUrl) : null;
  const action =
    safeUrl && copy.action
      ? `<p><a href="${safeUrl}">${copy.action}</a></p>`
      : '';
  const fallback = safeUrl
    ? `<p style="overflow-wrap:anywhere">${safeUrl}</p>`
    : '';
  const html = `<!doctype html><html lang="${input.locale}"><body><main><p><strong>VulcanForgeUI</strong></p><h1>${copy.heading}</h1><p>${copy.introduction}</p>${action}<p>${copy.notice}</p>${fallback}</main></body></html>`;
  const text = [
    copy.heading,
    copy.introduction,
    resetUrl && copy.action ? `${copy.action}: ${resetUrl}` : null,
    copy.notice,
  ]
    .filter(Boolean)
    .join('\n\n');

  return { copy, html, text };
}

async function deliver(
  url: string,
  init: RequestInit,
  fetchImpl: typeof fetch,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('delivery rejected');
    }
  } catch {
    throw new EmailVerificationDeliveryError();
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendPasswordRecoveryEmail(
  input: SendPasswordRecoveryEmailInput,
  options: SendPasswordRecoveryEmailOptions = {},
) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  if (typeof fetchImpl !== 'function') {
    throw new EmailVerificationConfigurationError();
  }

  const transport = getTransport(options.transport);
  const content = createContent(input, createResetUrl(input, options.baseUrl));
  const timeoutMs = options.timeoutMs ?? EMAIL_VERIFICATION_DELIVERY_TIMEOUT_MS;

  if (transport === 'resend') {
    const apiKey = options.apiKey?.trim() || process.env.RESEND_API_KEY?.trim();
    const from = options.from?.trim() || process.env.AUTH_EMAIL_FROM?.trim();

    if (!apiKey || !from) {
      throw new EmailVerificationConfigurationError();
    }

    await deliver(
      RESEND_EMAIL_ENDPOINT,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': input.idempotencyKey,
        },
        body: JSON.stringify({
          from,
          to: [input.email],
          subject: content.copy.subject,
          html: content.html,
          text: content.text,
        }),
      },
      fetchImpl,
      timeoutMs,
    );
    return;
  }

  const mailpitBaseUrl = requiredUrl(
    options.mailpitBaseUrl ?? process.env.AUTH_MAILPIT_BASE_URL,
    MAILPIT_DEFAULT_BASE_URL,
  );
  const from = options.from?.trim() || 'VulcanForgeUI <auth@vulcanforge.local>';
  const senderMatch = from.match(/^\s*(.*?)\s*<\s*([^<>\s]+)\s*>\s*$/);
  const senderEmail = senderMatch?.[2] ?? from;
  const senderName = senderMatch?.[1]?.trim();

  await deliver(
    new URL(MAILPIT_SEND_PATH, mailpitBaseUrl).toString(),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: senderName
          ? { Email: senderEmail, Name: senderName }
          : { Email: senderEmail },
        To: [{ Email: input.email }],
        Subject: content.copy.subject,
        HTML: content.html,
        Text: content.text,
        Headers: {
          'X-VulcanForge-Idempotency-Key': input.idempotencyKey,
        },
        Tags: [
          input.kind === 'reset' ? 'password-recovery' : 'password-changed',
        ],
      }),
    },
    fetchImpl,
    timeoutMs,
  );
}
