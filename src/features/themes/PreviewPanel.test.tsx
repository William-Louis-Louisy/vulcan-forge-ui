import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      border: '#d9d2c4',
    },
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
      border: '#303030',
    },
  },
];

describe('PreviewPanel', () => {
  it('renders core component previews', () => {
    render(<PreviewPanel themes={themes} labels={labels} />);

    expect(
      screen.getByRole('heading', { name: 'Component preview' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Primary action')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Design system card')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders accessible theme mode controls', () => {
    render(<PreviewPanel themes={themes} labels={labels} />);

    expect(
      screen.getByRole('group', { name: 'Preview theme mode' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
