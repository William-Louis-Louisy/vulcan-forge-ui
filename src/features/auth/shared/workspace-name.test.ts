import { describe, expect, it } from 'vitest';
import { formatPersonalWorkspaceName } from './workspace-name';

describe('formatPersonalWorkspaceName', () => {
  it('formats English and French workspace names', () => {
    expect(
      formatPersonalWorkspaceName({ locale: 'en', userName: 'William' }),
    ).toBe("William's workspace");
    expect(
      formatPersonalWorkspaceName({ locale: 'fr', userName: 'William' }),
    ).toBe('Espace de travail de William');
  });

  it('uses a localized fallback name', () => {
    expect(formatPersonalWorkspaceName({ locale: 'en', userName: null })).toBe(
      "User's workspace",
    );
    expect(formatPersonalWorkspaceName({ locale: 'fr', userName: '  ' })).toBe(
      "Espace de travail de Utilisateur",
    );
  });
});
