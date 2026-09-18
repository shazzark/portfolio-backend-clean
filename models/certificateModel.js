const mongoose = require('mongoose');
const validator = require('validator');

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a certificate title'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Please provide a platform'],
      trim: true,
    },
    certificateUrl: {
      type: String,
      required: [true, 'Please provide a certificate URL'],
      validate: {
        validator: (value) =>
          validator.isURL(value, { protocols: ['http', 'https'] }),
        message: 'Please provide a valid URL',
      },
    },
    completionDate: Date,
    topics: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Certificate', certificateSchema);
