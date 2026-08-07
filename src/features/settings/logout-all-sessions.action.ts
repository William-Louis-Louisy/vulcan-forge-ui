'use server';

import { auth, signOut } from '@/auth';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import { revokeAllAuthSessions } from '@/server/auth/session-version';
import {
  initialLogoutAllSessionsActionState,
  type LogoutAllSessionsActionState,
} from './session-security.state';

export async function logoutAllSessionsAction(
  _previousState: LogoutAllSessionsActionState,
): Promise<LogoutAllSessionsActionState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    await signOut({ redirectTo: '/' });
    return initialLogoutAllSessionsActionState;
  }

  let revoked = false;

  try {
    revoked = await revokeAllAuthSessions({ userId });
  } catch {
    recordAuthSecurityEvent('auth.session.revocation_failed', {
      reason: 'persistence_unavailable',
      userId,
    });

    return {
      formError: 'revocationFailed',
    };
  }

  if (!revoked) {
    recordAuthSecurityEvent('auth.session.revocation_failed', {
      reason: 'account_missing',
      userId,
    });

    return {
      formError: 'revocationFailed',
    };
  }

  recordAuthSecurityEvent('auth.session.revoked_all', {
    userId,
  });

  await signOut({ redirectTo: '/' });

  return initialLogoutAllSessionsActionState;
}
