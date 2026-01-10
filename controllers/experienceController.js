const Experience = require('../models/experienceModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all experiences (PUBLIC)
// @route   GET /api/experiences
// @access  Public
exports.getAllExperiences = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Experience.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const experiences = await features.query;

  // Sort by startDate descending (most recent first)
  experiences.sort((a, b) => b.startDate - a.startDate);

  // Group by year for timeline display
  const experiencesByYear = experiences.reduce((acc, exp) => {
    const year = exp.startDate.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(exp);
    return acc;
  }, {});

  // Calculate total experience
  const totalMonths = experiences.reduce((total, exp) => {
    const start = exp.startDate;
    const end = exp.current ? new Date() : exp.endDate;
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);

  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  res.status(200).json({
    status: 'success',
    results: experiences.length,
    totalExperience: `${totalYears} years${remainingMonths > 0 ? `, ${remainingMonths} months` : ''}`,
    data: {
      experiences,
      byYear: experiencesByYear,
    },
  });
});

// @desc    Get single experience (PUBLIC)
// @route   GET /api/experiences/:id
// @access  Public
exports.getExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new AppError('No experience found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      experience,
    },
  });
});

// @desc    Create new experience (PROTECTED)
// @route   POST /api/experiences
// @access  Private (Admin only via secret)
exports.createExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      experience,
    },
  });
});

// @desc    Update experience (PROTECTED)
// @route   PATCH /api/experiences/:id
// @access  Private (Admin only via secret)
exports.updateExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!experience) {
    return next(new AppError('No experience found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      experience,
    },
  });
});

// @desc    Delete experience (PROTECTED)
// @route   DELETE /api/experiences/:id
// @access  Private (Admin only via secret)
exports.deleteExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);

  if (!experience) {
    return next(new AppError('No experience found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @desc    Get current/featured experiences (PUBLIC)
// @route   GET /api/experiences/featured
// @access  Public
exports.getFeaturedExperiences = catchAsync(async (req, res, next) => {
  const featured = await Experience.find({
    $or: [{ current: true }, { isFeatured: true }],
  }).sort('-startDate');

  res.status(200).json({
    status: 'success',
    results: featured.length,
    data: {
      experiences: featured,
    },
  });
});
