const User = require('../models/User');
const Trip = require('../models/Trip');

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('tripsCreated', 'title destination startDate endDate status currentParticipants maxParticipants')
      .populate('tripsJoined', 'title destination startDate endDate status');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this profile'
      });
    }

    const { name, branch, year, bio, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (branch !== undefined) fieldsToUpdate.branch = branch;
    if (year) fieldsToUpdate.year = year;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's trips (created trips)
 * @route   GET /api/users/:id/trips
 * @access  Public
 */
exports.getUserTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ organizer: req.params.id })
      .populate('organizer', 'name email avatar')
      .populate('participants', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's joined trips (as participant)
 * @route   GET /api/users/:id/participations
 * @access  Public
 */
exports.getUserParticipations = async (req, res, next) => {
  try {
    const trips = await Trip.find({
      participants: req.params.id,
      organizer: { $ne: req.params.id }
    })
      .populate('organizer', 'name email avatar')
      .populate('participants', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/:id/stats
 * @access  Public
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const tripsCreated = await Trip.countDocuments({ organizer: req.params.id });
    const tripsJoined = await Trip.countDocuments({
      participants: req.params.id,
      organizer: { $ne: req.params.id }
    });
    const tripsCompleted = await Trip.countDocuments({
      participants: req.params.id,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      data: {
        tripsCreated,
        tripsJoined,
        tripsCompleted,
        totalTrips: tripsCreated + tripsJoined
      }
    });
  } catch (error) {
    next(error);
  }
};
