const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Message must be associated with a trip']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a sender']
  },
  content: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
MessageSchema.index({ trip: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', MessageSchema);
