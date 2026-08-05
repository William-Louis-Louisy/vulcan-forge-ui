export type ResendEmailVerificationActionState = {
  status:
    | 'alreadyVerified'
    | 'deliveryUnavailable'
    | 'idle'
    | 'rateLimited'
    | 'sent'
    | 'unauthorized'
    | 'unexpected';
};

export const initialResendEmailVerificationActionState: ResendEmailVerificationActionState = {
  status: 'idle',
};
