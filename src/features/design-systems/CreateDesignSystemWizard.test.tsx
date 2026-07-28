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

async function reachReviewStep() {
  const user = userEvent.setup();

  renderWizard();

  await user.type(screen.getByLabelText(/name/i), 'Aurora System');
  await user.click(screen.getByRole('button', { name: /continue/i }));

  const platformCheckbox = screen
    .getAllByRole('checkbox')
    .find(
      (checkbox) =>
        !(checkbox as HTMLInputElement).disabled &&
        !(checkbox as HTMLInputElement).checked,
    );

  expect(platformCheckbox).toBeDefined();
  await user.click(platformCheckbox!);
  await user.click(screen.getByRole('button', { name: /continue/i }));

  await user.click(screen.getAllByRole('radio')[0]!);
  await user.click(screen.getByRole('button', { name: /continue/i }));

  await user.click(screen.getAllByRole('radio')[0]!);
  await user.click(screen.getByRole('button', { name: /continue/i }));
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

  it('keeps review confirmation on the submitter without a button formAction', async () => {
    await reachReviewStep();

    const createButton = screen.getByRole('button', {
      name: /create project/i,
    });

    expect(createButton).toHaveAttribute('name', 'reviewConfirmed');
    expect(createButton).toHaveAttribute('value', 'true');
    expect(createButton).not.toHaveAttribute('formaction');
    expect(createButton.closest('form')).toBeInTheDocument();
  });
});
