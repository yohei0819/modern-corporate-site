'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl" role="img" aria-hidden="true">
        ⚠️
      </span>
      <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        エラーが発生しました
      </h1>
      <p className="mt-3 text-gray-500 max-w-md">
        申し訳ございません。ページの読み込み中にエラーが発生しました。
        しばらくしてからもう一度お試しください。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          もう一度試す
        </button>
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
