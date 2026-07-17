const { mapCSVRowToEmployee } = require('../../src/utils/csvImport');
const { hasCircularReporting } = require('../../src/services/organization.service');

describe('csvImport - mapCSVRowToEmployee', () => {
  it('should map a standard CSV row', () => {
    const row = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      department: 'Engineering',
      designation: 'Engineer',
      salary: '80000',
      joining_date: '2023-01-15',
      status: 'Active',
      role: 'Employee',
    };
    const result = mapCSVRowToEmployee(row);
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.salary).toBe(80000);
    expect(result.status).toBe('active');
    expect(result.role).toBe('employee');
  });

  it('should handle capitalized column headers', () => {
    const row = {
      Name: 'Jane Smith',
      Email: 'Jane@EXAMPLE.COM',
      Department: 'HR',
      Designation: 'Manager',
    };
    const result = mapCSVRowToEmployee(row);
    expect(result.name).toBe('Jane Smith');
    expect(result.email).toBe('jane@example.com');
  });

  it('should default status to active when missing', () => {
    const result = mapCSVRowToEmployee({ name: 'Test', email: 'test@test.com' });
    expect(result.status).toBe('active');
  });
});

describe('organization - hasCircularReporting', () => {
  it('should detect self-assignment as circular', async () => {
    const result = await hasCircularReporting('emp1', 'emp1');
    expect(result).toBe(true);
  });

  it('should return false when managerId is null', async () => {
    const result = await hasCircularReporting('emp1', null);
    expect(result).toBe(false);
  });
});
