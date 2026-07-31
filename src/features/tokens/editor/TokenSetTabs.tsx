import { tokenSetTypes, type TokenSetType } from '../tokens-editor.utils';

type TokenSetTabsProps = {
  label: string;
  activeTokenSetType: TokenSetType;
  tokenSetLabels: Record<TokenSetType, string>;
  tokenSetCounts: Record<TokenSetType, number>;
  onTokenSetChange: (tokenSetType: TokenSetType) => void;
};

export function TokenSetTabs({
  label,
  activeTokenSetType,
  tokenSetLabels,
  tokenSetCounts,
  onTokenSetChange,
}: TokenSetTabsProps) {
  return (
    <nav aria-label={label} className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-1.5">
        {tokenSetTypes.map((tokenSetType) => {
          const isActive = tokenSetType === activeTokenSetType;

          return (
            <button
              key={tokenSetType}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onTokenSetChange(tokenSetType)}
              className={[
                'inline-flex min-h-8 cursor-pointer items-center gap-1.5 px-3 pb-1.5 text-center text-sm font-semibold transition',
                isActive
                  ? 'border-content-primary border-b-2'
                  : 'text-content-secondary hover:bg-background-sunken hover:text-content-primary',
              ].join(' ')}
            >
              <span>{tokenSetLabels[tokenSetType]}</span>
              <span className="text-content-tertiary font-mono text-[11px]">
                {tokenSetCounts[tokenSetType] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
