const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const customLogger = require('./utils/logger');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');

// Redis connection
const { connectRedis } = require('./config/redis');

// Swagger documentation
const { specs, swaggerUi } = require('./config/swagger');

// Logger configuration
const { logger, requestLogger, logSecurityEvent } = require('./config/logger');

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const requestRoutes = require('./routes/requests');
const messageRoutes = require('./routes/messages');

// Middleware files
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Determine allowed origins for CORS
const DEFAULT_ORIGIN = process.env.FRONTEND_URL;
const ADDITIONAL_ORIGINS = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];
const ALLOWED_ORIGINS = Array.from(
  new Set([
    DEFAULT_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', // Vite default
    'https://alontraveling.netlify.app',
    'https://www.alontraveling.netlify.app',
    'https://alongtraveling.netlify.app',
    'https://www.alongtraveling.netlify.app',
    ...ADDITIONAL_ORIGINS,
  ])
);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS with comprehensive configuration
app.use(
  cors({
    origin(origin, callback) {
      // In production, allow all origins to prevent CORS issues
      if (process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      // Log the blocked origin for debugging
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Additional CORS headers for production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Request logging middleware
app.use(requestLogger);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res) => {
    logSecurityEvent('rate_limit_exceeded', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

app.use('/api/', limiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);

// Swagger API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'HopAlong API Documentation',
  })
);

// Health check route for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Health check route for API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HopAlong API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      trips: '/api/trips',
      requests: '/api/requests',
      messages: '/api/messages',
    },
  });
});

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`.green);

  // User joins with their ID
  socket.on('user:join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} connected with socket ${socket.id}`.cyan);
  });

  // Join trip room
  socket.on('trip:join', (tripId) => {
    socket.join(`trip:${tripId}`);
    console.log(`Socket ${socket.id} joined trip room: ${tripId}`.yellow);

    // Notify others in the room
    socket.to(`trip:${tripId}`).emit('user:joined', {
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });
  });

  // Leave trip room
  socket.on('trip:leave', (tripId) => {
    socket.leave(`trip:${tripId}`);
    console.log(`Socket ${socket.id} left trip room: ${tripId}`.yellow);

    // Notify others in the room
    socket.to(`trip:${tripId}`).emit('user:left', {
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle new message
  socket.on('message:send', (data) => {
    const { tripId, message } = data;

    // Broadcast to all users in the trip room
    io.to(`trip:${tripId}`).emit('message:new', {
      ...message,
      timestamp: new Date().toISOString(),
    });

    console.log(`Message sent to trip ${tripId}`.magenta);
  });

  // Typing indicator
  socket.on('typing:start', ({ tripId, userId, userName }) => {
    socket.to(`trip:${tripId}`).emit('user:typing', { userId, userName });
  });

  socket.on('typing:stop', ({ tripId, userId }) => {
    socket.to(`trip:${tripId}`).emit('user:stopped-typing', { userId });
  });

  // Handle request notifications
  socket.on('request:new', ({ organizerId, request }) => {
    const organizerSocketId = connectedUsers.get(organizerId);
    if (organizerSocketId) {
      io.to(organizerSocketId).emit('request:notification', request);
      console.log(`Request notification sent to organizer ${organizerId}`.blue);
    }
  });

  // Handle request response notifications
  socket.on('request:response', ({ userId, response }) => {
    const userSocketId = connectedUsers.get(userId);
    if (userSocketId) {
      io.to(userSocketId).emit('request:status-update', response);
      console.log(`Request response sent to user ${userId}`.blue);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`.red);
    }
    console.log(`Client disconnected: ${socket.id}`.red);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handler middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Graceful startup
const startServer = async () => {
  try {
    customLogger.info('Starting HopAlong Backend Server...');
    
    // Test database connection
    await connectDB();
    customLogger.success('Database connection verified');

    // Connect to Redis
    await connectRedis();

    // Initialize Socket.IO
    customLogger.service('Socket.IO', 'started');

    // Load routes
    customLogger.route('POST', '/api/auth/register');
    customLogger.route('POST', '/api/auth/login');
    customLogger.route('GET', '/api/auth/me');
    customLogger.route('POST', '/api/auth/logout');
    customLogger.route('PUT', '/api/auth/password');
    customLogger.route('GET', '/api/users/:id');
    customLogger.route('PUT', '/api/users/:id');
    customLogger.route('GET', '/api/users/:id/trips');
    customLogger.route('GET', '/api/users/:id/stats');
    customLogger.route('GET', '/api/trips');
    customLogger.route('POST', '/api/trips');
    customLogger.route('GET', '/api/trips/:id');
    customLogger.route('PUT', '/api/trips/:id');
    customLogger.route('DELETE', '/api/trips/:id');
    customLogger.route('POST', '/api/requests');
    customLogger.route('GET', '/api/requests/trip/:tripId');
    customLogger.route('GET', '/api/requests/user/:userId');
    customLogger.route('PUT', '/api/requests/:id/approve');
    customLogger.route('PUT', '/api/requests/:id/reject');
    customLogger.route('DELETE', '/api/requests/:id');
    customLogger.route('POST', '/api/messages');
    customLogger.route('GET', '/api/messages/trip/:tripId');

    // Load middleware
    customLogger.middleware('CORS');
    customLogger.middleware('Helmet Security');
    customLogger.middleware('Morgan Logger');
    customLogger.middleware('Compression');
    customLogger.middleware('Rate Limiting');
    customLogger.middleware('Request Logger');
    customLogger.middleware('Error Handler');

    // Services
    customLogger.service('JWT Authentication', 'configured');
    customLogger.service('Winston Logger', 'configured');
    customLogger.service('Swagger Documentation', 'configured');
    customLogger.service('API Documentation', `available at http://localhost:${PORT}/api-docs`);

    httpServer.listen(PORT, '0.0.0.0', () => {
      customLogger.success(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      customLogger.info(`API Base URL: http://localhost:${PORT}/api`);
      
      // Signal that server is ready
      if (process.env.NODE_ENV === 'production') {
        customLogger.success('Server is ready to accept connections');
      } else {
        customLogger.info('Development mode - all origins allowed');
      }
    });

    // Handle server errors
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        customLogger.error(`Port ${PORT} is already in use`);
      } else {
        customLogger.error(`Server error: ${error.message}`);
      }
      process.exit(1);
    });
  } catch (error) {
    customLogger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection', {
    error: err.message,
    stack: err.stack,
    promise: promise.toString(),
  });
  customLogger.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack,
  });
  customLogger.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  customLogger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated');
    customLogger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  customLogger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated');
    customLogger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = { app, httpServer, io };
