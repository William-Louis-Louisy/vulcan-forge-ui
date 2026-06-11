export type TokenEditorLimitationsNoticeLabels = {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  available: {
    title: string;
    items: string[];
  };
  upcoming: {
    title: string;
    items: string[];
  };
};

type TokenEditorLimitationsNoticeProps = {
  labels: TokenEditorLimitationsNoticeLabels;
};

export function TokenEditorLimitationsNotice({
  labels,
}: TokenEditorLimitationsNoticeProps) {
  return (
    <section className="border-action-warning/30 bg-action-warning/10 mt-8 rounded-3xl border p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-action-warning text-sm font-semibold tracking-[0.18em] uppercase">
            {labels.eyebrow}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {labels.title}
          </h2>

          <p className="text-content-secondary mt-3 max-w-3xl text-sm leading-6">
            {labels.description}
          </p>
        </div>

        <span className="border-action-warning/30 text-action-warning rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap">
          {labels.badge}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <TokenEditorCapabilityCard
          title={labels.available.title}
          items={labels.available.items}
        />

        <TokenEditorCapabilityCard
          title={labels.upcoming.title}
          items={labels.upcoming.items}
        />
      </div>
    </section>
  );
}

function TokenEditorCapabilityCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="border-border-subtle bg-surface-primary rounded-2xl border p-4">
      <h3 className="text-sm font-semibold">{title}</h3>

      <ul className="text-content-secondary mt-3 grid gap-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
