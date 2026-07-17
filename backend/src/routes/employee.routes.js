const router = require('express').Router();
const employeeController = require('../controllers/employee.controller');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, restrictTo } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { uploadProfileImage, uploadCSV } = require('../middlewares/upload.middleware');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validators/employee.validator');
const { ROLES } = require('../config/roles');

// All routes require authentication
router.use(authenticate);

router
  .route('/')
  .get(authorize('employee:read'), employeeController.getEmployees)
  .post(
    authorize('employee:create'),
    validate(createEmployeeSchema),
    employeeController.createEmployee
  );

router
  .route('/:id')
  .get(authorize('employee:read'), employeeController.getEmployee)
  .put(
    authorize('employee:update'),
    validate(updateEmployeeSchema),
    employeeController.updateEmployee
  )
  .delete(authorize('employee:delete'), employeeController.deleteEmployee);

// Profile image upload
router.post(
  '/:id/profile-image',
  authorize('employee:update'),
  uploadProfileImage,
  employeeController.uploadProfileImage
);

// CSV import
router.post(
  '/import/csv',
  restrictTo(ROLES.SUPER_ADMIN, ROLES.HR_MANAGER),
  uploadCSV,
  employeeController.importCSV
);

module.exports = router;
