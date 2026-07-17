'use client';

import clsx from 'clsx';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pages, total, limit, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPages = () => {
    const range: (number | '...')[] = [];
    const delta = 2;
    const left = page - delta;
    const right = page + delta;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    const withEllipsis: (number | '...')[] = [];
    let prev: number | null = null;
    for (const curr of range) {
      if (typeof curr === 'number') {
        if (prev && curr - prev > 1) withEllipsis.push('...');
        withEllipsis.push(curr);
        prev = curr;
      }
    }
    return withEllipsis;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          ‹
        </button>
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={clsx(
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                p === page
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
