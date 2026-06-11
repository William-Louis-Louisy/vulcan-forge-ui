type TokenEditorToolbarProps = {
  searchLabel: string;
  searchPlaceholder: string;
  newTokenLabel: string;
  tokenSearchQuery: string;
  onSearchChange: (query: string) => void;
};

export function TokenEditorToolbar({
  searchLabel,
  searchPlaceholder,
  newTokenLabel,
  tokenSearchQuery,
  onSearchChange,
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
        className="border-border-subtle bg-surface-primary focus:border-action-primary w-full rounded-2xl border px-4 py-3 text-sm outline-none"
      />

      <button
        type="button"
        disabled
        className="border-border-subtle bg-surface-primary text-content-primary rounded-2xl border px-4 py-3 text-sm font-semibold opacity-70"
      >
        + {newTokenLabel}
      </button>
    </div>
  );
}
