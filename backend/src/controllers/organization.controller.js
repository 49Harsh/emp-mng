const organizationService = require('../services/organization.service');
const { success } = require('../utils/apiResponse');

const getTree = async (req, res, next) => {
  try {
    const tree = await organizationService.getOrganizationTree();
    return success(res, { tree }, 'Organization tree retrieved');
  } catch (err) {
    next(err);
  }
};

const getReportees = async (req, res, next) => {
  try {
    const reportees = await organizationService.getReportees(req.params.id);
    return success(res, { reportees }, 'Reportees retrieved');
  } catch (err) {
    next(err);
  }
};

const updateManager = async (req, res, next) => {
  try {
    const employee = await organizationService.updateManager(req.params.id, req.body.managerId);
    return success(res, { employee }, 'Reporting manager updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { getTree, getReportees, updateManager };
