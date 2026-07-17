const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);
router.get('/', authorize('dashboard:read'), dashboardController.getStats);

module.exports = router;
