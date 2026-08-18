import { describe, expect, it } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { themePreviewMessages } from '@/messages/theme-preview-messages';
import type { PreviewTheme } from './preview-panel.utils';
import { PreviewPanel, type PreviewPanelLabels } from './PreviewPanel';

const labels: PreviewPanelLabels = {
  title: 'Component preview',
  description: 'Preview description',
  modeLabel: 'Preview theme mode',
  modes: {
    light: 'Light theme',
    dark: 'Dark theme',
  },
  empty: 'No theme available',
  components: {
    button: 'Button',
    textField: 'TextField',
    card: 'Card',
    alert: 'Alert',
  },
  button: {
    primary: 'Primary action',
    secondary: 'Secondary action',
  },
  textField: {
    label: 'Email address',
    placeholder: 'hello@vulcanforge.dev',
    helper: 'Helper text',
  },
  card: {
    title: 'Design system card',
    description: 'Card description',
    cta: 'Open card',
  },
  alert: {
    title: 'Token update available',
    description: 'Alert description',
  },
};

const themes: PreviewTheme[] = [
  {
    id: 'light',
    mode: 'light',
    name: 'Light',
    colors: {
      background: '#f7f3eb',
      surface: '#ffffff',
      content: '#111827',
      muted: '#3a4454',
      accent: '#ff8731',
      info: '#2563eb',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c',
      accentContent: '#111111',
      accentSoft: 'color-mix(in srgb, #ff8731 16%, #ffffff)',
      border: '#d9d2c4',
    },
    palette: [
      {
        key: 'background',
        value: '#f7f3eb',
        rawValue: '{color.primitive.neutral.50}',
        status: 'resolved',
      },
      {
        key: 'surface',
        value: '#ffffff',
        rawValue: '{color.primitive.neutral.0}',
        status: 'resolved',
      },
      {
        key: 'content',
        value: '#111827',
        rawValue: '{color.primitive.neutral.950}',
        status: 'resolved',
      },
      {
        key: 'muted',
        value: '#3a4454',
        rawValue: '{color.primitive.neutral.700}',
        status: 'resolved',
      },
      {
        key: 'accent',
        value: '#ff8731',
        rawValue: '{color.primitive.accent.primary}',
        status: 'resolved',
      },
      {
        key: 'info',
        value: '#2563eb',
        rawValue: '{color.semantic.status.info.light}',
        status: 'resolved',
      },
      {
        key: 'success',
        value: '#15803d',
        rawValue: '{color.semantic.status.success.light}',
        status: 'resolved',
      },
      {
        key: 'warning',
        value: '#b45309',
        rawValue: '{color.semantic.status.warning.light}',
        status: 'resolved',
      },
      {
        key: 'danger',
        value: '#b91c1c',
        rawValue: '{color.semantic.status.danger.light}',
        status: 'resolved',
      },
    ],
    resolvedColorCount: 9,
    fallbackColorKeys: [],
  },
  {
    id: 'dark',
    mode: 'dark',
    name: 'Dark',
    colors: {
      background: '#070707',
      surface: '#1e1e1e',
      content: '#e2e7ef',
      muted: '#a0b1ca',
      accent: '#ff8731',
      info: '#60a5fa',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      accentContent: '#111111',
      accentSoft: 'color-mix(in srgb, #ff8731 16%, #1e1e1e)',
      border: '#303030',
    },
    palette: [
      {
        key: 'background',
        value: '#070707',
        rawValue: '{color.primitive.neutral.950}',
        status: 'resolved',
      },
      {
        key: 'surface',
        value: '#1e1e1e',
        rawValue: '{color.primitive.neutral.900}',
        status: 'resolved',
      },
      {
        key: 'content',
        value: '#e2e7ef',
        rawValue: '{color.primitive.neutral.100}',
        status: 'resolved',
      },
      {
        key: 'muted',
        value: '#a0b1ca',
        rawValue: '{color.missing.muted}',
        status: 'fallback',
      },
      {
        key: 'accent',
        value: '#ff8731',
        rawValue: '{color.primitive.accent.primary}',
        status: 'resolved',
      },
      {
        key: 'info',
        value: '#60a5fa',
        rawValue: '{color.semantic.status.info.dark}',
        status: 'resolved',
      },
      {
        key: 'success',
        value: '#4ade80',
        rawValue: '{color.semantic.status.success.dark}',
        status: 'resolved',
      },
      {
        key: 'warning',
        value: '#fbbf24',
        rawValue: '{color.semantic.status.warning.dark}',
        status: 'resolved',
      },
      {
        key: 'danger',
        value: '#f87171',
        rawValue: '{color.semantic.status.danger.dark}',
        status: 'resolved',
      },
    ],
    resolvedColorCount: 8,
    fallbackColorKeys: ['muted'],
  },
];

function renderPreviewPanel() {
  return render(
    <NextIntlClientProvider
      locale="en"
      timeZone="UTC"
      messages={JSON.parse(JSON.stringify(themePreviewMessages.en))}
    >
      <PreviewPanel themes={themes} labels={labels} />
    </NextIntlClientProvider>,
  );
}

describe('PreviewPanel', () => {
  it('renders core component previews and all semantic alert tones', () => {
    const { container } = renderPreviewPanel();

    expect(
      screen.getByRole('heading', { name: 'Component preview' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Primary action')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Design system card')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(4);
    expect(screen.getByText(/Info · Token update available/)).toBeInTheDocument();
    expect(screen.getByText(/Success · Token update available/)).toBeInTheDocument();
    expect(screen.getByText(/Warning · Token update available/)).toBeInTheDocument();
    expect(screen.getByText(/Danger · Token update available/)).toBeInTheDocument();
    expect(
      screen.getByLabelText('Background: #f7f3eb (Resolved)'),
    ).toBeInTheDocument();
    expect(screen.getByText('9/9')).toBeInTheDocument();
    expect(container.querySelector('[data-preview-panel-header]')).toHaveClass(
      'grid-cols-[minmax(0,1fr)_auto]',
    );
    expect(
      container.querySelector('[data-preview-panel-description]'),
    ).toHaveClass('col-span-2');
  });

  it('switches modes and surfaces fallback mappings', async () => {
    const user = userEvent.setup();
    renderPreviewPanel();

    expect(
      screen.getByRole('group', { name: 'Preview theme mode' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Dark theme' }));

    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('8/9')).toBeInTheDocument();
    expect(
      screen.getByText(/Fallback colors are displayed for: Muted/),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Muted: #a0b1ca (Fallback)'),
    ).toBeInTheDocument();
  });
});
