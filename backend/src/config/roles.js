const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MANAGER: 'hr_manager',
  EMPLOYEE: 'employee',
};

// Permission matrix per role
const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'employee:create',
    'employee:read',
    'employee:update',
    'employee:delete',
    'employee:assign_role',
    'employee:assign_manager',
    'department:create',
    'department:read',
    'department:update',
    'department:delete',
    'dashboard:read',
    'organization:read',
    'csv:import',
  ],
  [ROLES.HR_MANAGER]: [
    'employee:create',
    'employee:read',
    'employee:update',
    'department:read',
    'dashboard:read',
    'organization:read',
    'csv:import',
  ],
  [ROLES.EMPLOYEE]: [
    'employee:read_own',
    'employee:update_own',
    'organization:read',
  ],
};

const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false;
};

module.exports = { ROLES, PERMISSIONS, hasPermission };
