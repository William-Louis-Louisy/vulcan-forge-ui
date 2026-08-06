import { createHash, randomBytes } from 'node:crypto';
import {
  PASSWORD_RECOVERY_TOKEN_BYTES,
  PASSWORD_RECOVERY_TOKEN_MAX_LENGTH,
} from './password-recovery.constants';

export function createPasswordRecoveryToken() {
  const token = randomBytes(PASSWORD_RECOVERY_TOKEN_BYTES).toString(
    'base64url',
  );

  return {
    token,
    tokenHash: hashPasswordRecoveryToken(token) as string,
  };
}

export function hashPasswordRecoveryToken(token: string) {
  if (
    typeof token !== 'string' ||
    token.length === 0 ||
    token.length > PASSWORD_RECOVERY_TOKEN_MAX_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(token)
  ) {
    return null;
  }

  return createHash('sha256').update(token, 'utf8').digest('hex');
}
