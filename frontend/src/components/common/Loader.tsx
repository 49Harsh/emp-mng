import clsx from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
}

export function Loader({ size = 'md', className, fullPage }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <div
      role="status"
      className={clsx(
        'rounded-full border-primary-500 border-t-transparent animate-spin',
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
