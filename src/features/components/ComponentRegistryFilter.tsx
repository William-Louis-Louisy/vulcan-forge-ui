'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

export function ComponentRegistryFilter({
  value,
  placeholder,
  submitLabel,
}: {
  value: string;
  placeholder: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(value);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const navigate = (nextQuery: string) => {
    const normalizedQuery = nextQuery.trim();
    const currentQuery = searchParams.get('q')?.trim() ?? '';

    if (normalizedQuery === currentQuery) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (normalizedQuery) {
      params.set('q', normalizedQuery);
    } else {
      params.delete('q');
    }

    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => navigate(query), 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <form
      className="relative mt-3"
      onSubmit={(event) => {
        event.preventDefault();

        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        navigate(query);
      }}
    >
      <input
        type="search"
        name="q"
        value={query}
        placeholder={placeholder}
        onChange={(event) => setQuery(event.target.value)}
        aria-busy={isPending || undefined}
        className="border-border-subtle bg-background-subtle focus:border-action-primary min-h-9 w-full rounded-md border pr-10 pl-3 text-sm outline-none"
      />
      <button
        type="submit"
        aria-label={submitLabel}
        title={submitLabel}
        className="text-content-tertiary hover:text-content-primary absolute inset-y-0 right-0 flex w-9 items-center justify-center transition"
      >
        <MagnifyingGlassIcon aria-hidden="true" size={15} />
      </button>
    </form>
  );
}
