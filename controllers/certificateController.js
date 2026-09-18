const Certificate = require('../models/certificateModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCertificates = catchAsync(async (req, res) => {
  const certificates = await Certificate.find().sort({
    completionDate: -1,
    createdAt: -1,
  });
  res
    .status(200)
    .json({
      status: 'success',
      results: certificates.length,
      data: { certificates },
    });
});
exports.getCertificate = catchAsync(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate)
    return next(new AppError('No certificate found with that ID', 404));
  res.status(200).json({ status: 'success', data: { certificate } });
});
exports.createCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.create(req.body);
  res.status(201).json({ status: 'success', data: { certificate } });
});
exports.updateCertificate = catchAsync(async (req, res, next) => {
  const certificate = await Certificate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!certificate)
    return next(new AppError('No certificate found with that ID', 404));
  res.status(200).json({ status: 'success', data: { certificate } });
});
exports.deleteCertificate = catchAsync(async (req, res, next) => {
  const certificate = await Certificate.findByIdAndDelete(req.params.id);
  if (!certificate)
    return next(new AppError('No certificate found with that ID', 404));
  res.status(204).end();
});
