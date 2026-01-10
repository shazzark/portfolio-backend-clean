const Skill = require('../models/skillModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/* =====================================================
   GET ALL SKILLS – FRONTEND CONSUMPTION
===================================================== */
exports.getAllSkills = catchAsync(async (req, res) => {
  const skills = await Skill.find().sort({
    'category.order': 1,
    order: 1,
  });

  /* =========================
     GROUP SKILLS BY CATEGORY
  ========================= */
  const categoriesMap = {};

  skills.forEach((skill) => {
    const key = skill.category.key;

    if (!categoriesMap[key]) {
      categoriesMap[key] = {
        key,
        title: skill.category.title,
        icon: skill.category.icon,
        color: skill.category.color,
        order: skill.category.order,
        skills: [],
      };
    }

    categoriesMap[key].skills.push({
      id: skill._id,
      name: skill.name,
      level: skill.proficiency,
      years: skill.yearsOfExperience,
      icon: skill.icon,
      order: skill.order,
    });
  });

  const categories = Object.values(categoriesMap).sort(
    (a, b) => a.order - b.order,
  );

  /* =========================
     FEATURED SKILLS SECTION
  ========================= */
  const featuredSkills = skills
    .filter((skill) => skill.isFeatured)
    .map((skill) => ({
      name: skill.name,
      description: skill.featuredDescription,
      icon: skill.icon,
    }));

  /* =========================
     STATS (REAL DATA)
  ========================= */
  const stats = {
    totalSkills: skills.length,
    totalCategories: categories.length,
    maxExperience: 3, // force it to 3
  };

  res.status(200).json({
    status: 'success',
    data: {
      categories,
      featuredSkills,
      stats,
    },
  });
});

exports.getSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { skill },
  });
});

/* =====================================================
   ADMIN CRUD
===================================================== */

exports.createSkill = catchAsync(async (req, res) => {
  const skill = await Skill.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { skill },
  });
});

exports.updateSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { skill },
  });
});

exports.deleteSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
