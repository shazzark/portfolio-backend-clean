const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Please provide position title'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      default: 'full-time',
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // endDate can be null (current job) or must be after startDate
          if (!value) return true; // null means current position
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    responsibilities: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'Please provide at least one responsibility',
      },
    },
    technologies: [String],
    logo: String,
    companyWebsite: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
          return urlRegex.test(v);
        },
        message: 'Please provide a valid URL',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for duration calculation
experienceSchema.virtual('duration').get(function () {
  const start = this.startDate;
  const end = this.current ? new Date() : this.endDate;

  if (!start) return 'N/A';

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  let duration = '';
  if (years > 0) {
    duration += `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months > 0) {
    if (duration) duration += ', ';
    duration += `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  return duration || 'Less than a month';
});

// Virtual for formatted dates
experienceSchema.virtual('formattedStartDate').get(function () {
  return this.startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
});

experienceSchema.virtual('formattedEndDate').get(function () {
  if (this.current) return 'Present';
  if (!this.endDate) return 'Present';
  return this.endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
});

// Ensure virtuals are included in JSON output
experienceSchema.set('toJSON', { virtuals: true });
experienceSchema.set('toObject', { virtuals: true });

// Index for better querying
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ current: 1, isFeatured: 1 });
experienceSchema.index({ company: 1, position: 1 }, { unique: true });

// Pre-save hook to sync current and endDate
experienceSchema.pre('save', function (next) {
  // If current is true, clear endDate
  if (this.current) {
    this.endDate = null;
  }

  // If order is not set, assign based on startDate
  if (this.order === 0) {
    this.order =
      Math.floor(new Date().getTime() / 1000) -
      Math.floor(this.startDate.getTime() / 1000);
  }

  next();
});

module.exports = mongoose.model('Experience', experienceSchema);
