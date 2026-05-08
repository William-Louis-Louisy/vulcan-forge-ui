import { appConfig } from "@/config/app";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center px-6 py-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-foreground/60">
          Design System Studio
        </p>

        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">
          {appConfig.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          {appConfig.description}
        </p>
      </section>
    </main>
  );
}
