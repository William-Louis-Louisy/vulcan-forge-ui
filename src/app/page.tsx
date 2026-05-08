import { appConfig } from "@/config/app";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background-app px-6 py-16 text-content-primary">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-content-tertiary">
          Design System Studio
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          {appConfig.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-content-secondary">
          {appConfig.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#"
            className="rounded-lg bg-action-primary px-5 py-3 text-sm font-semibold text-action-primary-content shadow-soft transition hover:bg-action-primary-hover"
          >
            Create a design system
          </a>

          <a
            href="#"
            className="rounded-lg border border-border-default bg-surface-primary px-5 py-3 text-sm font-semibold text-content-primary transition hover:bg-surface-secondary"
          >
            View example
          </a>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {["Tokens", "Accessibility", "AI-ready docs"].map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-border-subtle bg-surface-primary p-5 shadow-soft"
            >
              <h2 className="text-base font-semibold text-content-primary">
                {item}
              </h2>
              <p className="mt-2 text-sm leading-6 text-content-secondary">
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
