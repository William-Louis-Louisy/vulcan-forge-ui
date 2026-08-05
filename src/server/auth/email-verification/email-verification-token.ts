import { createHash, randomBytes } from 'node:crypto';
import {
  EMAIL_VERIFICATION_TOKEN_BYTES,
  EMAIL_VERIFICATION_TOKEN_MAX_LENGTH,
} from './email-verification.constants';

const EMAIL_VERIFICATION_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;

export function hashEmailVerificationToken(token: string) {
  if (
    !token.length ||
    token.length > EMAIL_VERIFICATION_TOKEN_MAX_LENGTH ||
    !EMAIL_VERIFICATION_TOKEN_PATTERN.test(token)
  ) {
    return null;
  }

  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function createEmailVerificationToken() {
  const token = randomBytes(EMAIL_VERIFICATION_TOKEN_BYTES).toString('base64url');
  const tokenHash = hashEmailVerificationToken(token);

  if (!tokenHash) {
    throw new Error('Generated email verification token is invalid.');
  }

  return {
    token,
    tokenHash,
  };
}
