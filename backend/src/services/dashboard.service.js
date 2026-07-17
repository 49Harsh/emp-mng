const Employee = require('../models/Employee');
const Department = require('../models/Department');

/**
 * Get dashboard statistics
 */
const getDashboardStats = async () => {
  const [
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    totalDepartments,
    recentEmployees,
    departmentBreakdown,
    roleBreakdown,
    monthlyJoining,
  ] = await Promise.all([
    Employee.countDocuments({ deletedAt: null }),
    Employee.countDocuments({ deletedAt: null, status: 'active' }),
    Employee.countDocuments({ deletedAt: null, status: 'inactive' }),
    Department.countDocuments({ deletedAt: null }),

    // Recent 5 employees
    Employee.find({ deletedAt: null })
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email designation department joiningDate status profileImage employeeId')
      .lean(),

    // Employees per department
    Employee.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ['$department.name', 'Unassigned'] }, count: 1, active: 1 } },
      { $sort: { count: -1 } },
    ]),

    // Employees per role
    Employee.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { role: '$_id', count: 1, _id: 0 } },
    ]),

    // Monthly joining trend (last 12 months)
    Employee.aggregate([
      {
        $match: {
          deletedAt: null,
          joiningDate: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$joiningDate' },
            month: { $month: '$joiningDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  return {
    stats: {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
    },
    recentEmployees,
    departmentBreakdown,
    roleBreakdown,
    monthlyJoining,
  };
};

module.exports = { getDashboardStats };
