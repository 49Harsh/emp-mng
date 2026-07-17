'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { employeeService } from '@/services/employee.service';
import { organizationService } from '@/services/organization.service';
import { ReporteesList } from '@/components/organization/ReporteesList';
import { Loader } from '@/components/common/Loader';
import { useAuth } from '@/context/AuthContext';
import type { Employee, Department } from '@/types/employee.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { canAccess, user } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [reportees, setReportees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    Promise.all([
      employeeService.getEmployee(id),
      organizationService.getReportees(id),
    ])
      .then(([emp, reps]) => {
        setEmployee(emp);
        setReportees(reps);
      })
      .catch(() => toast.error('Failed to load employee'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleImageUpload = async () => {
    if (!imageFile || !employee) return;
    setUploadingImage(true);
    try {
      const filename = await employeeService.uploadProfileImage(employee._id, imageFile);
      setEmployee({ ...employee, profileImage: filename });
      setImageFile(null);
      toast.success('Profile image updated');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading) return <Loader fullPage />;

  if (!employee) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">Employee not found.</p>
        <Link href="/employees" className="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block">
          Back to employees
        </Link>
      </div>
    );
  }

  const dept = employee.department as Department;
  const manager = employee.reportingManager as Employee | null;
  const imgSrc = employee.profileImage ? `${API_URL}/uploads/${employee.profileImage}` : null;
  // user.employee can be a string ID or populated object — normalize to string for comparison
  const userEmployeeId = user?.employee
    ? typeof user.employee === 'object'
      ? (user.employee as { _id: string })._id
      : user.employee
    : null;
  const isOwnProfile = userEmployeeId === employee._id || user?.email === employee.email;
  const canEdit = canAccess('employee:update') || (isOwnProfile && canAccess('employee:update_own'));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/employees" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            ←
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Employee Profile</h1>
        </div>
        {canEdit && (
          <Link href={`/employees/${employee._id}/edit`} className="btn-secondary text-sm">
            ✏️ Edit
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900">
            {imgSrc ? (
              <Image src={imgSrc} alt={employee.name} fill className="object-cover" />
            ) : (
              <span className="flex items-center justify-center h-full text-primary-700 dark:text-primary-300 font-bold text-3xl">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{employee.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{employee.designation}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{employee.employeeId}</p>
          </div>

          <span className={employee.status === 'active' ? 'badge-active' : 'badge-inactive'}>
            {employee.status}
          </span>

          <p className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-3 py-1 capitalize">
            {employee.role.replace('_', ' ')}
          </p>

          {/* Profile image upload */}
          {canEdit && (
            <div className="w-full space-y-2">
              <input
                type="file"
                accept="image/*"
                id="profile-image-upload"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                aria-label="Upload profile image"
              />
              <label
                htmlFor="profile-image-upload"
                className="btn-secondary text-xs w-full cursor-pointer justify-center"
              >
                {imageFile ? imageFile.name : '📷 Change Photo'}
              </label>
              {imageFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="btn-primary text-xs w-full"
                >
                  {uploadingImage ? <Loader size="sm" /> : 'Upload'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Contact & Employment
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Email', value: employee.email },
                { label: 'Phone', value: employee.phone || '—' },
                { label: 'Department', value: dept?.name || '—' },
                { label: 'Designation', value: employee.designation },
                {
                  label: 'Salary',
                  value: employee.salary != null
                    ? `$${employee.salary.toLocaleString()}`
                    : '—',
                },
                {
                  label: 'Joining Date',
                  value: employee.joiningDate
                    ? format(new Date(employee.joiningDate), 'PPP')
                    : '—',
                },
                {
                  label: 'Reporting To',
                  value: manager ? manager.name : '—',
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Reportees */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Direct Reports
            </h3>
            <ReporteesList reportees={reportees} managerName={employee.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
