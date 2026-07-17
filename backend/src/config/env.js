require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/employee_management',

  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/profile-images',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

module.exports = env;
