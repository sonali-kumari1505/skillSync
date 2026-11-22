const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ExchangeRequest = require('../models/ExchangeRequest');
const Message = require('../models/Message');
const Review = require('../models/Review');
const Report = require('../models/Report');
const Skill = require('../models/Skill');

// @desc    Get aggregate platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentUsers = await User.countDocuments({ role: 'student' });
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    const totalRequests = await ExchangeRequest.countDocuments();
    const pendingRequests = await ExchangeRequest.countDocuments({ status: 'pending' });
    const acceptedRequests = await ExchangeRequest.countDocuments({ status: 'accepted' });
    const completedRequests = await ExchangeRequest.countDocuments({ status: 'completed' });
    const rejectedRequests = await ExchangeRequest.countDocuments({ status: 'rejected' });

    const totalMessages = await Message.countDocuments();
    const totalReviews = await Review.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalSkills = await Skill.countDocuments();

    const topSkills = await Skill.find().sort({ popularity: -1 }).limit(8);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: studentUsers,
          suspended: suspendedUsers
        },
        exchanges: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          completed: completedRequests,
          rejected: rejectedRequests
        },
        engagement: {
          totalMessages,
          totalReviews,
          pendingReports,
          totalSkills
        },
        topSkills
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all users with profile data
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, isSuspended, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isSuspended !== undefined) filter.isSuspended = isSuspended === 'true';

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Attach student profile info
    const userIds = users.map((u) => u._id);
    const profiles = await StudentProfile.find({ user: { $in: userIds } });
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    const enrichedUsers = users.map((u) => ({
      ...u.toObject(),
      profile: profileMap[u._id.toString()] || null
    }));

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend or Reactivate user account
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
exports.toggleUserSuspension = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrator accounts cannot be suspended' });
    }

    user.isSuspended = !user.isSuspended;
    // Also reset lock status if reactivating
    if (!user.isSuspended) {
      user.isLocked = false;
      user.failedLoginAttempts = 0;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isSuspended ? 'suspended' : 'reactivated'}`,
      isSuspended: user.isSuspended
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit report against user/content
// @route   POST /api/admin/reports
// @access  Private (Any authenticated student)
exports.createReport = async (req, res, next) => {
  try {
    const { reportedUserId, reason, details } = req.body;

    if (!reportedUserId || !reason || !details) {
      return res.status(400).json({ success: false, message: 'Please provide reportedUserId, reason, and details' });
    }

    const report = await Report.create({
      reporter: req.user.id,
      reportedUser: reportedUserId,
      reason,
      details: details.trim(),
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully for admin review', report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email isSuspended')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status and action taken
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status, actionTaken } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (status) report.status = status;
    if (actionTaken) report.actionTaken = actionTaken;
    await report.save();

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
