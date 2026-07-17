const Employee = require('../models/Employee');
const User = require('../models/User');
const Department = require('../models/Department');
const { hashPassword } = require('../utils/hashPassword');
const { parseCSV, mapCSVRowToEmployee } = require('../utils/csvImport');

/**
 * Get all employees with search, filter, sort and pagination
 */
const getEmployees = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    department,
    role,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const filter = { deletedAt: null };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }
  if (department) filter.department = department;
  if (role) filter.role = role;
  if (status) filter.status = status;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const sortDir = sortOrder === 'asc' ? 1 : -1;

  const allowedSortFields = ['name', 'joiningDate', 'salary', 'createdAt'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name')
      .populate('reportingManager', 'name email employeeId')
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Employee.countDocuments(filter),
  ]);

  return {
    employees,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  };
};

/**
 * Get single employee by ID
 */
const getEmployeeById = async (id) => {
  const employee = await Employee.findOne({ _id: id, deletedAt: null })
    .populate('department', 'name description')
    .populate('reportingManager', 'name email employeeId designation');

  if (!employee) {
    throw Object.assign(new Error('Employee not found'), { statusCode: 404, isOperational: true });
  }
  return employee;
};

/**
 * Create new employee + linked user account
 */
const createEmployee = async (data) => {
  const { password, ...employeeData } = data;

  // Check email uniqueness
  const existingEmployee = await Employee.findOne({ email: employeeData.email });
  if (existingEmployee) {
    throw Object.assign(new Error('An employee with this email already exists'), { statusCode: 409, isOperational: true });
  }

  // Validate department exists
  const dept = await Department.findOne({ _id: employeeData.department, deletedAt: null });
  if (!dept) {
    throw Object.assign(new Error('Department not found'), { statusCode: 404, isOperational: true });
  }

  // Validate reporting manager
  if (employeeData.reportingManager) {
    const manager = await Employee.findOne({ _id: employeeData.reportingManager, deletedAt: null });
    if (!manager) {
      throw Object.assign(new Error('Reporting manager not found'), { statusCode: 404, isOperational: true });
    }
  }

  // Create employee
  const employee = await Employee.create(employeeData);

  // Create linked user account
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name: employee.name,
    email: employee.email,
    password: hashedPassword,
    role: employee.role,
    employee: employee._id,
  });

  employee.user = user._id;
  await employee.save();

  return employee.populate([
    { path: 'department', select: 'name' },
    { path: 'reportingManager', select: 'name email employeeId' },
  ]);
};

/**
 * Update employee
 */
const updateEmployee = async (id, data, requestingUser) => {
  const employee = await Employee.findOne({ _id: id, deletedAt: null });
  if (!employee) {
    throw Object.assign(new Error('Employee not found'), { statusCode: 404, isOperational: true });
  }

  // HR cannot update role to super_admin
  if (data.role === 'super_admin' && requestingUser.role !== 'super_admin') {
    throw Object.assign(new Error('Only Super Admin can assign the Super Admin role'), { statusCode: 403, isOperational: true });
  }

  // Validate department if changing
  if (data.department) {
    const dept = await Department.findOne({ _id: data.department, deletedAt: null });
    if (!dept) {
      throw Object.assign(new Error('Department not found'), { statusCode: 404, isOperational: true });
    }
  }

  Object.assign(employee, data);
  await employee.save();

  // Sync user account if email or role changed
  if (data.email || data.role || data.name) {
    const userUpdate = {};
    if (data.email) userUpdate.email = data.email;
    if (data.role) userUpdate.role = data.role;
    if (data.name) userUpdate.name = data.name;
    await User.findByIdAndUpdate(employee.user, userUpdate);
  }

  return employee.populate([
    { path: 'department', select: 'name' },
    { path: 'reportingManager', select: 'name email employeeId' },
  ]);
};

/**
 * Soft delete employee
 */
const deleteEmployee = async (id) => {
  const employee = await Employee.findOne({ _id: id, deletedAt: null });
  if (!employee) {
    throw Object.assign(new Error('Employee not found'), { statusCode: 404, isOperational: true });
  }

  employee.deletedAt = new Date();
  await employee.save();

  // Deactivate user account
  if (employee.user) {
    await User.findByIdAndUpdate(employee.user, { isActive: false });
  }

  return { message: 'Employee deleted successfully' };
};

/**
 * Update profile image
 */
const updateProfileImage = async (id, filename) => {
  const employee = await Employee.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { profileImage: filename },
    { new: true }
  );
  if (!employee) {
    throw Object.assign(new Error('Employee not found'), { statusCode: 404, isOperational: true });
  }
  return employee;
};

/**
 * Import employees from CSV
 */
const importFromCSV = async (buffer) => {
  const rows = await parseCSV(buffer);
  const results = { created: 0, failed: 0, errors: [] };

  for (const row of rows) {
    try {
      const mapped = mapCSVRowToEmployee(row);

      // Find department by name
      const dept = await Department.findOne({
        name: { $regex: new RegExp(`^${mapped.department}$`, 'i') },
        deletedAt: null,
      });
      if (!dept) {
        throw new Error(`Department "${mapped.department}" not found`);
      }

      await createEmployee({
        ...mapped,
        department: dept._id,
        password: 'ChangeMe@123', // default password for CSV imports
      });
      results.created++;
    } catch (err) {
      results.failed++;
      results.errors.push({ row: JSON.stringify(row), error: err.message });
    }
  }

  return results;
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateProfileImage,
  importFromCSV,
};
