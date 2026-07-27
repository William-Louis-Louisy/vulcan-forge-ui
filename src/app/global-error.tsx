'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { PublicBrandLockup } from '@/components/layout/PublicBrandLockup';

const copy = {
  en: {
    code: '500',
    eyebrow: 'Application error',
    title: 'VulcanForge UI could not start correctly.',
    description:
      'The application could not recover its main interface. Retry the request or return to the public home page.',
    retry: 'Try again',
    home: 'Back to home',
    reference: 'Diagnostic reference',
  },
  fr: {
    code: '500',
    eyebrow: 'Erreur de l’application',
    title: 'VulcanForge UI n’a pas pu démarrer correctement.',
    description:
      'L’application n’a pas pu restaurer son interface principale. Réessayez la requête ou revenez à l’accueil public.',
    retry: 'Réessayer',
    home: 'Retour à l’accueil',
    reference: 'Référence de diagnostic',
  },
} as const;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<keyof typeof copy>('en');

  useEffect(() => {
    console.error(error);
    setLocale(document.documentElement.lang.toLowerCase().startsWith('fr') ? 'fr' : 'en');
  }, [error]);

  const labels = copy[locale];

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <main className="bg-background-app text-content-primary min-h-screen px-6 py-10 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <a href={`/${locale}`} className="inline-flex">
              <PublicBrandLockup />
            </a>

            <section className="border-border-subtle bg-surface-primary mt-10 overflow-hidden rounded-xl border p-7 sm:p-10 lg:p-12">
              <p className="text-action-danger text-xs font-semibold tracking-[0.18em] uppercase">
                {labels.eyebrow} · {labels.code}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
                {labels.title}
              </h1>
              <p className="text-content-secondary mt-5 max-w-xl text-sm leading-7 sm:text-base">
                {labels.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="border-action-primary bg-action-primary text-action-primary-content hover:bg-action-primary-hover inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition"
                >
                  {labels.retry}
                </button>
                <a
                  href={`/${locale}`}
                  className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition"
                >
                  {labels.home}
                </a>
              </div>

              {error.digest ? (
                <p className="text-content-tertiary border-border-subtle mt-8 border-t pt-4 font-mono text-xs">
                  {labels.reference}: {error.digest}
                </p>
              ) : null}
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
