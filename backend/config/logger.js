const winston = require('winston');
const expressWinston = require('express-winston');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'hopalong-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production then log to the console with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Express middleware for request logging
const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  dynamicMeta: (req, res) => {
    return {
      responseTime: res.responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    };
  },
});

// Express middleware for error logging
const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}}',
});

// Custom logging functions
const logUserAction = (userId, action, details = {}) => {
  logger.info('User Action', {
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
  });
};

const logSecurityEvent = (event, details = {}) => {
  logger.warn('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

const logSystemEvent = (event, details = {}) => {
  logger.info('System Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

const logError = (error, context = {}) => {
  logger.error('Application Error', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Database logging
const logDatabaseQuery = (query, duration, resultCount = null) => {
  logger.debug('Database Query', {
    query: query.toString(),
    duration: `${duration}ms`,
    resultCount,
    timestamp: new Date().toISOString(),
  });
};

// Performance logging
const logPerformance = (operation, duration, details = {}) => {
  logger.info('Performance', {
    operation,
    duration: `${duration}ms`,
    details,
    timestamp: new Date().toISOString(),
  });
};

// API logging
const logApiCall = (req, res, responseTime) => {
  logger.info('API Call', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user ? req.user._id : null,
    timestamp: new Date().toISOString(),
  });
};

// Socket.IO logging
const logSocketEvent = (event, socketId, data = {}) => {
  logger.info('Socket Event', {
    event,
    socketId,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Business logic logging
const logBusinessEvent = (event, details = {}) => {
  logger.info('Business Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Export all logging functions and middleware
module.exports = {
  logger,
  requestLogger,
  errorLogger,
  logUserAction,
  logSecurityEvent,
  logSystemEvent,
  logError,
  logDatabaseQuery,
  logPerformance,
  logApiCall,
  logSocketEvent,
  logBusinessEvent,
};
