const Employee = require('../models/Employee');

/**
 * Check for circular reporting chain
 */
const hasCircularReporting = async (employeeId, managerId) => {
  if (!managerId) return false;
  if (String(employeeId) === String(managerId)) return true;

  const visited = new Set();
  let current = managerId;

  while (current) {
    if (visited.has(String(current))) break;
    visited.add(String(current));

    const manager = await Employee.findOne({ _id: current, deletedAt: null })
      .select('reportingManager')
      .lean();
    if (!manager) break;

    if (String(manager.reportingManager) === String(employeeId)) return true;
    current = manager.reportingManager;
  }

  return false;
};

const updateManager = async (employeeId, managerId) => {
  const employee = await Employee.findOne({ _id: employeeId, deletedAt: null });
  if (!employee) {
    throw Object.assign(new Error('Employee not found'), { statusCode: 404, isOperational: true });
  }

  if (managerId) {
    if (String(employeeId) === String(managerId)) {
      throw Object.assign(new Error('An employee cannot report to themselves'), { statusCode: 400, isOperational: true });
    }
    const manager = await Employee.findOne({ _id: managerId, deletedAt: null });
    if (!manager) {
      throw Object.assign(new Error('Manager not found'), { statusCode: 404, isOperational: true });
    }
    const circular = await hasCircularReporting(employeeId, managerId);
    if (circular) {
      throw Object.assign(new Error('This assignment would create a circular reporting chain'), { statusCode: 400, isOperational: true });
    }
  }

  employee.reportingManager = managerId || null;
  await employee.save();

  return employee.populate('reportingManager', 'name email employeeId');
};

const getReportees = async (employeeId) => {
  const employee = await Employee.findOne({ _id: employeeId, deletedAt: null });
  if (!employee) {
    throw Object.assign(new Error('Employee not found'), { statusCode: 404, isOperational: true });
  }

  return Employee.find({ reportingManager: employeeId, deletedAt: null })
    .populate('department', 'name')
    .sort({ name: 1 })
    .lean();
};

const getOrganizationTree = async () => {
  const employees = await Employee.find({ deletedAt: null })
    .populate('department', 'name')
    .select('employeeId name email designation department role status reportingManager profileImage')
    .lean();

  const map = {};
  employees.forEach((emp) => {
    map[String(emp._id)] = { ...emp, children: [] };
  });

  const roots = [];
  employees.forEach((emp) => {
    if (emp.reportingManager) {
      const parent = map[String(emp.reportingManager)];
      if (parent) {
        parent.children.push(map[String(emp._id)]);
      } else {
        roots.push(map[String(emp._id)]);
      }
    } else {
      roots.push(map[String(emp._id)]);
    }
  });

  return roots;
};

module.exports = { updateManager, getReportees, getOrganizationTree, hasCircularReporting };
