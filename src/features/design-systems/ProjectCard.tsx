import { Badge, Card } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import type { DesignSystemListItem } from './design-systems.queries';

type ProjectCardLabels = {
  noDescription: string;
  open: string;
  slug: (slug: string) => string;
  updatedAt: (date: string) => string;
};

type ProjectCardProps = {
  project: DesignSystemListItem;
  updatedAtLabel: string;
  labels: ProjectCardLabels;
};

function formatPlatformLabel(platform: string) {
  if (platform === 'web') {
    return 'Web';
  }

  if (platform === 'mobile') {
    return 'Mobile';
  }

  return platform;
}

function formatLocaleLabel(locale: string) {
  return locale.toUpperCase();
}

export function ProjectCard({
  project,
  updatedAtLabel,
  labels,
}: ProjectCardProps) {
  return (
    <Card
      padding="lg"
      className="group hover:shadow-elevated min-h-55 transition hover:-translate-y-0.5"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight">
              {project.name}
            </h2>

            <p className="text-content-tertiary mt-2 text-sm">
              {labels.slug(project.slug)}
            </p>
          </div>
        </div>

        <p className="text-content-secondary mt-5 min-h-12 text-sm leading-6">
          {project.description ?? labels.noDescription}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.platforms.map((platform) => (
            <Badge key={platform} variant="accent" size="sm">
              {formatPlatformLabel(platform)}
            </Badge>
          ))}

          {project.supportedLocales.map((locale) => (
            <Badge key={locale} variant="default" size="sm">
              {formatLocaleLabel(locale)}
            </Badge>
          ))}
        </div>

        <div className="border-border-subtle mt-1 flex items-center justify-between gap-4 border-t pt-4">
          <p className="text-content-tertiary text-xs">
            {labels.updatedAt(updatedAtLabel)}
          </p>

          <AppLink
            href={`/app/projects/${project.slug}/tokens`}
            className="text-action-accent group-hover:text-action-accent-hover inline-flex items-center gap-1 text-sm font-semibold transition"
          >
            {labels.open}
            <ArrowUpRightIcon size={13} weight="bold" />
          </AppLink>
        </div>
      </div>
    </Card>
  );
}
