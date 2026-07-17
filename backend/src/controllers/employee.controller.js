const employeeService = require('../services/employee.service');
const { success, created, paginated } = require('../utils/apiResponse');

const getEmployees = async (req, res, next) => {
  try {
    const { employees, pagination } = await employeeService.getEmployees(req.query);

    // Strip salary from list results for employee-role users
    const data =
      req.user.role === 'employee'
        ? employees.map((e) => {
            const obj = e.toObject ? e.toObject() : { ...e };
            delete obj.salary;
            return obj;
          })
        : employees;

    return paginated(res, data, pagination, 'Employees retrieved');
  } catch (err) {
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);

    // Employees can only see their own salary; hide it when viewing others
    const isOwnProfile =
      req.user.role === 'employee' &&
      employee.user?.toString() !== req.user._id.toString();

    const data = employee.toObject ? employee.toObject() : { ...employee };
    if (isOwnProfile) {
      delete data.salary;
    }

    return success(res, { employee: data }, 'Employee retrieved');
  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    return created(res, { employee }, 'Employee created successfully');
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user);
    return success(res, { employee }, 'Employee updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);
    return success(res, null, result.message);
  } catch (err) {
    next(err);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(Object.assign(new Error('No file uploaded'), { statusCode: 400, isOperational: true }));
    }
    const employee = await employeeService.updateProfileImage(req.params.id, req.file.filename);
    return success(res, { profileImage: employee.profileImage }, 'Profile image updated');
  } catch (err) {
    next(err);
  }
};

const importCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(Object.assign(new Error('No CSV file uploaded'), { statusCode: 400, isOperational: true }));
    }
    const results = await employeeService.importFromCSV(req.file.buffer);
    return success(res, results, `Import completed: ${results.created} created, ${results.failed} failed`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadProfileImage,
  importCSV,
};
