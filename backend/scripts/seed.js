require('dotenv').config();
const mongoose = require('mongoose');
const { hashPassword } = require('../src/utils/hashPassword');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');
const Department = require('../src/models/Department');
const env = require('../src/config/env');

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    Department.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Create departments
  const departments = await Department.insertMany([
    { name: 'Engineering', description: 'Software development and engineering' },
    { name: 'Human Resources', description: 'HR and people operations' },
    { name: 'Finance', description: 'Finance and accounting' },
    { name: 'Marketing', description: 'Marketing and growth' },
    { name: 'Operations', description: 'Business operations' },
  ]);
  console.log(`Created ${departments.length} departments`);

  const [eng, hr, finance, marketing, ops] = departments;

  // Create Super Admin
  const adminPassword = await hashPassword('Admin@12345');
  const adminEmployee = await Employee.create({
    name: 'Super Admin',
    email: 'admin@ems.com',
    phone: '+1234567890',
    department: eng._id,
    designation: 'CTO',
    salary: 150000,
    joiningDate: new Date('2020-01-01'),
    status: 'active',
    role: 'super_admin',
  });
  const adminUser = await User.create({
    name: adminEmployee.name,
    email: adminEmployee.email,
    password: adminPassword,
    role: 'super_admin',
    employee: adminEmployee._id,
  });
  adminEmployee.user = adminUser._id;
  await adminEmployee.save();

  // Create HR Manager
  const hrPassword = await hashPassword('Hr@123456');
  const hrEmployee = await Employee.create({
    name: 'Jane HR',
    email: 'hr@ems.com',
    phone: '+1234567891',
    department: hr._id,
    designation: 'HR Manager',
    salary: 80000,
    joiningDate: new Date('2021-03-15'),
    status: 'active',
    role: 'hr_manager',
    reportingManager: adminEmployee._id,
  });
  const hrUser = await User.create({
    name: hrEmployee.name,
    email: hrEmployee.email,
    password: hrPassword,
    role: 'hr_manager',
    employee: hrEmployee._id,
  });
  hrEmployee.user = hrUser._id;
  await hrEmployee.save();

  // Create sample employees
  const empPassword = await hashPassword('Emp@123456');
  const sampleEmployees = [
    { name: 'Alice Dev', email: 'alice@ems.com', department: eng._id, designation: 'Senior Engineer', salary: 95000, joiningDate: new Date('2021-06-01'), reportingManager: adminEmployee._id },
    { name: 'Bob Dev', email: 'bob@ems.com', department: eng._id, designation: 'Junior Engineer', salary: 65000, joiningDate: new Date('2022-01-10'), reportingManager: adminEmployee._id },
    { name: 'Carol Fin', email: 'carol@ems.com', department: finance._id, designation: 'Finance Analyst', salary: 75000, joiningDate: new Date('2021-09-01'), reportingManager: adminEmployee._id },
    { name: 'Dave Mkt', email: 'dave@ems.com', department: marketing._id, designation: 'Marketing Lead', salary: 70000, joiningDate: new Date('2022-03-15'), reportingManager: adminEmployee._id },
    { name: 'Eve Ops', email: 'eve@ems.com', department: ops._id, designation: 'Operations Manager', salary: 85000, joiningDate: new Date('2020-11-01'), reportingManager: adminEmployee._id, status: 'inactive' },
  ];

  for (const empData of sampleEmployees) {
    const emp = await Employee.create({ ...empData, status: empData.status || 'active', role: 'employee', phone: '+1234567892' });
    const user = await User.create({ name: emp.name, email: emp.email, password: empPassword, role: 'employee', employee: emp._id });
    emp.user = user._id;
    await emp.save();
  }

  console.log(`Created ${sampleEmployees.length + 2} employees`);
  console.log('\n=== Seed Data ===');
  console.log('Super Admin - Email: admin@ems.com | Password: Admin@12345');
  console.log('HR Manager  - Email: hr@ems.com    | Password: Hr@123456');
  console.log('Employee    - Email: alice@ems.com | Password: Emp@123456');
  console.log('=================\n');

  await mongoose.disconnect();
  console.log('Done!');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
