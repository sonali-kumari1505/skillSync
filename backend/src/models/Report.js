const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: [true, 'Report reason is required'],
      enum: [
        'Inappropriate Behavior',
        'No Show / Missed Session',
        'Spam or Harassment',
        'Misrepresented Skills',
        'Other'
      ],
      default: 'Inappropriate Behavior'
    },
    details: {
      type: String,
      required: [true, 'Please provide report details'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending'
    },
    actionTaken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
