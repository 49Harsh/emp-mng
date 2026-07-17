'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { OrgNode } from '@/types/employee.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface OrgNodeCardProps {
  node: OrgNode;
  level?: number;
}

function OrgNodeCard({ node, level = 0 }: OrgNodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const imgSrc = node.profileImage ? `${API_URL}/uploads/${node.profileImage}` : null;

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div className="card p-3 w-48 hover:shadow-md transition-shadow">
        <Link href={`/employees/${node._id}`} className="block">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900 flex-shrink-0">
              {imgSrc ? (
                <Image src={imgSrc} alt={node.name} fill className="object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-primary-700 dark:text-primary-300 font-bold">
                  {node.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate w-36">{node.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-36">{node.designation}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate w-36">
                {typeof node.department === 'object' ? node.department?.name : ''}
              </p>
              <span className={node.status === 'active' ? 'badge-active mt-1' : 'badge-inactive mt-1'}>
                {node.status}
              </span>
            </div>
          </div>
        </Link>

        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 w-full text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center gap-1"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse direct reports' : 'Expand direct reports'}
          >
            <span>{isExpanded ? '▲' : '▼'}</span>
            {node.children.length} report{node.children.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative mt-4">
          {/* Vertical line down */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-slate-300 dark:bg-slate-600" />
          <div className="pt-4 flex gap-6 items-start justify-center">
            {node.children.map((child, idx) => (
              <div key={child._id} className="relative flex flex-col items-center">
                {/* Horizontal connector */}
                {node.children.length > 1 && (
                  <div
                    className={clsx(
                      'absolute top-0 h-px bg-slate-300 dark:bg-slate-600',
                      idx === 0 ? 'left-1/2 right-0' : idx === node.children.length - 1 ? 'left-0 right-1/2' : 'left-0 right-0'
                    )}
                  />
                )}
                {/* Vertical line to child */}
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mb-0" />
                <OrgNodeCard node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface OrgTreeProps {
  roots: OrgNode[];
}

export function OrgTree({ roots }: OrgTreeProps) {
  if (roots.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-4xl" aria-hidden="true">🌳</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400">No organization data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto pb-8">
      <div className="flex gap-12 justify-center flex-wrap min-w-max mx-auto p-4">
        {roots.map((root) => (
          <OrgNodeCard key={root._id} node={root} level={0} />
        ))}
      </div>
    </div>
  );
}
