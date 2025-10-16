const Trip = require('../models/Trip');
const User = require('../models/User');

/**
 * @desc    Get all trips with filters and pagination
 * @route   GET /api/trips
 * @access  Public
 */
exports.getTrips = async (req, res, next) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      mode,
      type,
      status,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }

    if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }

    if (mode) {
      query.mode = mode;
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    // Text search on title, description, and destination
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const trips = await Trip.find(query)
      .populate('organizer', 'name email avatar branch year')
      .populate('participants', 'name email avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Trip.countDocuments(query);

    res.status(200).json({
      success: true,
      count: trips.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single trip
 * @route   GET /api/trips/:id
 * @access  Public
 */
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('organizer', 'name email avatar branch year bio')
      .populate('participants', 'name email avatar branch year')
      .populate({
        path: 'joinRequests',
        populate: { path: 'user', select: 'name email avatar branch year' }
      });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Update trip status based on dates
    trip.updateStatus();
    await trip.save();

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new trip
 * @route   POST /api/trips
 * @access  Private
 */
exports.createTrip = async (req, res, next) => {
  try {
    // Add organizer to request body
    req.body.organizer = req.user._id;
    req.body.participants = [req.user._id];

    const trip = await Trip.create(req.body);

    // Add trip to user's tripsCreated
    await User.findByIdAndUpdate(req.user._id, {
      $push: { tripsCreated: trip._id }
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate('organizer', 'name email avatar branch year')
      .populate('participants', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedTrip
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update trip
 * @route   PUT /api/trips/:id
 * @access  Private (Organizer only)
 */
exports.updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Check if user is the organizer
    if (trip.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this trip'
      });
    }

    // Don't allow updating organizer or participants through this endpoint
    delete req.body.organizer;
    delete req.body.participants;

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('organizer', 'name email avatar branch year')
      .populate('participants', 'name email avatar');

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete trip
 * @route   DELETE /api/trips/:id
 * @access  Private (Organizer only)
 */
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Check if user is the organizer
    if (trip.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this trip'
      });
    }

    // Remove trip from all users' trips arrays
    await User.updateMany(
      { $or: [{ tripsCreated: trip._id }, { tripsJoined: trip._id }] },
      { $pull: { tripsCreated: trip._id, tripsJoined: trip._id } }
    );

    await trip.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get trips by user
 * @route   GET /api/trips/user/:userId
 * @access  Public
 */
exports.getTripsByUser = async (req, res, next) => {
  try {
    const trips = await Trip.find({ organizer: req.params.userId })
      .populate('organizer', 'name email avatar branch year')
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
 * @desc    Get trip statistics
 * @route   GET /api/trips/stats
 * @access  Public
 */
exports.getTripStats = async (req, res, next) => {
  try {
    // Get total number of upcoming trips
    const totalTrips = await Trip.countDocuments({ 
      status: 'upcoming',
      startDate: { $gte: new Date() }
    });

    // Get total participants across all upcoming trips
    const trips = await Trip.find({ 
      status: 'upcoming',
      startDate: { $gte: new Date() }
    }).select('participants estimatedCost');

    let totalParticipants = 0;
    let totalCost = 0;

    trips.forEach(trip => {
      const participants = trip.participants?.length || 0;
      totalParticipants += participants;
      totalCost += Number(trip.estimatedCost) || 0;
    });

    // Calculate average cost per person
    const averageCostPerPerson = totalParticipants > 0 
      ? Math.round(totalCost / totalParticipants)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTrips,
        totalParticipants,
        averageCostPerPerson
      }
    });
  } catch (error) {
    console.error('Error getting trip stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
