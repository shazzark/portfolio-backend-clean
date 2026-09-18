const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 8,
});

exports.login = catchAsync(async (req, res, next) => {
  const { secret } = req.body;
  if (!secret || !process.env.ADMIN_SECRET) {
    return next(new AppError('Invalid administrator credentials', 401));
  }

  const supplied = Buffer.from(secret);
  const expected = Buffer.from(process.env.ADMIN_SECRET);
  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return next(new AppError('Invalid administrator credentials', 401));
  }

  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || process.env.ADMIN_SECRET,
    {
      expiresIn: '8h',
    },
  );
  res.cookie('admin_session', token, cookieOptions());
  res.status(200).json({ status: 'success', data: { authenticated: true } });
});

exports.session = (req, res) =>
  res.status(200).json({ status: 'success', data: { authenticated: true } });

exports.logout = (req, res) => {
  res.clearCookie('admin_session', { ...cookieOptions(), maxAge: undefined });
  res.status(204).end();
};
