const { verifyAccessToken } = require('../utils/generateToken');
const { error } = require('../utils/apiResponse');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authentication token is missing', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return error(res, 'User not found or account deactivated', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Access token expired', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token', 401);
    }
    next(err);
  }
};

module.exports = authenticate;
