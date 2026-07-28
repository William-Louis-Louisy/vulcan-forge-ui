import { Button, Input } from '@/components/ui';

type TokenEditorToolbarProps = {
  searchLabel: string;
  searchPlaceholder: string;
  newTokenLabel: string;
  tokenSearchQuery: string;
  onSearchChange: (query: string) => void;
  isNewTokenDisabled: boolean;
  onNewTokenClick: () => void;
};

export function TokenEditorToolbar({
  searchLabel,
  searchPlaceholder,
  newTokenLabel,
  tokenSearchQuery,
  onSearchChange,
  isNewTokenDisabled,
  onNewTokenClick,
}: TokenEditorToolbarProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="sr-only" htmlFor="token-search">
        {searchLabel}
      </label>

      <Input
        id="token-search"
        type="search"
        value={tokenSearchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        size="sm"
        className="sm:w-64"
      />

      <Button
        disabled={isNewTokenDisabled}
        onClick={onNewTokenClick}
        size="sm"
        className="shrink-0"
      >
        + {newTokenLabel}
      </Button>
    </div>
  );
}
