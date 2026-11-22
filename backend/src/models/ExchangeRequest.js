const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offeredSkill: {
      type: String,
      required: [true, 'Offered skill is required'],
      trim: true
    },
    requestedSkill: {
      type: String,
      required: [true, 'Requested skill is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },
    initialMessage: {
      type: String,
      default: '',
      trim: true
    },
    proposedSchedule: {
      type: String,
      default: 'Flexible'
    },
    learningMode: {
      type: String,
      enum: ['online', 'in-person', 'hybrid'],
      default: 'online'
    },
    responseNote: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

exchangeRequestSchema.index({ sender: 1, receiver: 1, status: 1 });

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
