import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { AppLink } from '@/components/navigation/AppLink';
import { getDashboardSummary } from '@/features/dashboard/dashboard.queries';
import { getDisplayNameFromEmail } from '@/features/dashboard/dashboard.utils';

const quickActionKeys = ['create', 'tokens', 'accessibility'] as const;

export default async function AppPage() {
  const session = await auth();
  const t = await getTranslations('DashboardPage');

  const userId = session?.user?.id;
  const userEmail = session?.user?.email ?? null;

  const summary = userId
    ? await getDashboardSummary(userId)
    : {
        workspaceName: null,
        workspaceSlug: null,
        workspaceCount: 0,
        role: null,
      };

  const displayName =
    session?.user?.name ??
    getDisplayNameFromEmail(userEmail) ??
    t('fallbackName');

  return (
    <div className="mx-auto max-w-6xl">
      <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-8">
        <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              {t('title', { name: displayName })}
            </h1>

            <p className="text-content-secondary mt-4 max-w-2xl leading-7">
              {t('description')}
            </p>
          </div>

          <AppLink
            href="/app/projects/new"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex justify-center rounded-lg px-5 py-3 text-sm font-semibold transition"
          >
            {t('primaryCta')}
          </AppLink>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label={t('stats.workspace.label')}
          value={summary.workspaceName ?? t('stats.workspace.empty')}
          description={t('stats.workspace.description')}
        />

        <DashboardStatCard
          label={t('stats.projects.label')}
          value="0"
          description={t('stats.projects.description')}
        />

        <DashboardStatCard
          label={t('stats.exports.label')}
          value="0"
          description={t('stats.exports.description')}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('emptyState.title')}
          </h2>

          <p className="text-content-secondary mt-4 leading-7">
            {t('emptyState.description')}
          </p>

          <div className="border-border-default bg-background-subtle mt-8 rounded-2xl border border-dashed p-8 text-center">
            <p className="text-content-primary text-sm font-semibold">
              {t('emptyState.cardTitle')}
            </p>

            <p className="text-content-secondary mx-auto mt-3 max-w-md text-sm leading-6">
              {t('emptyState.cardDescription')}
            </p>

            <AppLink
              href="/app/projects/new"
              className="bg-action-primary text-action-primary-content hover:bg-action-primary-hover mt-6 inline-flex rounded-lg px-5 py-3 text-sm font-semibold transition"
            >
              {t('emptyState.cta')}
            </AppLink>
          </div>
        </div>

        <aside className="border-border-subtle bg-background-subtle rounded-3xl border p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('quickActions.title')}
          </h2>

          <div className="mt-6 space-y-3">
            {quickActionKeys.map((key) => (
              <div
                key={key}
                className="border-border-subtle bg-surface-primary rounded-2xl border p-5"
              >
                <p className="font-semibold">
                  {t(`quickActions.items.${key}.title`)}
                </p>
                <p className="text-content-secondary mt-2 text-sm leading-6">
                  {t(`quickActions.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function DashboardStatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary shadow-soft rounded-2xl border p-6">
      <p className="text-content-tertiary text-sm font-medium">{label}</p>
      <p className="mt-3 truncate text-2xl font-semibold">{value}</p>
      <p className="text-content-secondary mt-2 text-sm leading-6">
        {description}
      </p>
    </article>
  );
}
