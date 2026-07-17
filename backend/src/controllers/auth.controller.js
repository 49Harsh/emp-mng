const authService = require('../services/auth.service');
const { success, error } = require('../utils/apiResponse');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password);
    return success(res, { accessToken, refreshToken, user }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const { accessToken, user } = await authService.refresh(refreshToken);
    return success(res, { accessToken, user }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    return success(res, { user }, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout, getMe };
