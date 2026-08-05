export class EmailVerificationConfigurationError extends Error {
  constructor() {
    super('Email verification delivery is not configured.');
    this.name = 'EmailVerificationConfigurationError';
  }
}

export class EmailVerificationDeliveryError extends Error {
  constructor() {
    super('Email verification delivery failed.');
    this.name = 'EmailVerificationDeliveryError';
  }
}
