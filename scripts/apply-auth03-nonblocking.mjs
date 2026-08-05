import fs from 'node:fs';

const localizedUpdates = {
  en: {
    banner: {
      title: 'Verify your email address',
      description:
        'Verification strengthens account recovery and future collaboration features. You can keep using your workspace.',
      resend: 'Resend email',
      resending: 'Sending...',
    },
    confirm: {
      title: 'Confirm your email address',
      description:
        'Use the button below to confirm this address. Opening the email link alone does not change your account.',
    },
    pendingDescription:
      'Check your inbox for a verification link. You can continue using your workspace while verification is pending.',
    actions: {
      confirm: 'Confirm email address',
      continueWithoutVerification: 'Continue to workspace',
    },
  },
  fr: {
    banner: {
      title: 'Vérifiez votre adresse e-mail',
      description:
        'La vérification renforce la récupération du compte et les futures fonctions collaboratives. Vous pouvez continuer à utiliser votre espace.',
      resend: 'Renvoyer l’e-mail',
      resending: 'Envoi...',
    },
    confirm: {
      title: 'Confirmez votre adresse e-mail',
      description:
        'Utilisez le bouton ci-dessous pour confirmer cette adresse. L’ouverture du lien seule ne modifie pas votre compte.',
    },
    pendingDescription:
      'Consultez votre boîte de réception pour trouver le lien de vérification. Vous pouvez continuer à utiliser votre espace pendant ce temps.',
    actions: {
      confirm: 'Confirmer mon adresse e-mail',
      continueWithoutVerification: 'Continuer vers mon espace',
    },
  },
};

for (const [locale, update] of Object.entries(localizedUpdates)) {
  const path = `src/messages/${locale}.json`;
  const messages = JSON.parse(fs.readFileSync(path, 'utf8'));

  if (!messages.AppShell || !messages.EmailVerificationPage) {
    throw new Error(`Missing email verification message namespaces for ${locale}.`);
  }

  messages.AppShell.emailVerification = update.banner;
  messages.EmailVerificationPage.states.confirm = update.confirm;
  messages.EmailVerificationPage.states.pending.description =
    update.pendingDescription;
  Object.assign(messages.EmailVerificationPage.actions, update.actions);

  fs.writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`);
}

const signupActionPath = 'src/features/auth/signup/signup.action.ts';
let signupAction = fs.readFileSync(signupActionPath, 'utf8');
const previousDeliveryBlock = `  let deliveryStatus: 'deliveryUnavailable' | 'rateLimited' | 'sent' =
    'deliveryUnavailable';

  try {
    const delivery = await sendEmailVerificationChallenge({
      email: parsed.data.email,
      headers: requestHeaders,
      locale,
      userId,
    });
    deliveryStatus = delivery.status;
  } catch {
    recordAuthSecurityEvent('auth.signup.unexpected_error', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      reason: 'verification_delivery',
      requestId: rateLimit.context.requestId,
      userId,
    });
  }
`;
const nextDeliveryBlock = `  try {
    await sendEmailVerificationChallenge({
      email: parsed.data.email,
      headers: requestHeaders,
      locale,
      userId,
    });
  } catch {
    recordAuthSecurityEvent('auth.signup.unexpected_error', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      reason: 'verification_delivery',
      requestId: rateLimit.context.requestId,
      userId,
    });
  }
`;

if (!signupAction.includes(previousDeliveryBlock)) {
  throw new Error('Unable to locate the signup verification delivery block.');
}

signupAction = signupAction
  .replace(previousDeliveryBlock, nextDeliveryBlock)
  .replace(
    'redirectTo: `/${locale}/verify-email?delivery=${deliveryStatus}`',
    'redirectTo: `/${locale}/app`',
  );

if (signupAction.includes('deliveryStatus')) {
  throw new Error('The obsolete signup delivery status remains in the action.');
}

fs.writeFileSync(signupActionPath, signupAction);

const signupTestPath = 'src/features/auth/signup/signup.action.test.ts';
let signupTest = fs.readFileSync(signupTestPath, 'utf8');
const replacements = [
  [
    'sends a verification challenge and redirects to the pending state',
    'sends a verification challenge and redirects to the workspace',
  ],
  ["redirectTo: '/en/verify-email?delivery=sent'", "redirectTo: '/en/app'"],
  [
    "redirectTo: '/en/verify-email?delivery=deliveryUnavailable'",
    "redirectTo: '/en/app'",
  ],
];

for (const [before, after] of replacements) {
  if (!signupTest.includes(before)) {
    throw new Error(`Unable to locate expected signup test text: ${before}`);
  }

  signupTest = signupTest.replace(before, after);
}

fs.writeFileSync(signupTestPath, signupTest);
