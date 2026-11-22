const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const { getRecommendations, calculateCompatibilityNative } = require('../services/aiService');

// @desc    Get AI recommendations for current student
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const myProfile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email role');
    if (!myProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found. Please complete your profile.' });
    }

    // Exclude current user and suspended users
    const suspended = await User.find({ isSuspended: true }).select('_id');
    const excludeIds = [...suspended.map((u) => u._id), req.user.id];

    // Fetch candidate profiles
    const candidates = await StudentProfile.find({ user: { $nin: excludeIds } })
      .populate('user', 'name email role')
      .limit(60);

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        recommendations: [],
        message: 'No candidate peers found yet.'
      });
    }

    const recommendations = await getRecommendations(myProfile.toObject(), candidates.map((c) => c.toObject()));

    // Filter by query parameters if supplied
    let filtered = recommendations;
    if (req.query.minScore) {
      const min = Number(req.query.minScore);
      filtered = filtered.filter((r) => r.compatibilityScore >= min);
    }

    if (req.query.skill) {
      const skillLower = req.query.skill.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.matchingSkills && r.matchingSkills.teachToLearn && r.matchingSkills.teachToLearn.toLowerCase().includes(skillLower)) ||
          (r.candidateProfile.teachSkills || []).some((s) => s.skillName.toLowerCase().includes(skillLower))
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      recommendations: filtered.slice(0, 20)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare compatibility between logged in user and another student
// @route   GET /api/recommendations/compare/:userId
// @access  Private
exports.compareWithUser = async (req, res, next) => {
  try {
    const myProfile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email');
    const targetProfile = await StudentProfile.findOne({ user: req.params.userId }).populate('user', 'name email');

    if (!myProfile || !targetProfile) {
      return res.status(404).json({ success: false, message: 'One or both profiles could not be found' });
    }

    const comparison = calculateCompatibilityNative(myProfile.toObject(), targetProfile.toObject());

    res.status(200).json({
      success: true,
      comparison
    });
  } catch (error) {
    next(error);
  }
};
