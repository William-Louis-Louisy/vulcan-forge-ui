'use server';

import { auth, signOut } from '@/auth';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';

export async function logoutAction() {
  const session = await auth();

  if (session?.user?.id) {
    recordAuthSecurityEvent('auth.logout.succeeded', {
      userId: session.user.id,
    });
  }

  await signOut({
    redirectTo: '/',
  });
}
