const AppError = require('../utils/appError');

const adminAuth = (req, res, next) => {
  try {
    const adminSecret = req.headers['x-admin-secret'];

    if (!adminSecret) {
      return next(new AppError('Admin secret is required', 401));
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return next(new AppError('Invalid admin secret', 403));
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;
