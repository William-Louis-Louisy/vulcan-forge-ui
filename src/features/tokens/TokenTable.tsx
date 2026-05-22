import type { Locale } from '@/i18n/routing';
import type { DesignToken } from '@/domain/design-system';
import type { TokenRowData } from './tokens-editor.utils';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';

type ResolvableLocalizedString = Parameters<
  typeof resolveLocalizedStringWithFallback
>[0]['localizedString'];

export type TokenTableLabels = {
  columns: {
    path: string;
    type: string;
    value: string;
    descriptionStatus: string;
    validationStatus: string;
  };
  descriptionStatus: {
    available: string;
    fallback: string;
    missing: string;
  };
  validationStatus: {
    valid: string;
    invalid: string;
    errorsLabel: string;
  };
  noDescription: string;
  colorSwatchLabel: string;
};

type TokenTableProps = {
  locale: Locale;
  rows: TokenRowData[];
  labels: TokenTableLabels;
};

function toResolvableLocalizedString(
  localizedString: NonNullable<DesignToken['description']>,
): ResolvableLocalizedString {
  const normalizedLocalizedString: ResolvableLocalizedString = {};

  if (localizedString.en) {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (localizedString.fr) {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  return normalizedLocalizedString;
}

function getDescriptionPresentation({
  locale,
  description,
  labels,
}: {
  locale: Locale;
  description: TokenRowData['description'];
  labels: TokenTableLabels;
}) {
  if (!description) {
    return {
      value: labels.noDescription,
      statusLabel: labels.descriptionStatus.missing,
      status: 'missing' as const,
    };
  }

  const resolution = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(description),
    locale,
    missingValue: labels.noDescription,
  });

  if (resolution.status === 'resolved') {
    return {
      value: resolution.value,
      statusLabel: labels.descriptionStatus.available,
      status: 'available' as const,
    };
  }

  if (resolution.status === 'fallback_used') {
    return {
      value: resolution.value,
      statusLabel: labels.descriptionStatus.fallback,
      status: 'fallback' as const,
    };
  }

  return {
    value: labels.noDescription,
    statusLabel: labels.descriptionStatus.missing,
    status: 'missing' as const,
  };
}

function StatusBadge({
  children,
  tone,
}: {
  children: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const toneClassName = {
    success:
      'border-action-success/30 bg-action-success/10 text-action-success',
    warning:
      'border-action-warning/30 bg-action-warning/10 text-action-warning',
    danger: 'border-action-danger/30 bg-action-danger/10 text-action-danger',
    neutral: 'border-border-subtle bg-background-subtle text-content-secondary',
  }[tone];

  return (
    <span
      className={[
        'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
        toneClassName,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

function DescriptionStatusBadge({
  status,
  label,
}: {
  status: 'available' | 'fallback' | 'missing';
  label: string;
}) {
  const tone =
    status === 'available'
      ? 'success'
      : status === 'fallback'
        ? 'warning'
        : 'neutral';

  return <StatusBadge tone={tone}>{label}</StatusBadge>;
}

function ValidationStatusBadge({
  status,
  labels,
}: {
  status: TokenRowData['validationStatus'];
  labels: TokenTableLabels;
}) {
  return (
    <StatusBadge tone={status === 'valid' ? 'success' : 'danger'}>
      {status === 'valid'
        ? labels.validationStatus.valid
        : labels.validationStatus.invalid}
    </StatusBadge>
  );
}

function TokenValueCell({
  row,
  labels,
}: {
  row: TokenRowData;
  labels: TokenTableLabels;
}) {
  return (
    <div className="flex items-center gap-2">
      {row.isColorValue ? (
        <span
          role="img"
          aria-label={`${labels.colorSwatchLabel}: ${row.value}`}
          className="border-border-subtle size-5 rounded-full border"
          style={{ backgroundColor: row.value }}
        />
      ) : null}

      <span className="text-content-primary font-mono text-sm font-semibold break-all">
        {row.value}
      </span>
    </div>
  );
}

function TokenErrors({
  row,
  labels,
}: {
  row: TokenRowData;
  labels: TokenTableLabels;
}) {
  if (row.errorMessages.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="text-action-danger text-xs font-semibold">
        {labels.validationStatus.errorsLabel}
      </p>
      <ul className="text-action-danger mt-1 list-inside list-disc space-y-1 text-xs">
        {row.errorMessages.map((errorMessage) => (
          <li key={errorMessage}>{errorMessage}</li>
        ))}
      </ul>
    </div>
  );
}

export function TokenTable({ locale, rows, labels }: TokenTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {Object.values(labels.columns).map((columnLabel) => (
                <th
                  key={columnLabel}
                  scope="col"
                  className="border-border-subtle text-content-tertiary border-b px-4 py-3 text-xs font-semibold tracking-[0.18em] uppercase"
                >
                  {columnLabel}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <TokenRow
                key={row.id}
                locale={locale}
                row={row}
                labels={labels}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {rows.map((row) => (
          <MobileTokenRowCard
            key={row.id}
            locale={locale}
            row={row}
            labels={labels}
          />
        ))}
      </div>
    </>
  );
}

export function TokenRow({
  locale,
  row,
  labels,
}: {
  locale: Locale;
  row: TokenRowData;
  labels: TokenTableLabels;
}) {
  const description = getDescriptionPresentation({
    locale,
    description: row.description,
    labels,
  });

  return (
    <tr className="align-top">
      <td className="border-border-subtle border-b px-4 py-4">
        <span className="wrap-break-words font-mono text-sm font-semibold">
          {row.path}
        </span>
      </td>

      <td className="border-border-subtle border-b px-4 py-4 text-sm">
        {row.type}
      </td>

      <td className="border-border-subtle border-b px-4 py-4">
        <TokenValueCell row={row} labels={labels} />
      </td>

      <td className="border-border-subtle border-b px-4 py-4">
        <DescriptionStatusBadge
          status={description.status}
          label={description.statusLabel}
        />
        <p className="text-content-secondary mt-2 max-w-sm text-sm leading-6">
          {description.value}
        </p>
      </td>

      <td className="border-border-subtle border-b px-4 py-4">
        <ValidationStatusBadge status={row.validationStatus} labels={labels} />
        <TokenErrors row={row} labels={labels} />
      </td>
    </tr>
  );
}

function MobileTokenRowCard({
  locale,
  row,
  labels,
}: {
  locale: Locale;
  row: TokenRowData;
  labels: TokenTableLabels;
}) {
  const description = getDescriptionPresentation({
    locale,
    description: row.description,
    labels,
  });

  return (
    <article className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
      <div>
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
          {labels.columns.path}
        </p>
        <h3 className="wrap-break-words mt-1 font-mono text-sm font-semibold">
          {row.path}
        </h3>
      </div>

      <dl className="mt-4 grid gap-4">
        <div>
          <dt className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
            {labels.columns.type}
          </dt>
          <dd className="mt-1 text-sm font-semibold">{row.type}</dd>
        </div>

        <div>
          <dt className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
            {labels.columns.value}
          </dt>
          <dd className="mt-1">
            <TokenValueCell row={row} labels={labels} />
          </dd>
        </div>

        <div>
          <dt className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
            {labels.columns.descriptionStatus}
          </dt>
          <dd className="mt-2">
            <DescriptionStatusBadge
              status={description.status}
              label={description.statusLabel}
            />
            <p className="text-content-secondary mt-2 text-sm leading-6">
              {description.value}
            </p>
          </dd>
        </div>

        <div>
          <dt className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
            {labels.columns.validationStatus}
          </dt>
          <dd className="mt-2">
            <ValidationStatusBadge
              status={row.validationStatus}
              labels={labels}
            />
            <TokenErrors row={row} labels={labels} />
          </dd>
        </div>
      </dl>
    </article>
  );
}
