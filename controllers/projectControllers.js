const Project = require('../models/projectModels');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all projects (PUBLIC)
// @route   GET /api/projects
// @access  Public
exports.getAllProjects = catchAsync(async (req, res, next) => {
  // Filter out drafts for public access
  const filter = req.isAdmin ? {} : { status: 'published' };

  const features = new APIFeatures(Project.find(filter), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query;

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});

// @desc    Get single project by ID or slug (PUBLIC)
// @route   GET /api/projects/:identifier
// @access  Public
exports.getProject = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;

  // Check if identifier is ObjectId or slug
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  // Only show published to public
  if (!req.isAdmin) {
    query.status = 'published';
  }

  const project = await Project.findOne(query);

  if (!project) {
    return next(new AppError('No project found with that identifier', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

// @desc    Create new project (PROTECTED)
// @route   POST /api/projects
// @access  Private (Admin only via secret)
exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      project,
    },
  });
});

// @desc    Update project (PROTECTED)
// @route   PATCH /api/projects/:id
// @access  Private (Admin only via secret)
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

// @desc    Delete project (PROTECTED)
// @route   DELETE /api/projects/:id
// @access  Private (Admin only via secret)
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
