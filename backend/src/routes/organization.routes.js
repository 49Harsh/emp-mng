const router = require('express').Router();
const orgController = require('../controllers/organization.controller');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, restrictTo } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateManagerSchema } = require('../validators/employee.validator');
const { ROLES } = require('../config/roles');

router.use(authenticate);

router.get('/tree', authorize('organization:read'), orgController.getTree);
router.get('/:id/reportees', authorize('organization:read'), orgController.getReportees);
router.patch(
  '/:id/manager',
  restrictTo(ROLES.SUPER_ADMIN, ROLES.HR_MANAGER),
  validate(updateManagerSchema),
  orgController.updateManager
);

module.exports = router;
