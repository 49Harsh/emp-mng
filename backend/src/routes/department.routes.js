const router = require('express').Router();
const deptController = require('../controllers/department.controller');
const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router
  .route('/')
  .get(authorize('department:read'), deptController.getDepartments)
  .post(authorize('department:create'), deptController.createDepartment);

router
  .route('/:id')
  .get(authorize('department:read'), deptController.getDepartment)
  .put(authorize('department:update'), deptController.updateDepartment)
  .delete(authorize('department:delete'), deptController.deleteDepartment);

module.exports = router;
