// MongoDB initialization script
db = db.getSiblingDB('employee_management');

db.createCollection('users');
db.createCollection('employees');
db.createCollection('departments');
db.createCollection('refreshtokens');

print('MongoDB initialized: employee_management database created');
