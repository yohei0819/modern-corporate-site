export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="skeleton h-9 w-48 mb-2" />
      <div className="skeleton h-5 w-72 mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white p-6 shadow-sm border border-gray-200"
          >
            <div className="skeleton h-5 w-16 rounded-full mb-3" />
            <div className="skeleton h-6 w-3/4 mb-2" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-2/3 mb-4" />
            <div className="flex gap-3">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
