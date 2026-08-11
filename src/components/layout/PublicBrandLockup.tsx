import Logo from './Logo';

type PublicBrandLockupProps = {
  className?: string;
  compact?: boolean;
  tone?: 'default' | 'inverse';
};

export function PublicBrandLockup({
  className,
  compact = false,
  tone = 'default',
}: PublicBrandLockupProps) {
  const inverse = tone === 'inverse';

  return (
    <span
      className={[
        'inline-flex select-none items-center font-semibold tracking-[-0.025em]',
        compact ? 'gap-2 text-sm' : 'gap-2.5 text-base',
        inverse ? 'text-content-inverse' : 'text-content-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Logo size={compact ? 25 : 29} tone={tone} />
      <span aria-label="VulcanForge UI">
        Vulcan<span className="text-action-accent">Forge</span>
        <span
          className={
            inverse ? 'text-content-inverse/70' : 'text-content-tertiary'
          }
        >
          UI
        </span>
      </span>
    </span>
  );
}
