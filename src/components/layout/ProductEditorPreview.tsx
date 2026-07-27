import Logo from './Logo';

type ProductEditorPreviewProps = {
  compact?: boolean;
  labels: {
    accessibility: string;
    aiInstructions: string;
    brand: string;
    colors: string;
    components: string;
    description: string;
    documentation: string;
    export: string;
    exports: string;
    inspector: string;
    newToken: string;
    overview: string;
    preview: string;
    radius: string;
    saved: string;
    search: string;
    semantic: string;
    spacing: string;
    themes: string;
    tokenSummary: string;
    tokens: string;
    typography: string;
    value: string;
  };
};

const tokenRows = [
  ['color.bg.app', '#FAF8F3', 'bg-[#FAF8F3]', 'primitive'],
  ['color.bg.surface', '#FFFFFF', 'bg-white', 'semantic'],
  ['color.fg.primary', '#141310', 'bg-[#141310]', 'semantic'],
  ['color.accent', '#C96442', 'bg-[#C96442]', 'primitive'],
  ['color.border.line', '#E3DDD0', 'bg-[#E3DDD0]', 'semantic'],
] as const;

export function ProductEditorPreview({
  compact = false,
  labels,
}: ProductEditorPreviewProps) {
  const navigationItems = [
    labels.overview,
    labels.brand,
    labels.tokens,
    labels.themes,
    labels.components,
    labels.accessibility,
    labels.documentation,
    labels.exports,
    labels.aiInstructions,
  ];

  return (
    <figure
      aria-label={labels.preview}
      className={[
        'border-border-on-inverse bg-surface-inverse text-content-on-inverse shadow-elevated overflow-hidden border',
        compact ? 'rounded-lg p-2' : 'rounded-xl p-2 sm:p-3',
      ].join(' ')}
    >
      <div className="border-border-subtle bg-background-app text-content-primary overflow-hidden rounded-md border">
        <div className="border-border-subtle bg-background-sunken flex h-9 items-center gap-2 border-b px-2.5 text-[9px] sm:gap-3 sm:px-3 sm:text-[10px]">
          <Logo size={18} />
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="bg-action-accent text-action-accent-content flex size-3.5 items-center justify-center rounded-[3px] text-[8px] font-bold">
              A
            </span>
            <span className="font-semibold">Atelier Lyon</span>
          </span>
          <span className="text-content-tertiary hidden md:inline">
            / Aurora System / {labels.tokens}
          </span>
          <span className="text-action-success ml-auto font-semibold">
            {labels.saved}
          </span>
          <span className="text-content-tertiary hidden lg:inline">92 / 100</span>
          <span className="hidden font-semibold sm:inline">{labels.preview}</span>
          <span className="hidden font-semibold sm:inline">{labels.export}</span>
          <span className="border-border-subtle bg-surface-primary rounded-sm border px-1.5 py-0.5 font-semibold">
            FR
          </span>
          <span className="text-content-tertiary hidden sm:inline">EN</span>
        </div>

        <div
          className={[
            'grid min-h-72',
            compact
              ? 'grid-cols-[minmax(0,1fr)]'
              : 'sm:grid-cols-[7.5rem_minmax(0,1fr)] lg:grid-cols-[8.5rem_minmax(0,1fr)_12rem]',
          ].join(' ')}
        >
          {!compact ? (
            <aside className="border-border-subtle bg-background-sunken hidden border-r p-2 sm:block">
              <p className="text-content-tertiary px-2 py-1.5 text-[8px] font-semibold tracking-[0.16em] uppercase">
                Aurora System
              </p>
              <div className="mt-1 grid gap-0.5">
                {navigationItems.map((label) => (
                  <div
                    key={label}
                    className={[
                      'rounded-sm px-2 py-1.5 text-[9px]',
                      label === labels.tokens
                        ? 'bg-surface-primary text-content-primary font-semibold'
                        : 'text-content-secondary',
                    ].join(' ')}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </aside>
          ) : null}

          <section className="min-w-0">
            <div className="border-border-subtle border-b px-3 py-2.5 sm:px-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold sm:text-sm">{labels.tokens}</p>
                  <p className="text-content-tertiary mt-0.5 text-[8px] sm:text-[9px]">
                    {labels.tokenSummary}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <span className="border-border-subtle bg-surface-primary text-content-tertiary rounded-sm border px-2 py-1 text-[8px]">
                    {labels.search}
                  </span>
                  <span className="bg-action-primary text-action-primary-content rounded-sm px-2 py-1 text-[8px] font-semibold">
                    {labels.newToken}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex gap-3 overflow-hidden text-[8px] font-semibold">
                {[
                  [labels.colors, '48'],
                  [labels.spacing, '24'],
                  [labels.radius, '12'],
                  [labels.typography, '18'],
                ].map(([label, count], index) => (
                  <span
                    key={label}
                    className={
                      index === 0
                        ? 'border-action-accent text-content-primary border-b pb-1'
                        : 'text-content-tertiary pb-1'
                    }
                  >
                    {label} {count}
                  </span>
                ))}
              </div>
            </div>

            <div className="divide-border-subtle divide-y px-3 sm:px-4">
              {tokenRows.map(([name, value, swatchClassName, kind], index) => (
                <div
                  key={name}
                  className={[
                    'grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-2.5 py-2 font-mono text-[9px] sm:text-[10px]',
                    index === 0 ? 'bg-action-accent/5 -mx-3 px-3 sm:-mx-4 sm:px-4' : '',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={`border-border-default size-3.5 rounded-[3px] border ${swatchClassName}`}
                  />
                  <span className="min-w-0">
                    <span className="block truncate">{name}</span>
                    <span className="text-content-tertiary mt-0.5 block font-sans text-[8px]">
                      {kind === 'primitive' ? labels.primitive : labels.semantic}
                    </span>
                  </span>
                  <span className="text-content-tertiary">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {!compact ? (
            <aside className="border-border-subtle bg-background-sunken hidden border-l lg:block">
              <div className="border-border-subtle border-b p-3">
                <p className="text-content-tertiary text-[8px] font-semibold tracking-[0.14em] uppercase">
                  {labels.preview}
                </p>
                <div className="border-border-subtle bg-surface-primary mt-2 rounded-sm border p-2.5">
                  <span className="bg-[#FAF8F3] border-border-default block h-10 rounded-sm border" />
                  <p className="mt-2 font-mono text-[9px]">#FAF8F3</p>
                </div>
              </div>

              <div className="p-3">
                <p className="text-content-tertiary text-[8px] font-semibold tracking-[0.14em] uppercase">
                  {labels.inspector}
                </p>
                <div className="mt-3 space-y-3 text-[8px]">
                  <div>
                    <p className="text-content-tertiary">Token path</p>
                    <p className="mt-1 font-mono">color.bg.app</p>
                  </div>
                  <div>
                    <p className="text-content-tertiary">{labels.value}</p>
                    <div className="border-border-subtle bg-surface-primary mt-1 rounded-sm border px-2 py-1.5 font-mono">
                      #FAF8F3
                    </div>
                  </div>
                  <div>
                    <p className="text-content-tertiary">{labels.description}</p>
                    <div className="border-border-subtle bg-surface-primary text-content-secondary mt-1 rounded-sm border px-2 py-1.5 leading-4">
                      Main application background.
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </figure>
  );
}
