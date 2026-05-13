import type { ReactNode } from 'react';

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  benefitsTitle: string;
  benefits: string[];
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
  benefitsTitle,
  benefits,
}: AuthShellProps) {
  return (
    <main className="bg-background-app text-content-primary min-h-[calc(100vh-4rem)]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl lg:grid-cols-2">
        <section className="flex items-center px-6 py-16 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              {title}
            </h1>

            <p className="text-content-secondary mt-4 leading-7">
              {description}
            </p>

            {children}
          </div>
        </section>

        <aside className="border-border-subtle bg-background-subtle hidden border-l px-12 py-16 lg:flex lg:flex-col lg:justify-center">
          <div className="border-border-subtle bg-surface-primary shadow-elevated rounded-3xl border p-8">
            <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
              {benefitsTitle}
            </p>

            <ul className="mt-8 space-y-5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <span className="text-action-success mt-1">✓</span>
                  <span className="text-content-secondary text-sm leading-6">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
