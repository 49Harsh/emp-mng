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
let emp1Id, emp2Id, emp3Id;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const dept = await Department.create({ name: 'Engineering' });

  // Admin
  const adminEmp = await Employee.create({ name: 'Admin', email: 'orgadmin@test.com', department: dept._id, designation: 'CTO', joiningDate: new Date(), role: 'super_admin' });
  await User.create({ name: 'Admin', email: 'orgadmin@test.com', password: await hashPassword('Admin@12345'), role: 'super_admin', employee: adminEmp._id });
  emp1Id = adminEmp._id;

  const res = await request(app).post('/api/auth/login').send({ email: 'orgadmin@test.com', password: 'Admin@12345' });
  adminToken = res.body.data.accessToken;

  // Create two employees
  const e2 = await Employee.create({ name: 'Emp2', email: 'emp2@test.com', department: dept._id, designation: 'Dev', joiningDate: new Date(), reportingManager: emp1Id });
  emp2Id = e2._id;

  const e3 = await Employee.create({ name: 'Emp3', email: 'emp3@test.com', department: dept._id, designation: 'Dev', joiningDate: new Date(), reportingManager: emp2Id });
  emp3Id = e3._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/organization/tree', () => {
  it('should return org tree', async () => {
    const res = await request(app)
      .get('/api/organization/tree')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.tree)).toBe(true);
  });
});

describe('GET /api/organization/:id/reportees', () => {
  it('should return direct reports', async () => {
    const res = await request(app)
      .get(`/api/organization/${emp1Id}/reportees`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.reportees.length).toBe(1);
    expect(res.body.data.reportees[0].name).toBe('Emp2');
  });
});

describe('PATCH /api/organization/:id/manager - circular check', () => {
  it('should reject circular reporting assignment', async () => {
    // emp1 → emp2 → emp3. Trying to set emp1's manager as emp3 would be circular.
    const res = await request(app)
      .patch(`/api/organization/${emp1Id}/manager`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ managerId: emp3Id.toString() });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/circular/i);
  });

  it('should reject self-assignment', async () => {
    const res = await request(app)
      .patch(`/api/organization/${emp1Id}/manager`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ managerId: emp1Id.toString() });
    expect(res.status).toBe(400);
  });

  it('should allow valid manager assignment', async () => {
    const res = await request(app)
      .patch(`/api/organization/${emp3Id}/manager`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ managerId: emp1Id.toString() });
    expect(res.status).toBe(200);
  });
});
