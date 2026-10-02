export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-sandstone rounded-md" />

      {/* PDP Main Content Grid (Gallery left, Details right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-sandstone/80 border border-border rounded-2xl w-full" />
          <div className="flex items-center gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-sandstone border border-border rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Product Details Skeleton */}
        <div className="space-y-6">
          <div className="h-3 w-32 bg-sandstone rounded-md" />
          <div className="h-8 w-3/4 bg-sandstone rounded-lg" />
          <div className="h-6 w-1/3 bg-sandstone rounded-md" />
          
          <div className="h-24 bg-sandstone/60 border border-border rounded-xl p-4 space-y-2">
            <div className="h-4 w-full bg-border/40 rounded" />
            <div className="h-4 w-5/6 bg-border/40 rounded" />
            <div className="h-4 w-2/3 bg-border/40 rounded" />
          </div>

          <div className="space-y-3 pt-4">
            <div className="h-12 w-full bg-[#00405C]/20 border border-border rounded-xl" />
            <div className="h-12 w-full bg-[#25D366]/20 border border-border rounded-xl" />
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            <div className="h-10 bg-sandstone rounded-lg w-full" />
            <div className="h-10 bg-sandstone rounded-lg w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
