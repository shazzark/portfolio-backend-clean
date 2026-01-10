const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    longDescription: {
      type: String,
      maxlength: [2000, 'Long description cannot exceed 2000 characters'],
    },
    technologies: {
      type: [String],
      required: [true, 'Please provide at least one technology'],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'Please provide at least one technology',
      },
    },
    githubUrl: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional
          return validator.isURL(v, { protocols: ['http', 'https'] });
        },
        message: 'Please provide a valid URL',
      },
    },
    liveUrl: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional
          return validator.isURL(v, { protocols: ['http', 'https'] });
        },
        message: 'Please provide a valid URL',
      },
    },
    images: [
      {
        url: String,
        alt: {
          type: String,
          default: 'Project screenshot',
        },
        isFeatured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: [
        'web',
        'mobile',
        'fullstack',
        'design',
        'other',
        'frontend',
        'backend',
      ],
      default: 'web',
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Generate slug before saving
// projectSchema.pre('save', function (next) {
//   if (this.isModified('title')) {
//     this.slug = slugify(this.title, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });
//   }
//   next();
// });

projectSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

// Indexes for better performance
projectSchema.index({ slug: 1 });
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ category: 1, status: 1 });

// Virtual for featured image (convenience)
projectSchema.virtual('featuredImage').get(function () {
  const featured = this.images.find((img) => img.isFeatured);
  return featured ? featured.url : this.images[0] ? this.images[0].url : null;
});

module.exports = mongoose.model('Project', projectSchema);
