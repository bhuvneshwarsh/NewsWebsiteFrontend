export function SkeletonCard() {
  return (
    <div className="flex gap-3 bg-white rounded-xl shadow-sm p-3 animate-pulse">
      <div className="w-24 h-20 rounded-lg bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-2.5 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2 bg-gray-200 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

export function SkeletonFeatured() {
  return (
    <div className="rounded-2xl bg-gray-200 aspect-[16/9] animate-pulse" />
  );
}

export function SkeletonText({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i}
          className="h-3 bg-gray-200 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}