const LearningProgress = require('../models/LearningProgress');
const ExchangeRequest = require('../models/ExchangeRequest');

// @desc    Get learning progress roadmaps for current user
// @route   GET /api/progress
// @access  Private
exports.getMyProgress = async (req, res, next) => {
  try {
    const list = await LearningProgress.find({
      $or: [{ student: req.user.id }, { mentor: req.user.id }]
    })
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .populate('exchangeRequest', 'offeredSkill requestedSkill status')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: list.length, roadmaps: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress roadmap for a specific exchange request
// @route   GET /api/progress/exchange/:exchangeId
// @access  Private
exports.getProgressByExchange = async (req, res, next) => {
  try {
    const roadmaps = await LearningProgress.find({
      exchangeRequest: req.params.exchangeId
    })
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .populate('notes.author', 'name');

    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    next(error);
  }
};

// @desc    Add milestone to learning progress
// @route   POST /api/progress/:id/milestones
// @access  Private
exports.addMilestone = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Milestone title is required' });
    }

    const progress = await LearningProgress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Learning roadmap not found' });
    }

    const isAuthorized =
      progress.student.toString() === req.user.id.toString() ||
      progress.mentor.toString() === req.user.id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this roadmap' });
    }

    progress.milestones.push({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false
    });

    progress.recalculateProgress();
    await progress.save();

    res.status(201).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle milestone completed status
// @route   PUT /api/progress/:id/milestones/:milestoneId
// @access  Private
exports.toggleMilestone = async (req, res, next) => {
  try {
    const progress = await LearningProgress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const isAuthorized =
      progress.student.toString() === req.user.id.toString() ||
      progress.mentor.toString() === req.user.id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this roadmap' });
    }

    const milestone = progress.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    milestone.completed = !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date() : null;

    progress.recalculateProgress();
    await progress.save();

    res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to learning progress
// @route   POST /api/progress/:id/notes
// @access  Private
exports.addNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Note content cannot be empty' });
    }

    const progress = await LearningProgress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const isAuthorized =
      progress.student.toString() === req.user.id.toString() ||
      progress.mentor.toString() === req.user.id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to add notes to this roadmap' });
    }

    progress.notes.push({
      author: req.user.id,
      content: content.trim(),
      createdAt: new Date()
    });

    await progress.save();
    const populated = await LearningProgress.findById(progress._id).populate('notes.author', 'name');

    res.status(201).json({ success: true, progress: populated });
  } catch (error) {
    next(error);
  }
};
