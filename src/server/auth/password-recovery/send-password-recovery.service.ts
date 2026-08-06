import { randomUUID } from 'node:crypto';
import type { AppLocale } from '@/domain/i18n';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import { sendPasswordRecoveryEmail } from './password-recovery-email';
import {
  createPasswordRecoveryChallenge,
  revokePasswordRecoveryChallenge,
} from './password-recovery.service';

export async function sendPasswordRecoveryChallenge({
  email,
  locale,
  userId,
}: {
  email: string;
  locale: AppLocale;
  userId: string;
}) {
  const challenge = await createPasswordRecoveryChallenge({ userId });

  try {
    await sendPasswordRecoveryEmail({
      email,
      idempotencyKey: `password-recovery/${challenge.id}`,
      kind: 'reset',
      locale,
      token: challenge.token,
    });
  } catch {
    await revokePasswordRecoveryChallenge({
      id: challenge.id,
      userId,
    });
    recordAuthSecurityEvent('auth.password_recovery.delivery_failed', {
      expiresAt: challenge.expiresAt.toISOString(),
      userId,
    });
    return {
      status: 'deliveryUnavailable' as const,
    };
  }

  recordAuthSecurityEvent('auth.password_recovery.sent', {
    expiresAt: challenge.expiresAt.toISOString(),
    userId,
  });

  return {
    status: 'sent' as const,
  };
}

export async function sendPasswordChangedNotification({
  email,
  locale,
  userId,
}: {
  email: string;
  locale: AppLocale;
  userId: string;
}) {
  try {
    await sendPasswordRecoveryEmail({
      email,
      idempotencyKey: `password-changed/${userId}/${randomUUID()}`,
      kind: 'changed',
      locale,
    });
  } catch {
    recordAuthSecurityEvent(
      'auth.password_recovery.changed_notification_failed',
      { userId },
    );
  }
}
