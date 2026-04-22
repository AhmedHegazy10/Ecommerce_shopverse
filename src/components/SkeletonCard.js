export default function SkeletonCard() {
  return (
    <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
      {/* Image skeleton */}
      <div className="skeleton aspect-[4/3] w-full" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 rounded-full w-1/3" />
        <div className="skeleton h-5 rounded-full w-4/5" />
        <div className="skeleton h-4 rounded-full w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-6 rounded-full w-1/4" />
          <div className="skeleton h-4 rounded-full w-1/5" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="skeleton h-9 rounded-xl" />
          <div className="skeleton h-9 rounded-xl" />
          <div className="skeleton h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
