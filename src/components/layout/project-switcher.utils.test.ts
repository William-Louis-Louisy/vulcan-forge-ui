import { describe, expect, it } from 'vitest';

import {
  createProjectSwitchHref,
  getProjectSwitchDestination,
} from './project-switcher.utils';

describe('project switcher routes', () => {
  it('preserves the current editor section', () => {
    expect(
      getProjectSwitchDestination({
        pathname: '/app/projects/aurora/themes',
        currentProjectSlug: 'aurora',
        tokenSet: null,
      }),
    ).toBe('themes');
  });

  it('preserves the project settings section', () => {
    expect(
      getProjectSwitchDestination({
        pathname: '/app/projects/aurora/settings',
        currentProjectSlug: 'aurora',
        tokenSet: null,
      }),
    ).toBe('settings');
  });

  it('collapses nested editor routes to their top-level section', () => {
    expect(
      getProjectSwitchDestination({
        pathname: '/app/projects/aurora/components/button',
        currentProjectSlug: 'aurora',
        tokenSet: null,
      }),
    ).toBe('components');
  });

  it('preserves a supported token set', () => {
    expect(
      getProjectSwitchDestination({
        pathname: '/app/projects/aurora/tokens',
        currentProjectSlug: 'aurora',
        tokenSet: 'spacing',
      }),
    ).toBe('tokens?set=spacing');
  });

  it('falls back to the color token set for unsupported values', () => {
    expect(
      getProjectSwitchDestination({
        pathname: '/app/projects/aurora/tokens',
        currentProjectSlug: 'aurora',
        tokenSet: 'unknown',
      }),
    ).toBe('tokens?set=color');
  });

  it('uses the target project root outside a recognized project section', () => {
    expect(
      getProjectSwitchDestination({
        pathname: '/app/projects/aurora',
        currentProjectSlug: 'aurora',
        tokenSet: null,
      }),
    ).toBe('');
  });

  it('builds a localized-app project href from the destination', () => {
    expect(
      createProjectSwitchHref({
        targetProjectSlug: 'foundry',
        destination: 'documentation',
      }),
    ).toBe('/app/projects/foundry/documentation');
  });
});
