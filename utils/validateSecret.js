const AppError = require('./appError');

const validateAdminSecret = (req) => {
  const adminSecret = req.headers['x-admin-secret'];

  if (!adminSecret) {
    throw new AppError('Admin secret is required', 401);
  }

  if (adminSecret !== process.env.ADMIN_SECRET) {
    throw new AppError('Invalid admin secret', 403);
  }

  return true;
};

module.exports = validateAdminSecret;
