export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

export function SkeletonTransaction() {
  return (
    <div className="animate-pulse flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center space-x-4 flex-1">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>

        {/* Balance Card Skeleton */}
        <div className="animate-pulse bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Transactions Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonTransaction key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
