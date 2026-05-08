import { appConfig } from '@/config/app';

export default function HomePage() {
  return (
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center">
        <p className="text-content-tertiary text-sm font-semibold tracking-[0.24em] uppercase">
          Design System Studio
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          {appConfig.name}
        </h1>

        <p className="text-content-secondary mt-6 max-w-2xl text-lg leading-8">
          {appConfig.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover rounded-lg px-5 py-3 text-sm font-semibold transition"
          >
            Create a design system
          </a>

          <a
            href="#"
            className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary rounded-lg border px-5 py-3 text-sm font-semibold transition"
          >
            View example
          </a>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {['Tokens', 'Accessibility', 'AI-ready docs'].map((item) => (
            <article
              key={item}
              className="border-border-subtle bg-surface-primary shadow-soft rounded-2xl border p-5"
            >
              <h2 className="text-content-primary text-base font-semibold">
                {item}
              </h2>
              <p className="text-content-secondary mt-2 text-sm leading-6">
                A clean foundation for accessible, bilingual and exportable
                product interfaces.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
