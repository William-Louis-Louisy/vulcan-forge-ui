import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./PrimitiveColorTokenEditor', () => ({
  PrimitiveColorTokenEditor: ({
    tokenPath,
    initialValue,
  }: {
    tokenPath: string;
    initialValue: string;
  }) => (
    <div data-testid="primitive-color-editor">
      {tokenPath}:{initialValue}
    </div>
  ),
}));

vi.mock('./TokenDescriptionEditor', () => ({
  TokenDescriptionEditor: ({
    tokenPath,
    initialDescriptionEn,
    initialDescriptionFr,
  }: {
    tokenPath: string;
    initialDescriptionEn: string;
    initialDescriptionFr: string;
  }) => (
    <div data-testid="token-description-editor">
      {tokenPath}:{initialDescriptionEn}:{initialDescriptionFr}
    </div>
  ),
}));

import { TokenTable, type TokenTableLabels } from './TokenTable';

const labels: TokenTableLabels = {
  columns: {
    path: 'Path',
    type: 'Type',
    value: 'Value',
    descriptionStatus: 'Description',
    validationStatus: 'Validation',
  },
  descriptionStatus: {
    available: 'Available',
    fallback: 'Fallback used',
    missing: 'Missing',
  },
  validationStatus: {
    valid: 'Valid',
    invalid: 'Invalid',
    errorsLabel: 'Errors',
  },
  noDescription: 'No description',
  colorSwatchLabel: 'Color swatch',
};

describe('TokenTable', () => {
  it('renders token row information', () => {
    render(
      <TokenTable
        locale="en"
        projectSlug="core-product-ui"
        labels={labels}
        rows={[
          {
            id: 'color.action.primary',
            path: 'color.action.primary',
            type: 'color',
            value: '#ff8731',
            rawValue: '#ff8731',
            description: {
              en: 'Primary action color',
              fr: 'Couleur principale',
            },
            isColorValue: true,
            validationStatus: 'valid',
            errorMessages: [],
          },
        ]}
      />,
    );

    expect(screen.getAllByText('color.action.primary').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('color').length).toBeGreaterThan(0);
    expect(screen.getAllByText('#ff8731').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Available').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Valid').length).toBeGreaterThan(0);
  });

  it('renders an accessible color swatch', () => {
    render(
      <TokenTable
        locale="en"
        projectSlug="core-product-ui"
        labels={labels}
        rows={[
          {
            id: 'color.action.primary',
            path: 'color.action.primary',
            type: 'color',
            value: '#ff8731',
            rawValue: '#ff8731',
            isColorValue: true,
            validationStatus: 'valid',
            errorMessages: [],
          },
        ]}
      />,
    );

    expect(
      screen.getAllByLabelText('Color swatch: #ff8731').length,
    ).toBeGreaterThan(0);
  });

  it('renders validation errors', () => {
    render(
      <TokenTable
        locale="en"
        projectSlug="core-product-ui"
        labels={labels}
        rows={[
          {
            id: 'invalid-token-1',
            path: 'invalid-token-1',
            type: 'unknown',
            value: '—',
            rawValue: undefined,
            isColorValue: false,
            validationStatus: 'invalid',
            errorMessages: ['value: tokenValueRequired'],
          },
        ]}
      />,
    );

    expect(screen.getAllByText('Invalid').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('value: tokenValueRequired').length,
    ).toBeGreaterThan(0);
  });
});
