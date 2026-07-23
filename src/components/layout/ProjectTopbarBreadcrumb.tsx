'use client';

import {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
} from 'react';
import { CheckIcon, FolderIcon, CaretDownIcon } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import { Link, usePathname } from '@/i18n/navigation';
import { projectEditorNavItems } from '@/features/design-systems/project-editor/project-editor-nav.config';
import {
  createProjectSwitchHref,
  getProjectSwitchDestination,
} from './project-switcher.utils';

export type ProjectSaveStatus = 'saved' | 'unsaved' | 'saving' | 'error';

export type ProjectSwitcherProject = {
  name: string;
  slug: string;
};

type RegisteredProject = ProjectSwitcherProject & {
  registrationId: symbol;
};

type ProjectTopbarContextValue = {
  project: RegisteredProject | null;
  projects: ProjectSwitcherProject[];
  saveStatus: ProjectSaveStatus;
  registerProject: (project: ProjectSwitcherProject) => () => void;
  reportSaveStatus: (sourceId: string, status: ProjectSaveStatus) => void;
  clearSaveStatus: (sourceId: string) => void;
};

const ProjectTopbarContext = createContext<ProjectTopbarContextValue | null>(
  null,
);

type ProjectTopbarProviderProps = {
  children: ReactNode;
  projects: ProjectSwitcherProject[];
};

export function ProjectTopbarBreadcrumbProvider({
  children,
  projects,
}: ProjectTopbarProviderProps) {
  const [project, setProject] = useState<RegisteredProject | null>(null);

  const [saveSources, setSaveSources] = useState<
    ReadonlyMap<string, ProjectSaveStatus>
  >(() => new Map());

  const registerProject = useCallback(
    ({ name, slug }: ProjectSwitcherProject) => {
      const registrationId = Symbol('project-topbar');

      setProject({
        registrationId,
        name,
        slug,
      });

      return () => {
        setProject((currentProject) =>
          currentProject?.registrationId === registrationId
            ? null
            : currentProject,
        );
      };
    },
    [],
  );

  const reportSaveStatus = useCallback(
    (sourceId: string, status: ProjectSaveStatus) => {
      setSaveSources((currentSources) => {
        if (currentSources.get(sourceId) === status) {
          return currentSources;
        }

        const nextSources = new Map(currentSources);
        nextSources.set(sourceId, status);

        return nextSources;
      });
    },
    [],
  );

  const clearSaveStatus = useCallback((sourceId: string) => {
    setSaveSources((currentSources) => {
      if (!currentSources.has(sourceId)) {
        return currentSources;
      }

      const nextSources = new Map(currentSources);
      nextSources.delete(sourceId);

      return nextSources;
    });
  }, []);

  const saveStatus = useMemo(
    () => getAggregatedSaveStatus(saveSources),
    [saveSources],
  );

  const value = useMemo(
    () => ({
      project,
      projects,
      saveStatus,
      registerProject,
      reportSaveStatus,
      clearSaveStatus,
    }),
    [
      clearSaveStatus,
      project,
      projects,
      registerProject,
      reportSaveStatus,
      saveStatus,
    ],
  );

  return (
    <ProjectTopbarContext.Provider value={value}>
      {children}
    </ProjectTopbarContext.Provider>
  );
}

type ProjectRegistrationProps = {
  projectName: string;
  projectSlug: string;
};

export function ProjectTopbarBreadcrumbRegistration({
  projectName,
  projectSlug,
}: ProjectRegistrationProps) {
  const context = useContext(ProjectTopbarContext);
  const registerProject = context?.registerProject;

  useEffect(() => {
    if (!registerProject) {
      return;
    }

    return registerProject({
      name: projectName,
      slug: projectSlug,
    });
  }, [projectName, projectSlug, registerProject]);

  return null;
}

export function useProjectSaveStatus(
  sourceId: string,
  status: ProjectSaveStatus,
) {
  const context = useContext(ProjectTopbarContext);
  const reportSaveStatus = context?.reportSaveStatus;
  const clearSaveStatus = context?.clearSaveStatus;

  useEffect(() => {
    reportSaveStatus?.(sourceId, status);
  }, [reportSaveStatus, sourceId, status]);

  useEffect(
    () => () => {
      clearSaveStatus?.(sourceId);
    },
    [clearSaveStatus, sourceId],
  );
}

export type ProjectTopbarBreadcrumbLabels = {
  ariaLabel: string;
  allProjects: string;
  saveStatus: Record<ProjectSaveStatus, string>;
};

type ProjectTopbarBreadcrumbTrailProps = {
  labels: ProjectTopbarBreadcrumbLabels;
};

export function ProjectTopbarBreadcrumbTrail({
  labels,
}: ProjectTopbarBreadcrumbTrailProps) {
  const context = useContext(ProjectTopbarContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectT = useTranslations('ProjectEditorNav');

  const project = context?.project;

  if (!project) {
    return null;
  }

  const baseHref = `/app/projects/${project.slug}`;

  const currentItem = projectEditorNavItems.find((item) => {
    const path = item.path.split('?')[0] ?? '';
    const href = path ? `${baseHref}/${path}` : baseHref;

    return path
      ? pathname === href || pathname.startsWith(`${href}/`)
      : pathname === href;
  });

  const currentLabel = currentItem ? projectT(currentItem.key) : null;
  const destination = getProjectSwitchDestination({
    pathname,
    currentProjectSlug: project.slug,
    tokenSet: searchParams.get('set'),
  });

  return (
    <nav
      aria-label={labels.ariaLabel}
      className="hidden min-w-0 items-center gap-2 lg:flex"
    >
      <BreadcrumbSeparator />

      <ProjectSwitcher
        currentProject={project}
        projects={context?.projects ?? []}
        destination={destination}
        allProjectsLabel={labels.allProjects}
      />

      {currentLabel ? (
        <>
          <BreadcrumbSeparator />

          <span
            aria-current="page"
            className="text-content-primary shrink-0 text-sm font-medium"
          >
            {currentLabel}
          </span>
        </>
      ) : null}

      <ProjectSaveStatusIndicator
        status={context?.saveStatus ?? 'saved'}
        label={labels.saveStatus[context?.saveStatus ?? 'saved']}
      />
    </nav>
  );
}

export function ProjectTopbarExportAction({ label }: { label: string }) {
  const context = useContext(ProjectTopbarContext);

  if (!context?.project) {
    return null;
  }

  return (
    <Link
      href={`/app/projects/${context.project.slug}/exports`}
      className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary focus-visible:outline-border-focus inline-flex min-h-8 items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {label}
    </Link>
  );
}

function ProjectSwitcher({
  currentProject,
  projects,
  destination,
  allProjectsLabel,
}: {
  currentProject: ProjectSwitcherProject;
  projects: ProjectSwitcherProject[];
  destination: string;
  allProjectsLabel: string;
}) {
  const { close, containerRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const popoverId = 'project-switcher-popover';
  const projectOptions = useMemo(
    () =>
      projects.some((project) => project.slug === currentProject.slug)
        ? projects
        : [currentProject, ...projects],
    [currentProject, projects],
  );

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        title={allProjectsLabel}
        onClick={toggle}
        className="text-content-primary hover:bg-background-subtle focus-visible:outline-border-focus flex min-h-8 min-w-0 items-center gap-1.5 rounded-md px-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <FolderIcon
          aria-hidden="true"
          size={14}
          weight="regular"
          className="shrink-0"
        />

        <span className="max-w-48 truncate">{currentProject.name}</span>

        <CaretDownIcon
          aria-hidden="true"
          size={11}
          className={[
            'text-content-tertiary shrink-0 transition-transform',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {isOpen ? (
        <div
          id={popoverId}
          className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full left-0 z-40 mt-2 w-72 max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border"
        >
          <ul className="max-h-72 overflow-y-auto p-2">
            {projectOptions.map((project) => {
              const isCurrent = project.slug === currentProject.slug;

              if (isCurrent) {
                return (
                  <li key={project.slug}>
                    <span
                      aria-current="page"
                      className="bg-background-subtle text-content-primary flex min-h-11 items-center gap-3 rounded-md px-3 py-2"
                    >
                      <ProjectOptionIdentity project={project} />
                      <CheckIcon
                        aria-hidden="true"
                        size={15}
                        weight="bold"
                        className="text-action-success ml-auto shrink-0"
                      />
                    </span>
                  </li>
                );
              }

              return (
                <li key={project.slug}>
                  <Link
                    href={createProjectSwitchHref({
                      targetProjectSlug: project.slug,
                      destination,
                    })}
                    onClick={close}
                    className="text-content-secondary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus flex min-h-11 items-center rounded-md px-3 py-2 transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    <ProjectOptionIdentity project={project} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-border-subtle border-t p-2">
            <Link
              href="/app/projects"
              onClick={close}
              className="text-content-secondary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            >
              <FolderIcon aria-hidden="true" size={15} />
              <span>{allProjectsLabel}</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectOptionIdentity({
  project,
}: {
  project: ProjectSwitcherProject;
}) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-semibold">
        {project.name}
      </span>
      <span className="text-content-tertiary mt-0.5 block truncate font-mono text-[11px]">
        /{project.slug}
      </span>
    </span>
  );
}

function ProjectSaveStatusIndicator({
  status,
  label,
}: {
  status: ProjectSaveStatus;
  label: string;
}) {
  const statusClassNames: Record<
    ProjectSaveStatus,
    {
      dot: string;
      text: string;
    }
  > = {
    saved: {
      dot: 'bg-action-success',
      text: 'text-content-secondary',
    },
    unsaved: {
      dot: 'bg-action-warning',
      text: 'text-action-warning',
    },
    saving: {
      dot: 'bg-action-info',
      text: 'text-content-secondary',
    },
    error: {
      dot: 'bg-action-danger',
      text: 'text-action-danger',
    },
  };

  const classNames = statusClassNames[status];

  return (
    <span
      role="status"
      className={[
        'ml-2 flex shrink-0 items-center gap-1.5 text-xs font-medium',
        classNames.text,
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={['size-1.5 rounded-full', classNames.dot].join(' ')}
      />

      {label}
    </span>
  );
}

function BreadcrumbSeparator() {
  return (
    <span aria-hidden="true" className="text-content-tertiary shrink-0 text-xs">
      /
    </span>
  );
}

function getAggregatedSaveStatus(
  sources: ReadonlyMap<string, ProjectSaveStatus>,
): ProjectSaveStatus {
  const statuses = Array.from(sources.values());

  if (statuses.includes('error')) {
    return 'error';
  }

  if (statuses.includes('saving')) {
    return 'saving';
  }

  if (statuses.includes('unsaved')) {
    return 'unsaved';
  }

  return 'saved';
}
