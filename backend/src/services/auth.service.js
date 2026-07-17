const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const env = require('../config/env');

/**
 * Login with email and password
 */
const login = async (email, password) => {
  const user = await User.findOne({ email, isActive: true }).select('+password');
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401, isOperational: true });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401, isOperational: true });
  }

  const tokenPayload = { userId: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt });

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return { accessToken, refreshToken, user };
};

/**
 * Refresh access token
 */
const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401, isOperational: true });
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken, isRevoked: false });
  if (!storedToken) {
    throw Object.assign(new Error('Refresh token not found or revoked'), { statusCode: 401, isOperational: true });
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw Object.assign(new Error('User not found'), { statusCode: 401, isOperational: true });
  }

  const tokenPayload = { userId: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);

  return { accessToken, user };
};

/**
 * Logout - revoke refresh token
 */
const logout = async (refreshToken) => {
  if (refreshToken) {
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
  }
};

/**
 * Get current user profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId).populate('employee');
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404, isOperational: true });
  }
  return user;
};

module.exports = { login, refresh, logout, getMe };
