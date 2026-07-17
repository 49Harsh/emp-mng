const Department = require('../models/Department');
const Employee = require('../models/Employee');
const { success, created, error, paginated } = require('../utils/apiResponse');

const getDepartments = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const filter = { deletedAt: null };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [departments, total] = await Promise.all([
      Department.find(filter)
        .populate('head', 'name email employeeId')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Department.countDocuments(filter),
    ]);

    // Attach employee count to each department
    const counts = await Employee.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    const enriched = departments.map((d) => ({ ...d, employeeCount: countMap[String(d._id)] || 0 }));

    return paginated(
      res,
      enriched,
      { page: parseInt(page, 10), limit: parseInt(limit, 10), total, pages: Math.ceil(total / parseInt(limit, 10)) },
      'Departments retrieved'
    );
  } catch (err) {
    next(err);
  }
};

const getDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findOne({ _id: req.params.id, deletedAt: null }).populate('head', 'name email');
    if (!dept) return error(res, 'Department not found', 404);
    return success(res, { department: dept }, 'Department retrieved');
  } catch (err) {
    next(err);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, description, head } = req.body;
    const dept = await Department.create({ name, description, head: head || null });
    return created(res, { department: dept }, 'Department created successfully');
  } catch (err) {
    next(err);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, head, isActive } = req.body;
    const dept = await Department.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { name, description, head: head || null, isActive },
      { new: true, runValidators: true }
    );
    if (!dept) return error(res, 'Department not found', 404);
    return success(res, { department: dept }, 'Department updated');
  } catch (err) {
    next(err);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    // Check if department has employees
    const empCount = await Employee.countDocuments({ department: req.params.id, deletedAt: null });
    if (empCount > 0) {
      return error(res, `Cannot delete department with ${empCount} active employee(s)`, 409);
    }

    const dept = await Department.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!dept) return error(res, 'Department not found', 404);
    return success(res, null, 'Department deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
