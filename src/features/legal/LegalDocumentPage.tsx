import type { LegalDocument } from './legal-content';
import type { LegalPublisher } from './legal-publisher';

export function LegalDocumentPage({
  document,
  publisher,
}: {
  document: LegalDocument;
  publisher: LegalPublisher;
}) {
  return (
    <main className="bg-background-app text-content-primary px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
      <article className="mx-auto max-w-4xl">
        <header className="border-border-subtle border-b pb-10">
          <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
            {document.eyebrow}
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
            {document.title}
          </h1>
          <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7 sm:text-lg">
            {document.description}
          </p>
          <p className="text-content-tertiary mt-4 text-sm">
            {document.lastUpdatedLabel}:{' '}
            <time dateTime="2026-08-07">{document.lastUpdatedDisplay}</time>
          </p>
        </header>

        {!publisher.publicationReady ? (
          <aside className="border-action-accent/30 bg-action-accent/10 mt-8 rounded-md border p-4">
            <h2 className="text-sm font-semibold">
              {document.publicationWarningTitle}
            </h2>
            <p className="text-content-secondary mt-1 text-sm leading-6">
              {document.publicationWarning}
            </p>
          </aside>
        ) : null}

        <div className="mt-12 space-y-12">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-content-secondary mt-4 text-sm leading-7 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}

              {section.items ? (
                <ul className="text-content-secondary mt-4 list-disc space-y-2 pl-5 text-sm leading-7 sm:text-base">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.externalLink ? (
                <a
                  href={section.externalLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-action-accent mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
                >
                  {section.externalLink.label}
                </a>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
