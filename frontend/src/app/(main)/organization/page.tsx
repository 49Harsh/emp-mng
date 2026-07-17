'use client';

import { useEffect, useState } from 'react';
import { organizationService } from '@/services/organization.service';
import { OrgTree } from '@/components/organization/OrgTree';
import { Loader } from '@/components/common/Loader';
import type { OrgNode } from '@/types/employee.types';

export default function OrganizationPage() {
  const [tree, setTree] = useState<OrgNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    organizationService
      .getTree()
      .then(setTree)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Reporting hierarchy across your organization
        </p>
      </div>

      <div className="card p-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Click on a card to view employee details. Use expand/collapse controls to navigate the hierarchy.
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <OrgTree roots={tree} />
        )}
      </div>
    </div>
  );
}
