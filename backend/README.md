# HopAlong Backend

RESTful API server for the HopAlong travel companion platform, providing authentication, trip management, and real-time communication for IIT Roorkee students.

## Overview

The backend serves as the core data layer and business logic handler for HopAlong. It manages user authentication, trip CRUD operations, join request workflows, and real-time messaging through Socket.IO.

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Socket.IO**: Real-time bidirectional communication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation and sanitization
- **Helmet**: Security headers middleware
- **Morgan**: HTTP request logger

## Installation

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**

Create a `.env` file in the backend root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hopalong
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

**Start MongoDB:**
```bash
# Local MongoDB
mongod

# Or configure MongoDB Atlas connection string in .env
```

**Seed database (optional):**
```bash
npm run seed
```
Creates 6 demo users and 10 sample trips for testing.

**Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will be available at `http://localhost:5000`

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication handlers
│   ├── userController.js     # User management
│   ├── tripController.js     # Trip operations
│   ├── requestController.js  # Join requests
│   └── messageController.js  # Chat messages
├── models/
│   ├── User.js               # User schema
│   ├── Trip.js               # Trip schema
│   ├── JoinRequest.js        # Request schema
│   └── Message.js            # Message schema
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── users.js              # User routes
│   ├── trips.js              # Trip routes
│   ├── requests.js           # Request routes
│   └── messages.js           # Message routes
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── errorHandler.js       # Error handling
│   └── validation.js         # Input validation
├── utils/
│   ├── emailValidator.js     # IITR email validation
│   └── generateToken.js      # JWT generation
├── seeders/
│   └── seedData.js           # Database seeding
├── server.js                 # Express server
└── package.json              # Dependencies
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user (Public)
- `POST /api/auth/login` - Login user (Public)
- `GET /api/auth/me` - Get current user (Private)
- `POST /api/auth/logout` - Logout user (Private)
- `PUT /api/auth/updatepassword` - Update password (Private)

### Trip Routes
- `GET /api/trips` - Get all trips with filters (Public)
- `GET /api/trips/:id` - Get single trip (Public)
- `POST /api/trips` - Create new trip (Private)
- `PUT /api/trips/:id` - Update trip (Private, Owner only)
- `DELETE /api/trips/:id` - Delete trip (Private, Owner only)

**Query Parameters for GET /api/trips:**
- `destination`, `startDate`, `endDate`, `mode`, `type`, `status`
- `search` - Search in title/description/destination
- `page`, `limit` - Pagination (default: page=1, limit=10)

### Join Request Routes
- `POST /api/requests` - Send join request (Private)
- `GET /api/requests/trip/:tripId` - Get trip requests (Private, Organizer)
- `GET /api/requests/user/:userId` - Get user requests (Private, Self)
- `PUT /api/requests/:id/approve` - Approve request (Private, Organizer)
- `PUT /api/requests/:id/reject` - Reject request (Private, Organizer)
- `DELETE /api/requests/:id` - Cancel request (Private, Self)

### Message Routes
- `GET /api/messages/trip/:tripId` - Get trip messages (Private, Participants)
- `POST /api/messages` - Send message (Private, Participants)
- `DELETE /api/messages/:id` - Delete message (Private, Sender)

### User Routes
- `GET /api/users/:id` - Get user profile (Public)
- `PUT /api/users/:id` - Update profile (Private, Self)
- `GET /api/users/:id/trips` - Get created trips (Public)
- `GET /api/users/:id/participations` - Get joined trips (Public)
- `GET /api/users/:id/stats` - Get statistics (Public)

## Socket.IO Events

**Client to Server:**
- `user:join` - Connect with user ID
- `trip:join` / `trip:leave` - Join/leave trip room
- `message:send` - Send message
- `typing:start` / `typing:stop` - Typing indicators

**Server to Client:**
- `message:new` - New message broadcast
- `user:typing` / `user:stopped-typing` - Typing status
- `user:joined` / `user:left` - Room join/leave
- `request:notification` - New join request
- `request:status-update` - Request approved/rejected

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Paginated:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [ ... ]
}
```

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <your-jwt-token>
```

## Database Seeding

**Seed sample data:**
```bash
npm run seed
```

**Clear all data:**
```bash
node seeders/seedData.js -d
```

**Test Credentials:**

After running `npm run seed`, use any of these accounts:
- `rahul.sharma@iitr.ac.in` / `password123`
- `priya.patel@iitr.ac.in` / `password123`
- `arjun.kumar@iitr.ac.in` / `password123`
- `sneha.reddy@iitr.ac.in` / `password123`
- `vikram.singh@iitr.ac.in` / `password123`
- `ananya.gupta@iitr.ac.in` / `password123`

All seeded users share the same password for testing convenience.

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon auto-reload
- `npm run seed` - Populate database with sample data (6 users, 10 trips)

## Environment Variables

| Variable      | Description                  | Default                           |
|---------------|------------------------------|-----------------------------------|
| PORT          | Server port                  | 5000                              |
| NODE_ENV      | Environment mode             | development                       |
| MONGODB_URI   | MongoDB connection           | mongodb://localhost:27017/hopalong|
| JWT_SECRET    | JWT signing key              | (required)                        |
| JWT_EXPIRE    | Token expiration             | 30d                               |
| FRONTEND_URL  | Frontend origin for CORS     | http://localhost:3000             |

## Security

**Implemented security measures:**
- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication
- IITR email domain validation (*.iitr.ac.in)
- Input sanitization with express-validator
- Rate limiting (100 requests per 10 minutes)
- Helmet for HTTP security headers
- CORS configuration
- NoSQL injection prevention via Mongoose

## Error Handling

Centralized error middleware handles:
- Validation errors
- Authentication failures
- Database errors (CastError, duplicates)
- JWT errors
- 404 Not Found
- 500 Internal Server Error

## Development

**Prerequisites:**
- Node.js v14+ (recommended v16+)
- MongoDB running locally or MongoDB Atlas account
- npm (comes with Node.js)

**Tips:**
- Ensure MongoDB is running before starting server
- Never commit `.env` file
- Use Postman/Thunder Client for API testing
- Morgan logs all requests in development
- Use `npm run dev` for hot reload

## Production Deployment

**Checklist:**
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (32+ characters)
- Configure MongoDB Atlas
- Enable HTTPS
- Set proper CORS origins
- Implement logging and monitoring
- Use PM2 process manager

## License

MIT
