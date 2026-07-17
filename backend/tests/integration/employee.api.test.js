const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const User = require('../../src/models/User');
const Employee = require('../../src/models/Employee');
const Department = require('../../src/models/Department');
const { hashPassword } = require('../../src/utils/hashPassword');

let mongoServer;
let adminToken;
let hrToken;
let deptId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create department
  const dept = await Department.create({ name: 'Engineering' });
  deptId = dept._id;

  // Create admin user
  const adminEmp = await Employee.create({
    name: 'Admin User',
    email: 'admin@test.com',
    department: deptId,
    designation: 'Admin',
    joiningDate: new Date(),
    role: 'super_admin',
  });
  await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: await hashPassword('Admin@12345'),
    role: 'super_admin',
    employee: adminEmp._id,
  });

  // Create HR user
  const hrEmp = await Employee.create({
    name: 'HR User',
    email: 'hr@test.com',
    department: deptId,
    designation: 'HR',
    joiningDate: new Date(),
    role: 'hr_manager',
  });
  await User.create({
    name: 'HR User',
    email: 'hr@test.com',
    password: await hashPassword('Hr@123456'),
    role: 'hr_manager',
    employee: hrEmp._id,
  });

  // Get tokens
  const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Admin@12345' });
  adminToken = adminRes.body.data.accessToken;

  const hrRes = await request(app).post('/api/auth/login').send({ email: 'hr@test.com', password: 'Hr@123456' });
  hrToken = hrRes.body.data.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/employees', () => {
  it('should return employees list for admin', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(401);
  });

  it('should support search filter', async () => {
    const res = await request(app)
      .get('/api/employees?search=Admin')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('POST /api/employees', () => {
  it('should create employee as admin', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Employee',
        email: 'newemp@test.com',
        password: 'Password@123',
        department: deptId.toString(),
        designation: 'Developer',
        joiningDate: '2023-01-01',
        salary: 60000,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.employee.email).toBe('newemp@test.com');
  });

  it('should not allow duplicate email', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Duplicate',
        email: 'newemp@test.com',
        password: 'Password@123',
        department: deptId.toString(),
        designation: 'Developer',
        joiningDate: '2023-01-01',
      });
    expect(res.status).toBe(409);
  });

  it('should not allow HR to delete employee', async () => {
    const listRes = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`);
    const empId = listRes.body.data[0]._id;

    const res = await request(app)
      .delete(`/api/employees/${empId}`)
      .set('Authorization', `Bearer ${hrToken}`);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/dashboard', () => {
  it('should return dashboard stats', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.stats.totalEmployees).toBeGreaterThan(0);
  });
});
