const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    exchangeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1 to 5)'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    skillTaught: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ exchangeRequest: 1, reviewer: 1 }, { unique: true });

// Static method to recalculate review stats for student profile
reviewSchema.statics.calculateAverageRating = async function (revieweeId) {
  const stats = await this.aggregate([
    { $match: { reviewee: revieweeId } },
    {
      $group: {
        _id: '$reviewee',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const StudentProfile = mongoose.model('StudentProfile');
  if (stats.length > 0) {
    await StudentProfile.findOneAndUpdate(
      { user: revieweeId },
      {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews
      }
    );
  } else {
    await StudentProfile.findOneAndUpdate(
      { user: revieweeId },
      { averageRating: 0, totalReviews: 0 }
    );
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', reviewSchema);
