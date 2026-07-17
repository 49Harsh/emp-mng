'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', permission: 'dashboard:read' },
  { href: '/employees', label: 'Employees', icon: '👥', permission: 'employee:read' },
  { href: '/organization', label: 'Organization', icon: '🌳', permission: 'organization:read' },
  { href: '/profile', label: 'My Profile', icon: '👤' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { canAccess, user } = useAuth();

  const visibleItems = navItems.filter((item) => !item.permission || canAccess(item.permission));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:inset-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <span className="text-2xl">🏢</span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">EMS</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Employee Management</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Main navigation">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User info */}
          {user && (
            <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
