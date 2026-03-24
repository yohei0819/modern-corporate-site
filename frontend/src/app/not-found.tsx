import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        ページが見つかりません
      </h1>
      <p className="mt-3 text-gray-500">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
      >
        トップに戻る
      </Link>
    </div>
  );
}
