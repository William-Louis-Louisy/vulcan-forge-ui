const projectSectionPaths = new Set([
  'brand',
  'themes',
  'components',
  'accessibility',
  'documentation',
  'exports',
  'ai-instructions',
]);

const tokenSetTypes = new Set([
  'color',
  'spacing',
  'radius',
  'typography',
  'motion',
]);

type GetProjectSwitchDestinationInput = {
  pathname: string;
  currentProjectSlug: string;
  tokenSet: string | null;
};

export function getProjectSwitchDestination({
  pathname,
  currentProjectSlug,
  tokenSet,
}: GetProjectSwitchDestinationInput) {
  const projectBasePath = `/app/projects/${currentProjectSlug}`;

  if (pathname === projectBasePath) {
    return '';
  }

  if (!pathname.startsWith(`${projectBasePath}/`)) {
    return '';
  }

  const [section] = pathname.slice(projectBasePath.length + 1).split('/');

  if (section === 'tokens') {
    const selectedTokenSet =
      tokenSet && tokenSetTypes.has(tokenSet) ? tokenSet : 'color';

    return `tokens?set=${selectedTokenSet}`;
  }

  return section && projectSectionPaths.has(section) ? section : '';
}

export function createProjectSwitchHref({
  targetProjectSlug,
  destination,
}: {
  targetProjectSlug: string;
  destination: string;
}) {
  const projectBasePath = `/app/projects/${targetProjectSlug}`;

  return destination ? `${projectBasePath}/${destination}` : projectBasePath;
}
