'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <html lang="ja">
      <body className="min-h-screen flex items-center justify-center bg-gray-50 font-sans antialiased">
        <div className="text-center px-4">
          <span className="text-7xl block" role="img" aria-hidden="true">
            🔧
          </span>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            500 - サーバーエラー
          </h1>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            申し訳ございません。サーバーで予期しないエラーが発生しました。
            しばらくしてからもう一度お試しください。
          </p>
          <button
            onClick={reset}
            className="mt-8 rounded-full bg-blue-700 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}
