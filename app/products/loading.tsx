export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-6 w-40 bg-sandstone rounded-lg mb-4" />
      <div className="h-10 w-full max-w-md bg-sandstone rounded-xl mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-sandstone/70 border border-border rounded-2xl p-3 space-y-3">
            <div className="aspect-square bg-border/40 rounded-xl" />
            <div className="h-4 bg-border/50 rounded w-3/4" />
            <div className="h-3 bg-border/40 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
