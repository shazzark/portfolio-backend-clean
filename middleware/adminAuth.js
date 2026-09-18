const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies.admin_session;
    if (!token) return next(new AppError('Authentication is required', 401));

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.ADMIN_SECRET,
    );
    if (payload.role !== 'admin')
      return next(new AppError('Admin access is required', 403));

    req.isAdmin = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;
