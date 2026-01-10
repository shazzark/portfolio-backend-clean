const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    // Only one admin user - created manually via script
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Invalid email!! Please provide a valid email',
      ],
    },
    education: [
      {
        school: String,
        degree: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
      immutable: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate admin creation
userSchema.index(
  { role: 1 },
  { unique: true, partialFilterExpression: { role: 'admin' } },
);

module.exports = mongoose.model('User', userSchema);
