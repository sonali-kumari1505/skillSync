const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  { _id: true }
);

const progressNoteSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const learningProgressSchema = new mongoose.Schema(
  {
    exchangeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skill: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      default: 'Skill Learning Roadmap'
    },
    milestones: [milestoneSchema],
    notes: [progressNoteSchema],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

learningProgressSchema.methods.recalculateProgress = function () {
  if (!this.milestones || this.milestones.length === 0) {
    this.progressPercentage = 0;
    return;
  }
  const completedCount = this.milestones.filter((m) => m.completed).length;
  this.progressPercentage = Math.round((completedCount / this.milestones.length) * 100);
};

learningProgressSchema.index({ exchangeRequest: 1, student: 1 });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
