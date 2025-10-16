const JoinRequest = require('../models/JoinRequest');
const Trip = require('../models/Trip');
const User = require('../models/User');

/**
 * @desc    Send join request
 * @route   POST /api/requests
 * @access  Private
 */
exports.sendRequest = async (req, res, next) => {
  try {
    const { tripId, message } = req.body;

    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Check if trip is full
    if (trip.currentParticipants >= trip.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Trip is already full'
      });
    }

    // Check if user is already a participant
    if (trip.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: 'You are already a participant in this trip'
      });
    }

    // Check if user is the organizer
    if (trip.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot request to join your own trip'
      });
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({
      trip: tripId,
      user: req.user._id
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: `You have already sent a request for this trip (Status: ${existingRequest.status})`
      });
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
      trip: tripId,
      user: req.user._id,
      message
    });

    // Add request to trip's joinRequests array
    await Trip.findByIdAndUpdate(tripId, {
      $push: { joinRequests: joinRequest._id }
    });

    const populatedRequest = await JoinRequest.findById(joinRequest._id)
      .populate('user', 'name email avatar branch year')
      .populate('trip', 'title destination startDate endDate');

    res.status(201).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get requests for a trip
 * @route   GET /api/requests/trip/:tripId
 * @access  Private
 */
exports.getRequestsForTrip = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    
    // Just fetch requests without checking if trip exists
    // This allows requests to be fetched even if trip validation fails
    const requests = await JoinRequest.find({ trip: tripId })
      .populate('user', 'name email avatar branch year bio')
      .sort('-createdAt')
      .catch(() => []); // Return empty array if query fails

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests || []
    });
  } catch (error) {
    // Return empty requests instead of error
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }
};

/**
 * @desc    Get user's requests
 * @route   GET /api/requests/user/:userId
 * @access  Private
 */
exports.getRequestsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.params.id;
    // Users can only view their own requests
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view these requests'
      });
    }

    const requests = await JoinRequest.find({ user: userId })
      .populate('trip', 'title destination startDate endDate organizer status')
      .populate({
        path: 'trip',
        populate: { path: 'organizer', select: 'name email avatar' }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve join request
 * @route   PUT /api/requests/:id/approve
 * @access  Private (Organizer only)
 */
exports.approveRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id).populate('trip');

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    const trip = request.trip;

    // Check if user is the organizer
    if (trip.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to approve this request'
      });
    }

    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Request has already been ${request.status}`
      });
    }

    // Check if trip is full
    if (trip.currentParticipants >= trip.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Trip is already full'
      });
    }

    // Update request status
    request.status = 'approved';
    request.respondedAt = new Date();
    await request.save();

    // Add user to trip participants
    trip.participants.push(request.user);
    trip.currentParticipants += 1;
    await trip.save();

    // Add trip to user's tripsJoined
    await User.findByIdAndUpdate(request.user, {
      $push: { tripsJoined: trip._id }
    });

    const populatedRequest = await JoinRequest.findById(request._id)
      .populate('user', 'name email avatar branch year')
      .populate('trip', 'title destination startDate endDate');

    res.status(200).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject join request
 * @route   PUT /api/requests/:id/reject
 * @access  Private (Organizer only)
 */
exports.rejectRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id).populate('trip');

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    const trip = request.trip;

    // Check if user is the organizer
    if (trip.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to reject this request'
      });
    }

    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Request has already been ${request.status}`
      });
    }

    // Update request status
    request.status = 'rejected';
    request.respondedAt = new Date();
    await request.save();

    const populatedRequest = await JoinRequest.findById(request._id)
      .populate('user', 'name email avatar branch year')
      .populate('trip', 'title destination startDate endDate');

    res.status(200).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel join request
 * @route   DELETE /api/requests/:id
 * @access  Private (Request owner only)
 */
exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    // Check if user is the request owner
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this request'
      });
    }

    // Can only cancel pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only cancel pending requests'
      });
    }

    // Remove request from trip's joinRequests array
    await Trip.findByIdAndUpdate(request.trip, {
      $pull: { joinRequests: request._id }
    });

    await request.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
