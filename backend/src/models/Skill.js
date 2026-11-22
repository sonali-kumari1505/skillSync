const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Programming & Tech',
        'Design & Creative',
        'Data Science & AI',
        'Languages',
        'Business & Marketing',
        'Academics & Science',
        'Music & Arts',
        'Other'
      ],
      default: 'Programming & Tech'
    },
    description: {
      type: String,
      default: ''
    },
    popularity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

skillSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Skill', skillSchema);
