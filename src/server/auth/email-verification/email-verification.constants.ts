export const EMAIL_VERIFICATION_TOKEN_BYTES = 32;
export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 30 * 60_000;
export const EMAIL_VERIFICATION_TOKEN_MAX_LENGTH = 128;

export const EMAIL_VERIFICATION_CONFIRMATION_COOKIE =
  'vulcan_email_verification_confirmation';
export const EMAIL_VERIFICATION_CONFIRMATION_COOKIE_TTL_SECONDS = 10 * 60;

export const EMAIL_VERIFICATION_DELIVERY_TIMEOUT_MS = 5_000;
export const MAILPIT_DEFAULT_BASE_URL = 'http://localhost:8025';
export const MAILPIT_SEND_PATH = '/api/v1/send';
export const RESEND_EMAIL_ENDPOINT = 'https://api.resend.com/emails';
