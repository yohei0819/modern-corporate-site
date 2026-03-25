export default function NewsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="skeleton h-9 w-48 mb-2" />
      <div className="skeleton h-5 w-72 mb-10" />
      <div className="space-y-4 max-w-3xl mx-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-lg bg-white p-4 border border-gray-100"
          >
            <div className="skeleton h-4 w-24 shrink-0" />
            <div className="skeleton h-5 w-16 rounded-full shrink-0" />
            <div className="skeleton h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
