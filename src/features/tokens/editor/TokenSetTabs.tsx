import { tokenSetTypes, type TokenSetType } from '../tokens-editor.utils';

type TokenSetTabsProps = {
  label: string;
  activeTokenSetType: TokenSetType;
  tokenSetLabels: Record<TokenSetType, string>;
  onTokenSetChange: (tokenSetType: TokenSetType) => void;
};

export function TokenSetTabs({
  label,
  activeTokenSetType,
  tokenSetLabels,
  onTokenSetChange,
}: TokenSetTabsProps) {
  return (
    <nav
      aria-label={label}
      className="border-border-subtle bg-surface-primary shadow-soft mt-8 overflow-x-auto rounded-2xl border p-2"
    >
      <div className="flex min-w-max gap-2">
        {tokenSetTypes.map((tokenSetType) => {
          const isActive = tokenSetType === activeTokenSetType;

          return (
            <button
              key={tokenSetType}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onTokenSetChange(tokenSetType)}
              className={[
                'rounded-xl px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-action-primary text-action-primary-content'
                  : 'text-content-secondary hover:bg-background-subtle hover:text-content-primary',
              ].join(' ')}
            >
              {tokenSetLabels[tokenSetType]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
