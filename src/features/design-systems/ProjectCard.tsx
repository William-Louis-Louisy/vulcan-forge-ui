import { Badge, Card } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import type { DesignSystemListItem } from './design-systems.queries';
import { createProjectCardSwatches } from './project-card-swatches.utils';

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
  const swatches = createProjectCardSwatches({
    tokenSets: project.tokenSets,
    themes: project.themes,
  });

  return (
    <Card
      padding="sm"
      className="group transition hover:shadow-md sm:min-h-55 sm:p-5 lg:p-6"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {project.name}
            </h2>

            <p className="text-content-tertiary mt-1.5 text-xs sm:mt-2 sm:text-sm">
              {labels.slug(project.slug)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 sm:mt-4">
          {swatches.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="border-border-subtle h-6 flex-1 rounded-md border sm:h-7"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <p className="text-content-secondary mt-4 text-sm leading-5 sm:mt-5 sm:min-h-12 sm:leading-6">
          {project.description ?? labels.noDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
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

        <div className="border-border-subtle mt-4 flex items-center justify-between gap-4 border-t pt-3 sm:mt-1 sm:pt-4">
          <p className="text-content-tertiary min-w-0 text-xs leading-5">
            {labels.updatedAt(updatedAtLabel)}
          </p>

          <AppLink
            href={`/app/projects/${project.slug}`}
            className="text-action-accent group-hover:text-action-accent-hover inline-flex shrink-0 items-center gap-1 text-sm font-semibold transition"
          >
            {labels.open}
            <ArrowUpRightIcon size={13} weight="bold" />
          </AppLink>
        </div>
      </div>
    </Card>
  );
}
