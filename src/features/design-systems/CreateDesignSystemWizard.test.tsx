import enMessages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { CreateDesignSystemWizard } from './CreateDesignSystemWizard';

vi.mock('./create-design-system.action', () => ({
  createDesignSystemAction: vi.fn(),
}));

function renderWizard() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <CreateDesignSystemWizard locale="en" />
    </NextIntlClientProvider>,
  );
}

describe('CreateDesignSystemWizard', () => {
  it('requires the review step before submitting the project creation', async () => {
    const user = userEvent.setup();

    renderWizard();

    await user.type(screen.getByLabelText(/name/i), 'Aurora System');

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByRole('group', { name: /platforms and languages/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /create project/i }),
    ).not.toBeInTheDocument();
  });
});
