export function RoseCardSkeleton({ delay = 0 }) {
  const delayClass = delay > 0 ? `animation-delay-${delay}` : '';

  return (
    <div className={`flex h-full flex-col rounded-lg bg-white p-2 shadow-sm animate-fade-up ${delayClass}`}>
      <div className="relative aspect-square overflow-hidden rounded skeleton-shimmer" />
      <div className="flex flex-1 flex-col gap-1.5 py-2.5">
        <div className="h-5 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-2/3 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}
