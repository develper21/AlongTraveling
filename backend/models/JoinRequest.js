const mongoose = require('mongoose');

const JoinRequestSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Join request must be associated with a trip']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Join request must be associated with a user']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  respondedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only request to join a trip once
JoinRequestSchema.index({ trip: 1, user: 1 }, { unique: true });

// Index for faster queries
JoinRequestSchema.index({ trip: 1, status: 1 });
JoinRequestSchema.index({ user: 1, status: 1 });

// Set respondedAt when status changes from pending
JoinRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.respondedAt) {
    this.respondedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('JoinRequest', JoinRequestSchema);
