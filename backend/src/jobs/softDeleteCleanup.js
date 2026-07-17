const cron = require('node-cron');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const logger = require('../utils/logger');

/**
 * Permanently delete soft-deleted records older than 30 days
 * Runs daily at midnight
 */
const startSoftDeleteCleanup = () => {
  cron.schedule('0 0 * * *', async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const [empResult, deptResult] = await Promise.all([
        Employee.deleteMany({ deletedAt: { $ne: null, $lt: thirtyDaysAgo } }),
        Department.deleteMany({ deletedAt: { $ne: null, $lt: thirtyDaysAgo } }),
      ]);

      logger.info(
        `Cleanup: Deleted ${empResult.deletedCount} employees and ${deptResult.deletedCount} departments older than 30 days`
      );
    } catch (err) {
      logger.error(`Cleanup job failed: ${err.message}`);
    }
  });

  logger.info('Soft-delete cleanup job scheduled (daily at midnight)');
};

module.exports = startSoftDeleteCleanup;
