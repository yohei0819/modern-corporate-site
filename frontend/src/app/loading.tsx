export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-primary via-blue-700 to-primary-dark text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <div className="skeleton h-4 w-20 !bg-blue-500/40" />
            <div className="skeleton mt-4 h-12 w-72 sm:h-14 sm:w-96 !bg-blue-500/40" />
            <div className="skeleton mt-2 h-12 w-56 sm:h-14 sm:w-72 !bg-blue-500/40" />
            <div className="skeleton mt-6 h-5 w-full max-w-md !bg-blue-500/40" />
            <div className="skeleton mt-2 h-5 w-3/4 max-w-sm !bg-blue-500/40" />
            <div className="mt-8 flex gap-4">
              <div className="skeleton h-12 w-40 rounded-full !bg-blue-500/40" />
              <div className="skeleton h-12 w-40 rounded-full !bg-blue-500/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Jobs skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="skeleton mx-auto h-4 w-16 mb-2" />
            <div className="skeleton mx-auto h-8 w-32" />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
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
      </section>

      {/* Members skeleton */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="skeleton mx-auto h-4 w-16 mb-2" />
            <div className="skeleton mx-auto h-8 w-32" />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="skeleton mx-auto h-48 w-48 !rounded-full" />
                <div className="skeleton mx-auto mt-4 h-4 w-16" />
                <div className="skeleton mx-auto mt-2 h-5 w-24" />
                <div className="skeleton mx-auto mt-1 h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="skeleton mx-auto h-4 w-16 mb-2" />
            <div className="skeleton mx-auto h-8 w-32" />
          </div>
          <div className="mt-12 space-y-4 max-w-3xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg bg-white p-4 border border-gray-100">
                <div className="skeleton h-4 w-24 shrink-0" />
                <div className="skeleton h-5 w-16 rounded-full shrink-0" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
