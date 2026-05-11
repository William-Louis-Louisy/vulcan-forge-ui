import { auth } from '@/auth';

export default async function AppPage() {
  const session = await auth();

  return (
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">App</h1>
        <p className="text-content-secondary mt-4">
          Signed in as {session?.user?.email ?? 'anonymous'}.
        </p>
      </section>
    </main>
  );
}
