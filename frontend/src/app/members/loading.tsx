export default function MembersLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="skeleton h-9 w-48 mb-2" />
      <div className="skeleton h-5 w-72 mb-10" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-white p-6 border border-gray-100 text-center">
            <div className="mx-auto h-40 w-40 rounded-full skeleton" />
            <div className="skeleton h-4 w-32 mx-auto mt-4" />
            <div className="skeleton h-6 w-24 mx-auto mt-2" />
            <div className="skeleton h-4 w-40 mx-auto mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
