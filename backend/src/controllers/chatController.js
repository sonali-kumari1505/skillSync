const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ExchangeRequest = require('../models/ExchangeRequest');
const Notification = require('../models/Notification');

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name email role')
      .populate('exchangeRequest', 'offeredSkill requestedSkill status')
      .populate('lastMessage')
      .sort({ lastActivity: -1 });

    res.status(200).json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id.toString()
    );
    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view messages in this conversation' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      },
      {
        $addToSet: { readBy: req.user.id }
      }
    );

    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in conversation
// @route   POST /api/chat/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const conversation = await Conversation.findById(req.params.id).populate('exchangeRequest');
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to send messages in this conversation' });
    }

    // Verify exchange request is accepted or completed
    if (
      conversation.exchangeRequest &&
      conversation.exchangeRequest.status !== 'accepted' &&
      conversation.exchangeRequest.status !== 'completed'
    ) {
      return res.status(403).json({
        success: false,
        message: `Messaging is restricted until the exchange request is accepted. Current status: ${conversation.exchangeRequest.status}`
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content: content.trim(),
      readBy: [req.user.id]
    });

    conversation.lastMessage = message._id;
    conversation.lastActivity = new Date();
    await conversation.save();

    const populated = await Message.findById(message._id).populate('sender', 'name email');

    // Socket.IO real-time emission
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation_${conversation._id}`).emit('new_message', populated);

      // Notify the other participant
      const otherParticipant = conversation.participants.find(
        (p) => p.toString() !== req.user.id.toString()
      );
      if (otherParticipant) {
        io.to(`user_${otherParticipant}`).emit('notification', {
          recipient: otherParticipant,
          sender: req.user.id,
          type: 'new_message',
          title: `New message from ${req.user.name}`,
          message: content.length > 60 ? `${content.substring(0, 57)}...` : content,
          link: '/dashboard/chat',
          createdAt: new Date()
        });
      }
    }

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    next(error);
  }
};
