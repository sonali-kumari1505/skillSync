const ExchangeRequest = require('../models/ExchangeRequest');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const LearningProgress = require('../models/LearningProgress');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// Helper to notify via socket if socket helper exists
const emitSocketNotification = (req, recipientId, notification) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${recipientId}`).emit('notification', notification);
  }
};

// @desc    Send a new skill exchange request
// @route   POST /api/requests
// @access  Private
exports.sendRequest = async (req, res, next) => {
  try {
    const { receiverId, offeredSkill, requestedSkill, initialMessage, proposedSchedule, learningMode } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    if (receiverId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot send an exchange request to yourself' });
    }

    if (!offeredSkill || !requestedSkill) {
      return res.status(400).json({
        success: false,
        message: 'Both offered skill and requested skill must be specified'
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.isSuspended) {
      return res.status(404).json({ success: false, message: 'Recipient student not found or suspended' });
    }

    // Check for duplicate pending requests between the two users
    const existing = await ExchangeRequest.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId, status: 'pending' },
        { sender: receiverId, receiver: req.user.id, status: 'pending' }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'There is already a pending exchange request between you and this student'
      });
    }

    const request = await ExchangeRequest.create({
      sender: req.user.id,
      receiver: receiverId,
      offeredSkill: offeredSkill.trim(),
      requestedSkill: requestedSkill.trim(),
      initialMessage: initialMessage ? initialMessage.trim() : '',
      proposedSchedule: proposedSchedule || 'Flexible',
      learningMode: learningMode || 'online',
      status: 'pending'
    });

    const populated = await ExchangeRequest.findById(request._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    // Create Notification for recipient
    const notification = await Notification.create({
      recipient: receiverId,
      sender: req.user.id,
      type: 'exchange_request',
      title: 'New Skill Exchange Request',
      message: `${req.user.name} wants to exchange skills: ${offeredSkill} ⇄ ${requestedSkill}`,
      link: '/dashboard/requests'
    });

    emitSocketNotification(req, receiverId, notification);

    res.status(201).json({ success: true, request: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's exchange requests (incoming, outgoing, all)
// @route   GET /api/requests
// @access  Private
exports.getMyRequests = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const filter = {};

    if (type === 'incoming') {
      filter.receiver = req.user.id;
    } else if (type === 'outgoing') {
      filter.sender = req.user.id;
    } else {
      filter.$or = [{ sender: req.user.id }, { receiver: req.user.id }];
    }

    if (status) {
      filter.status = status;
    }

    const requests = await ExchangeRequest.find(filter)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
exports.getRequestById = async (req, res, next) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const isSender = request.sender._id.toString() === req.user.id.toString();
    const isReceiver = request.receiver._id.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSender && !isReceiver && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status (accept, reject, cancel, complete)
// @route   PUT /api/requests/:id/status
// @access  Private
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status, responseNote } = req.body;
    const validStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update requested' });
    }

    const request = await ExchangeRequest.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const isSender = request.sender._id.toString() === req.user.id.toString();
    const isReceiver = request.receiver._id.toString() === req.user.id.toString();

    if (!isSender && !isReceiver && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this request' });
    }

    // Permission logic per state transition
    if (status === 'accepted' || status === 'rejected') {
      if (!isReceiver && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only the recipient can accept or reject this request' });
      }
      if (request.status !== 'pending') {
        return res.status(400).json({ success: false, message: `Cannot change status of a ${request.status} request` });
      }
    }

    if (status === 'cancelled') {
      if (!isSender && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only the sender can cancel this request' });
      }
      if (request.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled' });
      }
    }

    if (status === 'completed') {
      if (request.status !== 'accepted') {
        return res.status(400).json({ success: false, message: 'Only accepted exchanges can be marked completed' });
      }
      request.completedAt = new Date();
    }

    request.status = status;
    if (responseNote) request.responseNote = responseNote.trim();
    await request.save();

    // Side-effects when request is ACCEPTED:
    if (status === 'accepted') {
      // 1. Create Conversation if not already existing
      let conversation = await Conversation.findOne({ exchangeRequest: request._id });
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [request.sender._id, request.receiver._id],
          exchangeRequest: request._id,
          lastActivity: new Date()
        });
      }

      // 2. Initialize Learning Progress Roadmaps for both participants
      const existingProg1 = await LearningProgress.findOne({ exchangeRequest: request._id, student: request.sender._id });
      if (!existingProg1) {
        await LearningProgress.create({
          exchangeRequest: request._id,
          student: request.sender._id,
          mentor: request.receiver._id,
          skill: request.requestedSkill,
          title: `Learning ${request.requestedSkill} Roadmap`,
          milestones: [
            { title: 'Initial Knowledge Assessment & Setup', description: 'Review prerequisites and goals', completed: false },
            { title: 'Core Concepts & Fundamentals', description: 'Master foundational concepts', completed: false },
            { title: 'Hands-on Practice & Project', description: 'Apply skills to real exercise', completed: false },
            { title: 'Final Review & Wrap-up', description: 'Evaluate learnings and complete exchange', completed: false }
          ]
        });
      }

      const existingProg2 = await LearningProgress.findOne({ exchangeRequest: request._id, student: request.receiver._id });
      if (!existingProg2) {
        await LearningProgress.create({
          exchangeRequest: request._id,
          student: request.receiver._id,
          mentor: request.sender._id,
          skill: request.offeredSkill,
          title: `Learning ${request.offeredSkill} Roadmap`,
          milestones: [
            { title: 'Initial Knowledge Assessment & Setup', description: 'Review prerequisites and goals', completed: false },
            { title: 'Core Concepts & Fundamentals', description: 'Master foundational concepts', completed: false },
            { title: 'Hands-on Practice & Project', description: 'Apply skills to real exercise', completed: false },
            { title: 'Final Review & Wrap-up', description: 'Evaluate learnings and complete exchange', completed: false }
          ]
        });
      }

      // 3. Notify sender
      const notification = await Notification.create({
        recipient: request.sender._id,
        sender: req.user.id,
        type: 'request_accepted',
        title: 'Exchange Request Accepted!',
        message: `${req.user.name} accepted your skill exchange for ${request.offeredSkill} ⇄ ${request.requestedSkill}. Chat is now unlocked!`,
        link: '/dashboard/chat'
      });
      emitSocketNotification(req, request.sender._id, notification);
    }

    if (status === 'rejected') {
      const notification = await Notification.create({
        recipient: request.sender._id,
        sender: req.user.id,
        type: 'request_rejected',
        title: 'Exchange Request Declined',
        message: `${req.user.name} was unable to accept your skill exchange request at this time.`,
        link: '/dashboard/requests'
      });
      emitSocketNotification(req, request.sender._id, notification);
    }

    if (status === 'completed') {
      // Increment completed exchanges on both student profiles
      await StudentProfile.findOneAndUpdate({ user: request.sender._id }, { $inc: { completedExchanges: 1 } });
      await StudentProfile.findOneAndUpdate({ user: request.receiver._id }, { $inc: { completedExchanges: 1 } });

      const otherPartyId = isSender ? request.receiver._id : request.sender._id;
      const notification = await Notification.create({
        recipient: otherPartyId,
        sender: req.user.id,
        type: 'exchange_completed',
        title: 'Exchange Completed! 🎉',
        message: `Your exchange for ${request.offeredSkill} ⇄ ${request.requestedSkill} is completed. Please leave a rating & review!`,
        link: `/dashboard/requests`
      });
      emitSocketNotification(req, otherPartyId, notification);
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};
