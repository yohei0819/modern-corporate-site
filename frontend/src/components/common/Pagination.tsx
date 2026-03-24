'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  basePath?: string;
}

export default function Pagination({ currentPage, lastPage, basePath }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = basePath || pathname;

  if (lastPage <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${base}?${params.toString()}`;
  };

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="ページネーション" className="flex items-center justify-center gap-1 mt-10">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
        >
          前へ
        </Link>
      )}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dot-${i}`} className="px-2 py-2 text-sm text-gray-400">…</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`px-3 py-2 text-sm rounded-md border ${
              page === currentPage
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ),
      )}
      {currentPage < lastPage && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
        >
          次へ
        </Link>
      )}
    </nav>
  );
}
