import type { HTMLAttributes } from 'react';

type ColorValueSwatchSize = 'sm' | 'md';

const swatchSizeClassNames: Record<ColorValueSwatchSize, string> = {
  sm: 'size-4',
  md: 'size-5',
};

export type ColorValueSwatchProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  label: string;
  value: string | null;
  size?: ColorValueSwatchSize;
  showValue?: boolean;
};

export function ColorValueSwatch({
  label,
  value,
  size = 'md',
  showValue = true,
  className,
  ...props
}: ColorValueSwatchProps) {
  return (
    <div
      className={['flex min-w-0 items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {value ? (
        <span
          role="img"
          aria-label={`${label}: ${value}`}
          className={[
            'border-border-subtle shrink-0 rounded-full border',
            swatchSizeClassNames[size],
          ].join(' ')}
          style={{ backgroundColor: value }}
        />
      ) : (
        <span
          role="img"
          aria-label={`${label}: —`}
          className={[
            'border-border-default shrink-0 rounded-full border border-dashed',
            swatchSizeClassNames[size],
          ].join(' ')}
        />
      )}

      {showValue ? (
        <span className="text-content-secondary min-w-0 truncate font-mono text-xs font-semibold">
          {value ?? '—'}
        </span>
      ) : null}
    </div>
  );
}
