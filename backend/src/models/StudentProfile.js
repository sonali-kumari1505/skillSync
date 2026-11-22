const mongoose = require('mongoose');

const teachSkillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    proficiencyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3
    },
    yearsOfExperience: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const learnSkillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    targetProficiency: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    college: {
      type: String,
      required: [true, 'College/University name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department/Major is required'],
      trim: true
    },
    academicYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Masters', 'PhD'],
      default: '3rd Year'
    },
    headline: {
      type: String,
      maxlength: 140,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 1000,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    teachSkills: [teachSkillSchema],
    learnSkills: [learnSkillSchema],
    interests: {
      type: [String],
      default: []
    },
    availability: {
      type: [String],
      default: ['Weekdays Evenings', 'Weekends']
    },
    preferredMode: {
      type: String,
      enum: ['online', 'in-person', 'hybrid'],
      default: 'online'
    },
    location: {
      type: String,
      default: 'Campus'
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    completedExchanges: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

studentProfileSchema.index({ college: 1 });
studentProfileSchema.index({ 'teachSkills.skillName': 1 });
studentProfileSchema.index({ 'learnSkills.skillName': 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
