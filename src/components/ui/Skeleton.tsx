export function Skeleton({ className = "", variant = "default" }: { className?: string; variant?: "default" | "card" | "text" | "circle" }) {
  const baseClass = "animate-shimmer bg-gradient-to-r from-panel via-hover to-panel bg-[length:1000px_100%]";
  
  const variantClasses = {
    default: "rounded-lg",
    card: "rounded-lg h-48",
    text: "rounded h-4",
    circle: "rounded-full",
  };

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonProductCard() {
  return (
    <div className="card rounded-lg p-6 space-y-4">
      <Skeleton variant="card" className="aspect-[4/3]" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton variant="text" className="w-full h-16" />
    </div>
  );
}

export function SkeletonStoreCard() {
  return (
    <div className="card rounded-lg p-6 space-y-4">
      <Skeleton variant="card" className="aspect-[4/3]" />
      <Skeleton variant="text" className="w-2/3 h-6" />
      <Skeleton variant="text" className="w-full h-12" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 border border-border rounded-lg">
          <Skeleton variant="text" className="flex-1" />
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="text" className="w-20" />
        </div>
      ))}
    </div>
  );
}
