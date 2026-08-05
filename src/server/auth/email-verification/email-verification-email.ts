import type { AppLocale } from '@/domain/i18n';
import {
  EMAIL_VERIFICATION_DELIVERY_TIMEOUT_MS,
  RESEND_EMAIL_ENDPOINT,
} from './email-verification.constants';
import {
  EmailVerificationConfigurationError,
  EmailVerificationDeliveryError,
} from './email-verification.errors';

type VerificationEmailCopy = {
  subject: string;
  heading: string;
  introduction: string;
  action: string;
  expiry: string;
  fallback: string;
};

const verificationEmailCopy: Record<AppLocale, VerificationEmailCopy> = {
  en: {
    subject: 'Verify your VulcanForgeUI email address',
    heading: 'Verify your email address',
    introduction:
      'Confirm that you own this email address before accessing your VulcanForgeUI workspace.',
    action: 'Verify email address',
    expiry: 'This link expires in 30 minutes and can be used only once.',
    fallback: 'If the button does not work, copy and paste this link into your browser:',
  },
  fr: {
    subject: 'Vérifiez votre adresse e-mail VulcanForgeUI',
    heading: 'Vérifiez votre adresse e-mail',
    introduction:
      'Confirmez que vous contrôlez cette adresse e-mail avant d’accéder à votre espace VulcanForgeUI.',
    action: 'Vérifier mon adresse e-mail',
    expiry: 'Ce lien expire dans 30 minutes et ne peut être utilisé qu’une seule fois.',
    fallback:
      'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
  },
};

export type SendEmailVerificationEmailInput = {
  email: string;
  idempotencyKey: string;
  locale: AppLocale;
  token: string;
};

type SendEmailVerificationEmailOptions = {
  apiKey?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  from?: string;
  timeoutMs?: number;
};

function getConfiguredValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function getBaseUrl(override?: string) {
  const configuredBaseUrl = getConfiguredValue(
    override ?? process.env.AUTH_EMAIL_BASE_URL,
  );
  const fallbackBaseUrl =
    process.env.NODE_ENV === 'production' ? null : 'http://localhost:3000';
  const rawBaseUrl = configuredBaseUrl ?? fallbackBaseUrl;

  if (!rawBaseUrl) {
    throw new EmailVerificationConfigurationError();
  }

  let url: URL;

  try {
    url = new URL(rawBaseUrl);
  } catch {
    throw new EmailVerificationConfigurationError();
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    (process.env.NODE_ENV === 'production' && url.protocol !== 'https:')
  ) {
    throw new EmailVerificationConfigurationError();
  }

  return url.origin;
}

function createVerificationUrl({
  baseUrl,
  locale,
  token,
}: {
  baseUrl: string;
  locale: AppLocale;
  token: string;
}) {
  const url = new URL('/api/auth/verify-email', baseUrl);
  url.searchParams.set('locale', locale);
  url.searchParams.set('token', token);

  return url.toString();
}

function createEmailContent({
  locale,
  verificationUrl,
}: {
  locale: AppLocale;
  verificationUrl: string;
}) {
  const copy = verificationEmailCopy[locale];
  const html = `<!doctype html>
<html lang="${locale}">
  <body style="margin:0;background:#f6f7f9;color:#111827;font-family:Arial,sans-serif;padding:32px 16px;">
    <main style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;max-width:560px;margin:0 auto;padding:32px;">
      <p style="font-size:14px;font-weight:700;letter-spacing:.08em;margin:0 0 16px;text-transform:uppercase;">VulcanForgeUI</p>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px;">${copy.heading}</h1>
      <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">${copy.introduction}</p>
      <p style="margin:0 0 24px;">
        <a href="${verificationUrl}" style="background:#111827;border-radius:8px;color:#ffffff;display:inline-block;font-size:16px;font-weight:700;padding:12px 18px;text-decoration:none;">${copy.action}</a>
      </p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">${copy.expiry}</p>
      <p style="font-size:13px;line-height:1.6;margin:0 0 8px;">${copy.fallback}</p>
      <p style="font-size:12px;line-height:1.6;margin:0;overflow-wrap:anywhere;">${verificationUrl}</p>
    </main>
  </body>
</html>`;
  const text = `${copy.heading}\n\n${copy.introduction}\n\n${copy.action}: ${verificationUrl}\n\n${copy.expiry}`;

  return {
    copy,
    html,
    text,
  };
}

export async function sendEmailVerificationEmail(
  input: SendEmailVerificationEmailInput,
  options: SendEmailVerificationEmailOptions = {},
) {
  const apiKey = getConfiguredValue(
    options.apiKey ?? process.env.RESEND_API_KEY,
  );
  const from = getConfiguredValue(
    options.from ?? process.env.AUTH_EMAIL_FROM,
  );
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  if (!apiKey || !from || typeof fetchImpl !== 'function') {
    throw new EmailVerificationConfigurationError();
  }

  const verificationUrl = createVerificationUrl({
    baseUrl: getBaseUrl(options.baseUrl),
    locale: input.locale,
    token: input.token,
  });
  const { copy, html, text } = createEmailContent({
    locale: input.locale,
    verificationUrl,
  });
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? EMAIL_VERIFICATION_DELIVERY_TIMEOUT_MS,
  );

  let response: Response;

  try {
    response = await fetchImpl(RESEND_EMAIL_ENDPOINT, {
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: copy.subject,
        html,
        text,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': input.idempotencyKey,
      },
      method: 'POST',
      signal: controller.signal,
    });
  } catch {
    throw new EmailVerificationDeliveryError();
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new EmailVerificationDeliveryError();
  }
}
