import { CredentialsSignin } from '@auth/core/errors';

export class RateLimitedCredentialsError extends CredentialsSignin {
  code = 'rate_limited';
}

export class AuthRateLimitUnavailableError extends Error {
  constructor() {
    super('Authentication rate limit service is unavailable.');
    this.name = 'AuthRateLimitUnavailableError';
  }
}
