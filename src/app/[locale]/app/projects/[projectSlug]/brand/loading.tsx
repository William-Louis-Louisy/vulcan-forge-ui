import { getTranslations } from 'next-intl/server';

export default async function BrandProfileLoading() {
  const t = await getTranslations('Common');

  return (
    <section
      role="status"
      aria-label={t('states.loading')}
      className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden"
    >
      <div className="border-border-subtle border-b px-4 py-5 sm:px-6 xl:px-7">
        <div className="bg-background-subtle h-3 w-28 animate-pulse rounded" />
        <div className="bg-background-subtle mt-3 h-8 w-52 animate-pulse rounded" />
        <div className="bg-background-subtle mt-3 h-4 w-full max-w-xl animate-pulse rounded" />
      </div>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="grid gap-5 p-4 sm:p-6 xl:p-7">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="border-border-subtle bg-surface-primary rounded-lg border p-5"
            >
              <div className="bg-background-subtle h-5 w-40 animate-pulse rounded" />
              <div className="bg-background-subtle mt-3 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-background-subtle mt-6 h-28 animate-pulse rounded" />
            </div>
          ))}
        </div>

        <aside className="border-border-subtle bg-background-sunken hidden border-l p-5 xl:block">
          <div className="bg-background-subtle h-64 animate-pulse rounded-lg" />
          <div className="bg-background-subtle mt-4 h-44 animate-pulse rounded-lg" />
        </aside>
      </div>
    </section>
  );
}
