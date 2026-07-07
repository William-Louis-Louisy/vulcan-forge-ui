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

      <input
        id="token-search"
        type="search"
        value={tokenSearchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="border-border-subtle bg-surface-primary text-content-primary placeholder:text-content-tertiary focus:border-action-primary h-8 w-64 rounded-md border px-3 text-sm outline-none"
      />

      <button
        type="button"
        disabled={isNewTokenDisabled}
        onClick={onNewTokenClick}
        className="bg-action-primary text-action-primary-content hover:bg-action-primary-hover inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        + {newTokenLabel}
      </button>
    </div>
  );
}
