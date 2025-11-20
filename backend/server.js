const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const colors = require('colors');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

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
const DEFAULT_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
const ADDITIONAL_ORIGINS = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(origin => origin.trim()).filter(Boolean)
  : [];
const ALLOWED_ORIGINS = Array.from(new Set([
  DEFAULT_ORIGIN,
  'http://localhost:3001',
  ...ADDITIONAL_ORIGINS
]));

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
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
      messages: '/api/messages'
    }
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
      timestamp: new Date().toISOString()
    });
  });

  // Leave trip room
  socket.on('trip:leave', (tripId) => {
    socket.leave(`trip:${tripId}`);
    console.log(`Socket ${socket.id} left trip room: ${tripId}`.yellow);
    
    // Notify others in the room
    socket.to(`trip:${tripId}`).emit('user:left', {
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle new message
  socket.on('message:send', (data) => {
    const { tripId, message } = data;
    
    // Broadcast to all users in the trip room
    io.to(`trip:${tripId}`).emit('message:new', {
      ...message,
      timestamp: new Date().toISOString()
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

httpServer.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
  console.log(`API Documentation: http://localhost:${PORT}/`.cyan.underline);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

module.exports = { app, httpServer, io };
