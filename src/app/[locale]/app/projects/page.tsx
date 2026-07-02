import {
  PlusIcon,
  UsersIcon,
  GearSixIcon,
  CaretRightIcon,
  GlobeHemisphereWestIcon,
} from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import { AppLink } from '@/components/navigation/AppLink';
import { formatRelativeUpdatedDate } from '@/features/design-systems/design-systems.utils';
import { getDesignSystemsPageData } from '@/features/design-systems/design-systems.queries';

export default async function DesignSystemsPage() {
  const session = await auth();
  const t = await getTranslations('DesignSystemsPage');

  const pageData = session?.user?.id
    ? await getDesignSystemsPageData(session.user.id)
    : {
        workspace: null,
        designSystems: [],
      };

  const workspace = pageData.workspace;
  const workspaceName = workspace?.name ?? t('workspace.empty');
  const defaultLocale = workspace?.defaultLocale ?? 'en';
  const supportedLocales = workspace?.supportedLocales ?? ['en', 'fr'];
  const members = workspace?.members ?? [];
  const projectCount = pageData.designSystems.length;

  const roleLabels = {
    owner: t('roles.owner'),
    admin: t('roles.admin'),
    editor: t('roles.editor'),
    viewer: t('roles.viewer'),
  };

  return (
    <section>
      <header className="border-border-subtle flex flex-col gap-6 border-b px-10 pt-8 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
            {t('workspace.eyebrow')}
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.015em]">
            {workspaceName}
          </h1>

          <div className="text-content-secondary mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <GlobeHemisphereWestIcon aria-hidden="true" size={13} />
              {t('workspace.defaultLocale')}{' '}
              <strong className="text-content-primary font-semibold">
                {formatLocale(defaultLocale)}
              </strong>
            </span>

            <span className="text-content-tertiary">·</span>

            <span>
              {t('workspace.locales')}{' '}
              <strong className="text-content-primary font-mono text-xs font-semibold">
                {formatLocaleList(supportedLocales)}
              </strong>
            </span>

            <span className="text-content-tertiary">·</span>

            <span className="inline-flex items-center gap-1.5">
              <UsersIcon aria-hidden="true" size={13} />
              {t('workspace.memberCount', {
                count: workspace?.memberCount ?? 0,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AppLink
            href="/app/settings"
            className="border-border-default bg-surface-primary text-content-secondary hover:bg-background-subtle inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-semibold transition"
          >
            <GearSixIcon aria-hidden="true" size={13} />
            {t('actions.workspaceSettings')}
          </AppLink>

          <AppLink
            href="/app/projects/new"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition"
          >
            <PlusIcon aria-hidden="true" size={13} weight="bold" />
            {t('actions.newProject')}
          </AppLink>
        </div>
      </header>

      <div className="grid gap-6 px-10 py-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              {t('projects.title')}
            </h2>

            <span className="text-content-tertiary font-mono text-[11px]">
              {projectCount}
            </span>

            {/* <div className="text-content-tertiary ml-auto hidden items-center gap-2 text-sm md:inline-flex">
              <MagnifyingGlassIcon aria-hidden="true" size={13} />
              {t('projects.searchPlaceholder')}
            </div> */}
          </div>

          <div className="border-border-subtle bg-surface-primary shadow-soft overflow-hidden rounded-md border">
            {pageData.designSystems.length > 0 ? (
              pageData.designSystems.map((designSystem, index) => (
                <AppLink
                  key={designSystem.id}
                  href={`/app/projects/${designSystem.slug}/tokens`}
                  className={[
                    'hover:bg-background-subtle grid items-center gap-3 px-4 py-3 transition lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1.25fr)_110px_80px_110px_24px]',
                    index < pageData.designSystems.length - 1
                      ? 'border-border-subtle border-b'
                      : '',
                  ].join(' ')}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {designSystem.name}
                    </p>
                    <p className="text-content-tertiary mt-0.5 truncate font-mono text-[11px]">
                      /{designSystem.slug}
                    </p>
                  </div>

                  <p className="text-content-secondary truncate text-sm">
                    {designSystem.description ?? t('card.noDescription')}
                  </p>

                  <p className="text-content-tertiary truncate text-xs font-medium">
                    {designSystem.platforms
                      .map(formatPlatformLabel)
                      .join(' · ')}
                  </p>

                  <p className="text-content-secondary truncate font-mono text-[11px]">
                    {formatLocaleList(designSystem.supportedLocales)}
                  </p>

                  <p className="text-content-tertiary truncate text-right text-xs">
                    {formatRelativeUpdatedDate(designSystem.updatedAt)}
                  </p>

                  <CaretRightIcon
                    aria-hidden="true"
                    size={13}
                    className="text-content-tertiary justify-self-end"
                  />
                </AppLink>
              ))
            ) : (
              <div className="p-8 text-center">
                <h2 className="text-xl font-semibold tracking-tight">
                  {t('emptyState.title')}
                </h2>
                <p className="text-content-secondary mx-auto mt-3 max-w-xl text-sm leading-6">
                  {t('emptyState.description')}
                </p>
                <AppLink
                  href="/app/projects/new"
                  className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover mt-6 inline-flex min-h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold transition"
                >
                  {t('emptyState.cta')}
                </AppLink>
              </div>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="border-border-subtle bg-surface-primary shadow-soft rounded-md border p-4">
            <h2 className="text-base font-semibold tracking-tight">
              {t('atGlance.title')}
            </h2>

            <div className="mt-3">
              <WorkspaceStat
                label={t('atGlance.projects')}
                value={String(projectCount)}
              />
              <WorkspaceStat
                label={t('atGlance.members')}
                value={String(workspace?.memberCount ?? 0)}
              />
              <WorkspaceStat
                label={t('atGlance.defaultLocale')}
                value={formatLocale(defaultLocale)}
              />
              <WorkspaceStat
                label={t('atGlance.locales')}
                value={String(supportedLocales.length)}
              />
            </div>
          </section>

          <section className="border-border-subtle bg-surface-primary shadow-soft rounded-md border p-4">
            <h2 className="text-base font-semibold tracking-tight">
              {t('members.title')}
            </h2>

            {members.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                {members.slice(0, 4).map((member) => (
                  <div key={member.id} className="flex items-center gap-2.5">
                    <span className="bg-background-sunken text-content-secondary flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
                      {getMemberInitials(member.name, member.email)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.name ?? member.email}
                      </p>
                    </div>

                    <span className="text-content-tertiary text-xs font-medium">
                      {roleLabels[member.role as keyof typeof roleLabels] ??
                        member.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-content-secondary mt-3 text-sm">
                {t('members.empty')}
              </p>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}

function WorkspaceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle flex items-baseline justify-between border-b py-2 last:border-b-0">
      <span className="text-content-secondary text-sm">{label}</span>
      <span className="text-content-primary text-base font-semibold">
        {value}
      </span>
    </div>
  );
}

function formatLocale(locale: string) {
  return locale.toUpperCase();
}

function formatLocaleList(locales: string[]) {
  return locales.map(formatLocale).join(', ');
}

function formatPlatformLabel(platform: string) {
  if (platform === 'web') {
    return 'Web';
  }

  if (platform === 'mobile') {
    return 'Mobile';
  }

  return platform;
}

function getMemberInitials(name: string | null, email: string) {
  const source = name ?? email.split('@')[0] ?? '';

  const initials = source
    .split(/[.\s_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'U';
}
