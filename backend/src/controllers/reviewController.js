const Review = require('../models/Review');
const ExchangeRequest = require('../models/ExchangeRequest');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

// @desc    Create review for completed exchange
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { exchangeRequestId, rating, comment } = req.body;

    if (!exchangeRequestId) {
      return res.status(400).json({ success: false, message: 'Exchange request ID is required' });
    }

    const numRating = Number(rating);
    // Boundary value testing check from Experiment 10 (ratings < 1 or > 5 return 422)
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(422).json({ success: false, message: 'Invalid rating range (1-5)' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Written feedback comment is required' });
    }

    const exchange = await ExchangeRequest.findById(exchangeRequestId);
    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    // Only allow reviews for completed exchanges
    if (exchange.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed exchanges'
      });
    }

    const isSender = exchange.sender.toString() === req.user.id.toString();
    const isReceiver = exchange.receiver.toString() === req.user.id.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ success: false, message: 'You are not a participant in this exchange' });
    }

    const revieweeId = isSender ? exchange.receiver : exchange.sender;
    const skillTaught = isSender ? exchange.requestedSkill : exchange.offeredSkill;

    // Check if review already submitted
    const existing = await Review.findOne({
      exchangeRequest: exchangeRequestId,
      reviewer: req.user.id
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this exchange'
      });
    }

    const review = await Review.create({
      exchangeRequest: exchangeRequestId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating: numRating,
      comment: comment.trim(),
      skillTaught
    });

    const populated = await Review.findById(review._id)
      .populate('reviewer', 'name email')
      .populate('reviewee', 'name email');

    // Notify reviewee
    await Notification.create({
      recipient: revieweeId,
      sender: req.user.id,
      type: 'new_review',
      title: 'New Review Received! ⭐',
      message: `${req.user.name} gave you a ${numRating}-star rating: "${comment.trim().substring(0, 50)}..."`,
      link: `/dashboard/profile`
    });

    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
