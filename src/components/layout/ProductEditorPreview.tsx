type ProductEditorPreviewProps = {
  compact?: boolean;
  labels: {
    accessibility: string;
    brand: string;
    delivered: string;
    export: string;
    overview: string;
    preview: string;
    project: string;
    themes: string;
    tokens: string;
  };
};

const tokenRows = [
  ['color.bg.app', '#FAF8F3', 'bg-[#FAF8F3]'],
  ['color.fg.primary', '#141310', 'bg-[#141310]'],
  ['color.accent', '#C96442', 'bg-[#C96442]'],
  ['color.action.danger', '#B43A2A', 'bg-[#B43A2A]'],
] as const;

export function ProductEditorPreview({
  compact = false,
  labels,
}: ProductEditorPreviewProps) {
  return (
    <figure
      aria-label={labels.preview}
      className={[
        'border-border-strong bg-action-secondary text-content-inverse shadow-elevated overflow-hidden border',
        compact ? 'rounded-xl p-2' : 'rounded-2xl p-3 sm:p-4',
      ].join(' ')}
    >
      <div className="border-border-subtle bg-background-app text-content-primary overflow-hidden rounded-lg border">
        <div className="border-border-subtle text-content-tertiary border-b px-4 py-3 font-mono text-[11px]">
          aurora-system · tokens · colors
        </div>

        <div
          className={
            compact
              ? 'grid grid-cols-[7rem_1fr]'
              : 'grid md:grid-cols-[9rem_1fr_11rem]'
          }
        >
          <div className="border-border-subtle bg-background-sunken hidden border-r p-3 md:block">
            {[
              labels.overview,
              labels.brand,
              labels.tokens,
              labels.themes,
              labels.accessibility,
            ].map((label) => (
              <div
                key={label}
                className={[
                  'rounded-md px-2 py-2 text-xs',
                  label === labels.tokens
                    ? 'bg-surface-primary text-content-primary font-semibold'
                    : 'text-content-secondary',
                ].join(' ')}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="divide-border-subtle divide-y p-3 sm:p-4">
            {tokenRows.map(([name, value, swatchClassName]) => (
              <div
                key={name}
                className="grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-3 py-2 font-mono text-[11px] sm:text-xs"
              >
                <span
                  aria-hidden="true"
                  className={`border-border-subtle size-4 rounded-sm border ${swatchClassName}`}
                />
                <span className="truncate">{name}</span>
                <span className="text-content-tertiary">{value}</span>
              </div>
            ))}
          </div>

          {!compact ? (
            <div className="border-border-subtle bg-background-sunken hidden border-l p-3 md:block">
              <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                {labels.preview}
              </p>
              <div className="bg-action-primary text-action-primary-content mt-3 rounded-md px-3 py-2 text-center text-xs font-semibold">
                {labels.project}
              </div>
              <div className="bg-action-accent text-action-accent-content mt-2 rounded-md px-3 py-2 text-center text-xs font-semibold">
                {labels.export}
              </div>
              <div className="border-border-subtle bg-surface-primary mt-3 rounded-md border p-3">
                <p className="text-xs font-semibold">Order #2847</p>
                <p className="text-content-tertiary mt-1 text-[10px]">
                  Lyon → Berlin
                </p>
                <p className="text-action-success mt-3 text-[10px] font-semibold">
                  {labels.delivered}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </figure>
  );
}
