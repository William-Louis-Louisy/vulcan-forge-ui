import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ProductEditorPreview } from './ProductEditorPreview';

type AuthShellProps = {
  benefits: string[];
  benefitsTitle: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  variant: 'login' | 'signup';
};

export function AuthShell({
  benefits,
  benefitsTitle,
  children,
  description,
  eyebrow,
  title,
  variant,
}: AuthShellProps) {
  const t = useTranslations('AuthShell');

  return (
    <main className="bg-background-app text-content-primary min-h-[calc(100vh-3.5rem)]">
      <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
          <div className="w-full max-w-md">
            <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-[1.06] font-semibold tracking-[-0.04em] sm:text-5xl">
              {title}
            </h1>
            <p className="text-content-secondary mt-5 leading-7">
              {description}
            </p>
            {children}
          </div>
        </section>

        <aside
          className={[
            'border-border-subtle hidden border-l px-10 py-14 lg:flex lg:items-center lg:justify-center xl:px-16',
            variant === 'signup'
              ? 'bg-action-secondary text-content-inverse'
              : 'bg-background-sunken',
          ].join(' ')}
        >
          <div className="w-full max-w-xl">
            {variant === 'login' ? (
              <ProductEditorPreview
                labels={{
                  accessibility: t('preview.navigation.accessibility'),
                  brand: t('preview.navigation.brand'),
                  delivered: t('preview.delivered'),
                  export: t('preview.export'),
                  overview: t('preview.navigation.overview'),
                  preview: t('preview.label'),
                  project: t('preview.project'),
                  themes: t('preview.navigation.themes'),
                  tokens: t('preview.navigation.tokens'),
                }}
              />
            ) : (
              <div>
                <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                  {t('signup.eyebrow')}
                </p>
                <h2 className="mt-4 max-w-lg font-[family-name:var(--font-fraunces)] text-4xl leading-tight font-semibold tracking-[-0.035em]">
                  {benefitsTitle}
                </h2>
                <ul className="border-content-inverse/15 mt-10 divide-y divide-white/10 border-y">
                  {benefits.map((benefit, index) => (
                    <li
                      key={benefit}
                      className="grid grid-cols-[2.5rem_1fr] gap-4 py-5"
                    >
                      <span className="text-action-accent font-mono text-xs">
                        0{index + 1}
                      </span>
                      <span className="text-content-inverse/75 text-sm leading-6">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
