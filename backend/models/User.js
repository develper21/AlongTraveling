const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  branch: {
    type: String,
    default: '',
    maxlength: [100, 'Branch cannot be more than 100 characters']
  },
  year: {
    type: String,
    default: '',
    enum: ['', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni']
  },
  avatar: {
    type: String,
    default: function() {
      // Generate initials from name
      return this.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
  },
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  tripsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],
  tripsJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate avatar from name if not provided
UserSchema.pre('save', function(next) {
  if (!this.avatar || this.avatar.length <= 2) {
    this.avatar = this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
