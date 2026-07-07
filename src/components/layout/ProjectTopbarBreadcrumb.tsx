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
import { FolderIcon, CaretDownIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { projectEditorNavItems } from '@/features/design-systems/project-editor/project-editor-nav.config';

export type ProjectSaveStatus = 'saved' | 'unsaved' | 'saving' | 'error';

type RegisteredProject = {
  registrationId: symbol;
  name: string;
  slug: string;
};

type ProjectTopbarContextValue = {
  project: RegisteredProject | null;
  saveStatus: ProjectSaveStatus;
  registerProject: (project: { name: string; slug: string }) => () => void;
  reportSaveStatus: (sourceId: string, status: ProjectSaveStatus) => void;
  clearSaveStatus: (sourceId: string) => void;
};

const ProjectTopbarContext = createContext<ProjectTopbarContextValue | null>(
  null,
);

type ProjectTopbarProviderProps = {
  children: ReactNode;
};

export function ProjectTopbarBreadcrumbProvider({
  children,
}: ProjectTopbarProviderProps) {
  const [project, setProject] = useState<RegisteredProject | null>(null);

  const [saveSources, setSaveSources] = useState<
    ReadonlyMap<string, ProjectSaveStatus>
  >(() => new Map());

  const registerProject = useCallback(
    ({ name, slug }: { name: string; slug: string }) => {
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
      saveStatus,
      registerProject,
      reportSaveStatus,
      clearSaveStatus,
    }),
    [clearSaveStatus, project, registerProject, reportSaveStatus, saveStatus],
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

  return (
    <nav
      aria-label={labels.ariaLabel}
      className="hidden min-w-0 items-center gap-2 lg:flex"
    >
      <BreadcrumbSeparator />

      <Link
        href={baseHref}
        className="text-content-primary hover:text-action-primary flex min-w-0 items-center gap-1.5 text-sm font-medium transition"
      >
        <FolderIcon
          aria-hidden="true"
          size={14}
          weight="regular"
          className="shrink-0"
        />

        <span className="max-w-48 truncate">{project.name}</span>

        <CaretDownIcon
          aria-hidden="true"
          size={11}
          className="text-content-tertiary shrink-0"
        />
      </Link>

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
        status={context.saveStatus}
        label={labels.saveStatus[context.saveStatus]}
      />
    </nav>
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
