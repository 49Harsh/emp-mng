const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/employees', require('./employee.routes'));
router.use('/departments', require('./department.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/organization', require('./organization.routes'));

module.exports = router;
