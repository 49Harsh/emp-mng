const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/apiResponse');

const getStats = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardStats();
    return success(res, data, 'Dashboard stats retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
