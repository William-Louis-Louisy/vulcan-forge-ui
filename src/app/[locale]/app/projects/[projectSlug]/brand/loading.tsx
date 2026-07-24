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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="bg-background-subtle h-3 w-28 animate-pulse rounded" />
            <div className="bg-background-subtle mt-3 h-8 w-52 animate-pulse rounded" />
            <div className="bg-background-subtle mt-3 h-4 w-full max-w-xl animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-background-subtle h-6 w-24 animate-pulse rounded" />
            <div className="bg-background-subtle h-9 w-28 animate-pulse rounded-md" />
          </div>
        </div>
      </div>

      <div className="border-border-subtle flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 xl:px-7">
        <div className="flex items-center gap-3">
          <div className="bg-background-subtle h-3 w-24 animate-pulse rounded" />
          <div className="bg-background-subtle h-8 w-24 animate-pulse rounded-md" />
        </div>
        <div className="bg-background-subtle h-3 w-32 animate-pulse rounded" />
      </div>

      <div className="min-h-0 flex-1 xl:overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 xl:px-7">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="border-border-subtle grid gap-5 border-b py-6 last:border-b-0 md:py-7 lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] lg:gap-10"
            >
              <div>
                <div className="bg-background-subtle h-5 w-40 animate-pulse rounded" />
                <div className="bg-background-subtle mt-3 h-4 w-full max-w-56 animate-pulse rounded" />
              </div>
              <div className="grid gap-4">
                <div className="bg-background-subtle h-10 w-full animate-pulse rounded-md" />
                <div className="bg-background-subtle h-24 w-full animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
