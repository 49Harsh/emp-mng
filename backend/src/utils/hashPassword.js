const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (plainText, hashed) => {
  return bcrypt.compare(plainText, hashed);
};

module.exports = { hashPassword, comparePassword };
