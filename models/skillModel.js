const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    /* =========================
       SKILL CORE DATA
    ========================= */
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
    },

    proficiency: {
      type: Number,
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100'],
      required: true,
    },

    yearsOfExperience: {
      type: Number,
      min: [0, 'Years cannot be negative'],
      default: 1,
    },

    icon: {
      type: String, // emoji or icon key
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    /* =========================
       CATEGORY (EMBEDDED)
    ========================= */
    category: {
      key: {
        type: String,
        required: true,
        enum: ['frontend', 'backend', 'database-cloud', 'design-tools'],
      },

      title: {
        type: String, // e.g. "Frontend Development"
        required: true,
      },

      icon: {
        type: String, // e.g. "Code2"
        required: true,
      },

      color: {
        type: String, // e.g. "bg-blue-500"
        required: true,
      },

      order: {
        type: Number,
        required: true,
      },
    },

    /* =========================
       FEATURED SKILLS
    ========================= */
    isFeatured: {
      type: Boolean,
      default: false,
    },

    featuredDescription: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  },
);

/* Ensure unique skill per category */
skillSchema.index({ name: 1, 'category.key': 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
