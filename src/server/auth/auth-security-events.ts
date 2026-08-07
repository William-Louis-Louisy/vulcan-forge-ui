export type AuthSecurityEventName =
  | 'auth.email_verification.already_verified'
  | 'auth.email_verification.delivery_failed'
  | 'auth.email_verification.expired'
  | 'auth.email_verification.invalid'
  | 'auth.email_verification.link_opened'
  | 'auth.email_verification.rate_limited'
  | 'auth.email_verification.sent'
  | 'auth.email_verification.unexpected_error'
  | 'auth.email_verification.verified'
  | 'auth.login.rejected'
  | 'auth.login.rate_limited'
  | 'auth.login.succeeded'
  | 'auth.logout.succeeded'
  | 'auth.password.rehash_failed'
  | 'auth.password.rehash_skipped'
  | 'auth.password.rehash_succeeded'
  | 'auth.password_recovery.changed_notification_failed'
  | 'auth.password_recovery.delivery_failed'
  | 'auth.password_recovery.expired'
  | 'auth.password_recovery.invalid'
  | 'auth.password_recovery.link_opened'
  | 'auth.password_recovery.password_check_unavailable'
  | 'auth.password_recovery.password_compromised'
  | 'auth.password_recovery.password_hashing_unavailable'
  | 'auth.password_recovery.rate_limited'
  | 'auth.password_recovery.requested'
  | 'auth.password_recovery.reset_completed'
  | 'auth.password_recovery.sent'
  | 'auth.password_recovery.unexpected_error'
  | 'auth.rate_limit.error'
  | 'auth.session.revocation_failed'
  | 'auth.session.revoked_all'
  | 'auth.signup.created'
  | 'auth.signup.duplicate'
  | 'auth.signup.password_check_unavailable'
  | 'auth.signup.password_compromised'
  | 'auth.signup.password_hashing_unavailable'
  | 'auth.signup.rate_limited'
  | 'auth.signup.sign_in_failed'
  | 'auth.signup.unexpected_error';

type AuthSecurityEventMetadata = Record<
  string,
  boolean | number | string | null | undefined
>;

const warningEvents = new Set<AuthSecurityEventName>([
  'auth.email_verification.delivery_failed',
  'auth.email_verification.expired',
  'auth.email_verification.invalid',
  'auth.email_verification.rate_limited',
  'auth.email_verification.unexpected_error',
  'auth.login.rejected',
  'auth.login.rate_limited',
  'auth.password.rehash_failed',
  'auth.password.rehash_skipped',
  'auth.password_recovery.changed_notification_failed',
  'auth.password_recovery.delivery_failed',
  'auth.password_recovery.expired',
  'auth.password_recovery.invalid',
  'auth.password_recovery.password_check_unavailable',
  'auth.password_recovery.password_compromised',
  'auth.password_recovery.password_hashing_unavailable',
  'auth.password_recovery.rate_limited',
  'auth.password_recovery.unexpected_error',
  'auth.rate_limit.error',
  'auth.session.revocation_failed',
  'auth.signup.duplicate',
  'auth.signup.password_check_unavailable',
  'auth.signup.password_compromised',
  'auth.signup.password_hashing_unavailable',
  'auth.signup.rate_limited',
  'auth.signup.sign_in_failed',
  'auth.signup.unexpected_error',
]);

export function recordAuthSecurityEvent(
  event: AuthSecurityEventName,
  metadata: AuthSecurityEventMetadata = {},
) {
  const entry = JSON.stringify({
    event,
    occurredAt: new Date().toISOString(),
    ...metadata,
  });

  if (warningEvents.has(event)) {
    console.warn('[auth-security]', entry);
    return;
  }

  // Security success events remain informational rather than warning-level logs.
  // eslint-disable-next-line no-console
  console.info('[auth-security]', entry);
}
