const { body, param, query, validationResult } = require('express-validator');
const { isIITREmail } = require('../utils/emailValidator');

/**
 * Check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }
  next();
};

/**
 * User Registration Validation
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .custom((value) => {
      if (!isIITREmail(value)) {
        throw new Error('Please use a valid IITR email address (@iitr.ac.in)');
      }
      return true;
    })
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

/**
 * User Login Validation
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Update User Validation
 */
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('branch')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Branch cannot be more than 100 characters'),
  body('year')
    .optional()
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'])
    .withMessage('Invalid year'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot be more than 500 characters'),
  validate
];

/**
 * Create Trip Validation
 */
const createTripValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('destination')
    .trim()
    .notEmpty().withMessage('Destination is required')
    .isLength({ min: 2, max: 100 }).withMessage('Destination must be between 2 and 100 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Please provide a valid start date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('maxParticipants')
    .notEmpty().withMessage('Maximum participants is required')
    .isInt({ min: 2, max: 50 }).withMessage('Maximum participants must be between 2 and 50'),
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Estimated cost cannot be negative'),
  body('mode')
    .optional()
    .isIn(['Bus', 'Train', 'Flight', 'Car', 'Bike', 'Other']).withMessage('Invalid travel mode'),
  body('type')
    .optional()
    .isIn(['Adventure', 'Leisure', 'Cultural', 'Business', 'Educational', 'Other']).withMessage('Invalid trip type'),
  validate
];

/**
 * Update Trip Validation
 */
const updateTripValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('destination')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Destination must be between 2 and 100 characters'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Please provide a valid start date'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('Please provide a valid end date'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 2, max: 50 }).withMessage('Maximum participants must be between 2 and 50'),
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Estimated cost cannot be negative'),
  body('mode')
    .optional()
    .isIn(['Bus', 'Train', 'Flight', 'Car', 'Bike', 'Other']).withMessage('Invalid travel mode'),
  body('type')
    .optional()
    .isIn(['Adventure', 'Leisure', 'Cultural', 'Business', 'Educational', 'Other']).withMessage('Invalid trip type'),
  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('Invalid status'),
  validate
];

/**
 * Join Request Validation
 */
const joinRequestValidation = [
  body('tripId')
    .notEmpty().withMessage('Trip ID is required')
    .isMongoId().withMessage('Invalid trip ID'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 500 }).withMessage('Message must be between 10 and 500 characters'),
  validate
];

/**
 * Message Validation
 */
const messageValidation = [
  body('tripId')
    .notEmpty().withMessage('Trip ID is required')
    .isMongoId().withMessage('Invalid trip ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  validate
];

/**
 * MongoDB ID Validation
 */
const mongoIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  createTripValidation,
  updateTripValidation,
  joinRequestValidation,
  messageValidation,
  mongoIdValidation,
  validate
};
