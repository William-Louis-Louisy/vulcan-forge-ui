import type { ThemeColorKey, ThemeColorPair } from './themes-editor.utils';

type ContrastStatus = 'pass' | 'warning' | 'fail';
type ContrastGrade = 'aaa' | 'aa' | 'largeOnly' | 'fail';

export type ThemeContrastMatrixLabels = {
  title: string;
  description: string;
  foreground: string;
  background: string;
  missingColors: string;
  invalidColors: string;
  ratio: (ratio: string) => string;
  requiredRatio: (required: string) => string;
  statuses: Record<ContrastStatus, string>;
  grades: Record<ContrastGrade, string>;
  pairLabels: Record<string, string>;
  colorLabels: Record<ThemeColorKey, string>;
};

type ThemeContrastMatrixProps = {
  pairs: ThemeColorPair[];
  labels: ThemeContrastMatrixLabels;
};

function uniqueColorKeys(
  pairs: ThemeColorPair[],
  key: 'foregroundKey' | 'backgroundKey',
): ThemeColorKey[] {
  return Array.from(new Set(pairs.map((pair) => pair[key])));
}

function getGrade(ratio: number): ContrastGrade {
  if (ratio >= 7) {
    return 'aaa';
  }

  if (ratio >= 4.5) {
    return 'aa';
  }

  if (ratio >= 3) {
    return 'largeOnly';
  }

  return 'fail';
}

function getGradeClassName(grade: ContrastGrade) {
  if (grade === 'aaa' || grade === 'aa') {
    return 'bg-action-success/10 text-action-success';
  }

  if (grade === 'largeOnly') {
    return 'bg-action-warning/10 text-action-warning';
  }

  return 'bg-action-danger/10 text-action-danger';
}

function formatReference(
  referencePath: string | null,
  colorKey: ThemeColorKey,
) {
  return referencePath ? `{${referencePath}}` : colorKey;
}

export function ThemeContrastMatrix({
  pairs,
  labels,
}: ThemeContrastMatrixProps) {
  const foregroundKeys = uniqueColorKeys(pairs, 'foregroundKey');
  const backgroundKeys = uniqueColorKeys(pairs, 'backgroundKey');
  const compliantCount = pairs.filter(
    (pair) =>
      pair.contrast?.isValid &&
      pair.contrast.ratio !== null &&
      pair.contrast.ratio >= 4.5,
  ).length;

  return (
    <section className="mt-5 min-w-0">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">
            {labels.title}
          </h3>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {labels.description}
          </p>
        </div>

        <span className="bg-action-success/10 text-action-success w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
          {compliantCount}/{pairs.length} {labels.grades.aa}+
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:hidden">
        {pairs.map((pair) => (
          <ContrastPairCard key={pair.key} pair={pair} labels={labels} />
        ))}
      </div>

      <div className="border-border-subtle mt-3 hidden min-w-0 overflow-x-auto rounded-md border sm:block">
        <table className="w-full min-w-[38rem] border-collapse text-left text-xs">
          <caption className="sr-only">{labels.title}</caption>
          <thead className="bg-background-subtle text-content-tertiary">
            <tr>
              <th className="border-border-subtle border-b px-3 py-2 font-semibold">
                {labels.foreground} ↓ / {labels.background} →
              </th>
              {backgroundKeys.map((backgroundKey) => (
                <th
                  key={backgroundKey}
                  scope="col"
                  className="border-border-subtle border-b px-3 py-2 font-mono font-semibold"
                >
                  {labels.colorLabels[backgroundKey]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foregroundKeys.map((foregroundKey) => (
              <tr
                key={foregroundKey}
                className="border-border-subtle border-b last:border-b-0"
              >
                <th
                  scope="row"
                  className="bg-surface-primary px-3 py-3 font-mono font-semibold"
                >
                  {labels.colorLabels[foregroundKey]}
                </th>
                {backgroundKeys.map((backgroundKey) => {
                  const pair = pairs.find(
                    (candidate) =>
                      candidate.foregroundKey === foregroundKey &&
                      candidate.backgroundKey === backgroundKey,
                  );

                  return (
                    <td key={backgroundKey} className="px-3 py-3 align-top">
                      {pair ? (
                        <ContrastMatrixCell pair={pair} labels={labels} />
                      ) : (
                        <span className="text-content-tertiary">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContrastMatrixCell({
  pair,
  labels,
}: {
  pair: ThemeColorPair;
  labels: ThemeContrastMatrixLabels;
}) {
  if (!pair.foregroundValue || !pair.backgroundValue) {
    return (
      <span className="text-action-warning font-semibold">
        {labels.missingColors}
      </span>
    );
  }

  if (!pair.contrast?.isValid || pair.contrast.ratio === null) {
    return (
      <span className="text-action-danger font-semibold">
        {labels.invalidColors}
      </span>
    );
  }

  const grade = getGrade(pair.contrast.ratio);

  return (
    <div
      className="grid gap-1.5"
      data-contrast-status={pair.contrast.status}
      data-contrast-grade={grade}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold ${getGradeClassName(grade)}`}
        >
          {labels.grades[grade]}
        </span>
        <span className="text-content-secondary font-mono font-semibold">
          {pair.contrast.ratio.toFixed(2)}:1
        </span>
      </div>
      <span className="text-content-tertiary">
        {labels.requiredRatio(pair.contrast.requiredRatio.toFixed(1))}
      </span>
    </div>
  );
}

function ContrastPairCard({
  pair,
  labels,
}: {
  pair: ThemeColorPair;
  labels: ThemeContrastMatrixLabels;
}) {
  return (
    <article className="border-border-subtle bg-background-subtle min-w-0 rounded-md border p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold">
            {labels.pairLabels[pair.key] ?? pair.key}
          </h4>
          <p className="text-content-tertiary mt-1 font-mono text-[0.6875rem] break-words">
            {formatReference(pair.foregroundReferencePath, pair.foregroundKey)}{' '}
            /{' '}
            {formatReference(pair.backgroundReferencePath, pair.backgroundKey)}
          </p>
        </div>
        <ColorPairSwatches pair={pair} labels={labels} />
      </div>

      <div className="mt-3">
        <ContrastMatrixCell pair={pair} labels={labels} />
      </div>
    </article>
  );
}

function ColorPairSwatches({
  pair,
  labels,
}: {
  pair: ThemeColorPair;
  labels: ThemeContrastMatrixLabels;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <ColorSwatch label={labels.foreground} value={pair.foregroundValue} />
      <ColorSwatch label={labels.background} value={pair.backgroundValue} />
    </div>
  );
}

function ColorSwatch({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return value ? (
    <span
      role="img"
      aria-label={`${label}: ${value}`}
      className="border-border-subtle size-5 rounded-full border"
      style={{ backgroundColor: value }}
    />
  ) : (
    <span
      role="img"
      aria-label={`${label}: —`}
      className="border-border-default size-5 rounded-full border border-dashed"
    />
  );
}
