const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a trip title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true,
    maxlength: [100, 'Destination cannot be more than 100 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please add maximum participants'],
    min: [2, 'Maximum participants must be at least 2'],
    max: [50, 'Maximum participants cannot exceed 50']
  },
  currentParticipants: {
    type: Number,
    default: 1,
    min: [1, 'Current participants must be at least 1']
  },
  estimatedCost: {
    type: Number,
    default: 0,
    min: [0, 'Estimated cost cannot be negative']
  },
  mode: {
    type: String,
    default: 'Bus'
  },
  type: {
    type: String,
    default: 'Leisure'
  },
  status: {
    type: String,
    enum: {
      values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'upcoming'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Trip must have an organizer']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  joinRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JoinRequest'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if trip is full
TripSchema.virtual('isFull').get(function() {
  return this.currentParticipants >= this.maxParticipants;
});

// Virtual for available seats
TripSchema.virtual('availableSeats').get(function() {
  return this.maxParticipants - this.currentParticipants;
});

// Index for faster queries
TripSchema.index({ destination: 'text', title: 'text', description: 'text' });
TripSchema.index({ startDate: 1, endDate: 1 });

// Add organizer to participants when creating trip
TripSchema.pre('save', function(next) {
  if (this.isNew && !this.participants.includes(this.organizer)) {
    this.participants.push(this.organizer);
  }
  next();
});

// Update trip status based on dates
TripSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (this.status === 'cancelled') {
    return this.status;
  }
  
  if (now >= this.startDate && now <= this.endDate) {
    this.status = 'ongoing';
  } else if (now > this.endDate) {
    this.status = 'completed';
  } else {
    this.status = 'upcoming';
  }
  
  return this.status;
};

// Add indexes for frequently queried fields

// Add text index for search
TripSchema.index(
  { 
    title: 'text',
    description: 'text',
    destination: 'text',
    'location.formattedAddress': 'text'
  },
  {
    weights: {
      title: 3,
      destination: 3,
      'location.formattedAddress': 2,
      description: 1
    },
    name: 'tripTextSearch'
  }
);

module.exports = mongoose.model('Trip', TripSchema);
