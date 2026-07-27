import { useTranslations } from 'next-intl';
import Logo from './Logo';

type ProductEditorPreviewProps = {
  compact?: boolean;
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
}: ProductEditorPreviewProps) {
  const t = useTranslations('ProductEditorPreview');
  const navigationItems = [
    t('navigation.overview'),
    t('navigation.brand'),
    t('navigation.tokens'),
    t('navigation.themes'),
    t('navigation.components'),
    t('navigation.accessibility'),
    t('navigation.documentation'),
    t('navigation.exports'),
    t('navigation.aiInstructions'),
  ];

  return (
    <figure
      aria-label={t('preview')}
      className={[
        'border-border-on-inverse bg-surface-inverse text-content-on-inverse shadow-elevated overflow-hidden border',
        compact ? 'rounded-lg p-2' : 'rounded-xl p-2 sm:p-3',
      ].join(' ')}
    >
      <div className="border-border-subtle bg-background-app text-content-primary overflow-hidden rounded-md border">
        <div className="border-border-subtle bg-background-sunken flex h-9 min-w-0 items-center gap-2 overflow-hidden border-b px-2.5 text-[9px] sm:px-3 sm:text-[10px]">
          <Logo size={18} className="shrink-0" />

          <span className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap sm:flex">
            <span className="bg-action-accent text-action-accent-content flex size-3.5 shrink-0 items-center justify-center rounded-[3px] text-[8px] font-bold">
              A
            </span>
            <span className="font-semibold whitespace-nowrap">Atelier Lyon</span>
          </span>

          <span className="text-content-tertiary hidden min-w-0 truncate md:block">
            / Aurora System / {t('navigation.tokens')}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span
              title={t('saved')}
              className="text-action-success hidden max-w-28 truncate font-semibold sm:block lg:max-w-36"
            >
              {t('saved')}
            </span>
            <span className="text-content-tertiary hidden whitespace-nowrap lg:inline">
              92 / 100
            </span>
            <span className="hidden whitespace-nowrap font-semibold sm:inline">
              {t('preview')}
            </span>
            <span className="hidden whitespace-nowrap font-semibold sm:inline">
              {t('export')}
            </span>
            <span className="border-border-subtle bg-surface-primary shrink-0 rounded-sm border px-1.5 py-0.5 font-semibold">
              FR
            </span>
            <span className="text-content-tertiary hidden shrink-0 sm:inline">
              EN
            </span>
          </div>
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
            <aside className="border-border-subtle bg-background-sunken hidden min-w-0 border-r p-2 sm:block">
              <p className="text-content-tertiary truncate px-2 py-1.5 text-[8px] font-semibold tracking-[0.16em] uppercase">
                Aurora System
              </p>
              <div className="mt-1 grid gap-0.5">
                {navigationItems.map((label) => (
                  <div
                    key={label}
                    title={label}
                    className={[
                      'truncate rounded-sm px-2 py-1.5 text-[9px] whitespace-nowrap',
                      label === t('navigation.tokens')
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

          <section className="min-w-0 overflow-hidden">
            <div className="border-border-subtle border-b px-3 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold sm:text-sm">
                    {t('navigation.tokens')}
                  </p>
                  <p
                    title={t('tokenSummary')}
                    className="text-content-tertiary mt-0.5 truncate text-[8px] whitespace-nowrap sm:text-[9px]"
                  >
                    {t('tokenSummary')}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5 whitespace-nowrap">
                  <span className="border-border-subtle bg-surface-primary text-content-tertiary rounded-sm border px-2 py-1 text-[8px] whitespace-nowrap">
                    {t('search')}
                  </span>
                  <span className="bg-action-primary text-action-primary-content rounded-sm px-2 py-1 text-[8px] font-semibold whitespace-nowrap">
                    {t('newToken')}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex gap-3 overflow-hidden text-[8px] font-semibold whitespace-nowrap">
                {[
                  [t('sets.colors'), '48'],
                  [t('sets.spacing'), '24'],
                  [t('sets.radius'), '12'],
                  [t('sets.typography'), '18'],
                ].map(([label, count], index) => (
                  <span
                    key={label}
                    className={[
                      'shrink-0 whitespace-nowrap',
                      index === 0
                        ? 'border-action-accent text-content-primary border-b pb-1'
                        : 'text-content-tertiary pb-1',
                    ].join(' ')}
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
                    index === 0
                      ? 'bg-action-accent/5 -mx-3 px-3 sm:-mx-4 sm:px-4'
                      : '',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={`border-border-default size-3.5 rounded-[3px] border ${swatchClassName}`}
                  />
                  <span className="min-w-0">
                    <span title={name} className="block truncate whitespace-nowrap">
                      {name}
                    </span>
                    <span className="text-content-tertiary mt-0.5 block truncate font-sans text-[8px] whitespace-nowrap">
                      {kind === 'primitive' ? t('primitive') : t('semantic')}
                    </span>
                  </span>
                  <span className="text-content-tertiary whitespace-nowrap">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {!compact ? (
            <aside className="border-border-subtle bg-background-sunken hidden min-w-0 border-l lg:block">
              <div className="border-border-subtle border-b p-3">
                <p className="text-content-tertiary truncate text-[8px] font-semibold tracking-[0.14em] uppercase">
                  {t('preview')}
                </p>
                <div className="border-border-subtle bg-surface-primary mt-2 rounded-sm border p-2.5">
                  <span className="border-border-default block h-10 rounded-sm border bg-[#FAF8F3]" />
                  <p className="mt-2 truncate font-mono text-[9px] whitespace-nowrap">
                    #FAF8F3
                  </p>
                </div>
              </div>

              <div className="min-w-0 p-3">
                <p className="text-content-tertiary truncate text-[8px] font-semibold tracking-[0.14em] uppercase">
                  {t('inspector')}
                </p>
                <div className="mt-3 min-w-0 space-y-3 text-[8px]">
                  <div className="min-w-0">
                    <p className="text-content-tertiary truncate">
                      {t('tokenPath')}
                    </p>
                    <p className="mt-1 truncate font-mono whitespace-nowrap">
                      color.bg.app
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-content-tertiary truncate">{t('value')}</p>
                    <div className="border-border-subtle bg-surface-primary mt-1 truncate rounded-sm border px-2 py-1.5 font-mono whitespace-nowrap">
                      #FAF8F3
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-content-tertiary truncate">
                      {t('description')}
                    </p>
                    <div className="border-border-subtle bg-surface-primary text-content-secondary mt-1 min-h-8 rounded-sm border px-2 py-1.5 leading-4 break-words">
                      {t('sampleDescription')}
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
