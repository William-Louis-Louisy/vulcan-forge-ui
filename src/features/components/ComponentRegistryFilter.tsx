'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

export function ComponentRegistryFilter({
  value,
  placeholder,
}: {
  value: string;
  placeholder: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [query, setQuery] = useState(value);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(
    (nextQuery: string) => {
      const normalizedQuery = nextQuery.trim();
      const params = new URLSearchParams(searchParamsString);
      const currentQuery = params.get('q')?.trim() ?? '';

      if (normalizedQuery === currentQuery) {
        return;
      }

      if (normalizedQuery) {
        params.set('q', normalizedQuery);
      } else {
        params.delete('q');
      }

      const href =
        params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router, searchParamsString],
  );

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
  }, [navigate, query]);

  return (
    <input
      type="search"
      name="q"
      value={query}
      placeholder={placeholder}
      onChange={(event) => setQuery(event.target.value)}
      aria-busy={isPending || undefined}
      className="border-border-subtle bg-background-subtle focus:border-action-primary mt-3 min-h-9 w-full rounded-md border px-3 text-sm outline-none"
    />
  );
}
