export type AuthSecurityEventName =
  | 'auth.login.rejected'
  | 'auth.login.rate_limited'
  | 'auth.login.succeeded'
  | 'auth.rate_limit.error'
  | 'auth.signup.created'
  | 'auth.signup.duplicate'
  | 'auth.signup.rate_limited'
  | 'auth.signup.sign_in_failed'
  | 'auth.signup.unexpected_error';

type AuthSecurityEventMetadata = Record<
  string,
  boolean | number | string | null | undefined
>;

const warningEvents = new Set<AuthSecurityEventName>([
  'auth.login.rejected',
  'auth.login.rate_limited',
  'auth.rate_limit.error',
  'auth.signup.duplicate',
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

  console.info('[auth-security]', entry);
}
