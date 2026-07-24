import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsForm } from './SettingsForm';

const mocks = vi.hoisted(() => ({
  applyThemePreference: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/app/settings',
  useRouter: () => ({
    refresh: mocks.refresh,
    replace: mocks.replace,
  }),
}));

vi.mock('./theme-preference.client', () => ({
  applyThemePreference: mocks.applyThemePreference,
}));

vi.mock('./update-user-settings.action', () => ({
  updateUserSettingsAction: vi.fn(),
}));

vi.mock('@/features/save-context/usePreserveSaveContext', () => ({
  usePreserveSaveContext: () => vi.fn(),
}));

const messages = {
  SettingsPage: {
    form: {
      description: 'Save your preferences for the next sessions.',
      errors: {
        invalidPayload: 'Invalid payload',
        unauthorized: 'Unauthorized',
        unexpected: 'Unexpected error',
      },
      save: 'Save settings',
      saved: 'Settings are up to date.',
      saving: 'Saving...',
      success: 'Settings saved.',
      unsaved: 'You have unsaved settings.',
    },
    locale: {
      description: 'Choose the default application language for your account.',
      options: {
        en: {
          description: 'Use English as your preferred interface language.',
          label: 'English',
        },
        fr: {
          description: 'Use French as your preferred interface language.',
          label: 'French',
        },
      },
      title: 'Language',
    },
    preferences: {
      description: 'Choose the language and appearance used by VulcanForgeUI.',
      title: 'Preferences',
    },
    theme: {
      description:
        'Choose how the interface should adapt to your display preferences.',
      options: {
        dark: {
          description: 'Always use the dark interface.',
          label: 'Dark',
        },
        light: {
          description: 'Always use the light interface.',
          label: 'Light',
        },
        system: {
          description: 'Follow your device appearance setting.',
          label: 'System',
        },
      },
      title: 'Appearance',
    },
  },
};

function renderSettingsForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SettingsForm
        initialSettings={{ locale: 'en', themePreference: 'system' }}
      />
    </NextIntlClientProvider>,
  );
}

describe('SettingsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders compact labelled preference groups with the saved values', () => {
    renderSettingsForm();

    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Appearance' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /English/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /System/ })).toBeChecked();
    expect(
      screen.getByRole('button', { name: 'Save settings' }),
    ).toBeDisabled();
  });

  it('previews appearance changes and exposes the unsaved state', async () => {
    const user = userEvent.setup();
    renderSettingsForm();
    mocks.applyThemePreference.mockClear();

    await user.click(screen.getByRole('radio', { name: /Dark/ }));

    expect(mocks.applyThemePreference).toHaveBeenLastCalledWith('dark');
    expect(screen.getByText('You have unsaved settings.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save settings' })).toBeEnabled();
  });

  it('keeps locale selection native and keyboard reachable', async () => {
    const user = userEvent.setup();
    renderSettingsForm();

    const frenchOption = screen.getByRole('radio', { name: /French/ });
    frenchOption.focus();
    await user.keyboard('[Space]');

    expect(frenchOption).toBeChecked();
    expect(frenchOption).toHaveFocus();
  });
});
