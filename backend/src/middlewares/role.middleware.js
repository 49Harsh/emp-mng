const { error } = require('../utils/apiResponse');
const { hasPermission } = require('../config/roles');

/**
 * Check if user has the required permission
 */
const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized', 401);
    }

    const hasAllPermissions = permissions.every((permission) =>
      hasPermission(req.user.role, permission)
    );

    if (!hasAllPermissions) {
      return error(res, 'You do not have permission to perform this action', 403);
    }

    next();
  };
};

/**
 * Restrict to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'You do not have permission to perform this action', 403);
    }

    next();
  };
};

module.exports = { authorize, restrictTo };
