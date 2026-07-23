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
    ],
    resolvedColorCount: 5,
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
    ],
    resolvedColorCount: 4,
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
  it('renders core component previews and a two-row rail header', () => {
    const { container } = renderPreviewPanel();

    expect(
      screen.getByRole('heading', { name: 'Component preview' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Primary action')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Design system card')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Background: #f7f3eb (Resolved)'),
    ).toBeInTheDocument();
    expect(screen.getByText('5/5')).toBeInTheDocument();
    expect(
      container.querySelector('[data-preview-panel-header]'),
    ).toHaveClass('grid-cols-[minmax(0,1fr)_auto]');
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
    expect(screen.getByText('4/5')).toBeInTheDocument();
    expect(
      screen.getByText(/Fallback colors are displayed for: Muted/),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Muted: #a0b1ca (Fallback)'),
    ).toBeInTheDocument();
  });
});
