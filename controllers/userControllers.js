const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get admin profile (PUBLIC)
// @route   GET /api/users/profile
// @access  Public
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ role: 'admin' }).select('-__v');

  if (!user) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// @desc    Update admin profile (PROTECTED)
// @route   PATCH /api/users/profile
// @access  Private (Admin only via secret)
exports.updateProfile = catchAsync(async (req, res, next) => {
  // Only allow specific fields to be updated
  const allowedFields = ['name', 'bio', 'avatar', 'socialLinks'];
  const filteredBody = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // FIX: Use filteredBody instead of undefined 'updates'
  const user = await User.findOneAndUpdate({ role: 'admin' }, filteredBody, {
    new: true,
    runValidators: true,
  }).select('name email bio avatar socialLinks');

  if (!user) {
    return next(new AppError('Admin profile not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
