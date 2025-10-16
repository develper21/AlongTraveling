# HopAlong Frontend

React-based web application for connecting IIT Roorkee students to find travel companions and organize trips.

## Overview

The frontend provides an intuitive interface for students to browse trips, create new journeys, manage join requests, and communicate with fellow travelers. Built with modern web technologies and designed for optimal user experience across all devices.

## Technology Stack

- **React 18**: Component-based UI library with hooks
- **Vite**: Fast build tool and development server
- **React Router v6**: Client-side routing and navigation
- **Zustand**: Lightweight state management with persistence
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Socket.IO Client**: Real-time bidirectional communication
- **Heroicons**: SVG icon library

## Installation

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**

Create a `.env` file in the frontend root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Start development server:**
```bash
npm run dev
```
Application will be available at `http://localhost:3000`

**Build for production:**
```bash
npm run build     # Creates optimized build in dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint code analysis
```

## Project Structure

```
src/
├── api/
│   ├── client.js         # Axios instance with interceptors
│   ├── config.js         # API configuration and token management
│   ├── api.js            # API endpoint methods
│   └── socket.js         # Socket.IO client setup
├── components/
│   ├── Header.jsx        # Navigation header with user menu
│   ├── Footer.jsx        # Page footer with logo
│   ├── TripCard.jsx      # Trip preview card with actions
│   ├── TripForm.jsx      # Trip creation/edit form
│   ├── ChatPanel.jsx     # Real-time chat interface
│   ├── FiltersBar.jsx    # Trip filtering controls
│   ├── RequestModal.jsx  # Join request modal
│   ├── RequestsList.jsx  # Manage join requests
│   ├── Badge.jsx         # Status badges
│   ├── ErrorBoundary.jsx # Error boundary wrapper
│   └── NotificationToast.jsx # Toast notifications
├── routes/
│   ├── Login.jsx         # Authentication page
│   ├── Register.jsx      # User registration
│   ├── Home.jsx          # Trip browsing with filters
│   ├── CreateTrip.jsx    # Trip creation form
│   ├── TripDetail.jsx    # Trip details and chat
│   ├── Dashboard.jsx     # User dashboard
│   ├── Profile.jsx       # User profile management
│   └── NotFound.jsx      # 404 error page
├── store/
│   └── useStore.js       # Zustand state management
├── assets/
│   ├── logo.png          # HopAlong logo
│   └── ...               # Other static assets
├── data/                 # Mock data (if any)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── App.jsx              # Root component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind
```

## Key Features

**Authentication**
- IITR email validation with subdomain support
- JWT token-based authentication
- Persistent sessions via localStorage
- Protected route access control

**Trip Management**
- Browse and search trips
- Advanced filtering (destination, dates, mode, type)
- Create and edit trips
- Real-time seat availability updates

**Join Requests**
- Send personalized join requests
- Approve/reject workflow
- Status tracking and notifications

**Real-time Chat**
- Socket.IO powered messaging
- Participant-only access
- Typing indicators
- Message history

**User Interface**
- Responsive design for all devices
- Glass-morphism effects and gradients
- Smooth animations and transitions
- Toast notifications for user feedback

## API Integration

The frontend communicates with the backend API using Axios. All authenticated requests include the JWT token in the Authorization header.

**Example API call:**
```javascript
import { tripsApi } from './api/api';

const trips = await tripsApi.getTrips({ destination: 'Rishikesh' });
```

**Available API modules:**
- `authApi`: Authentication (register, login, logout, updatePassword)
- `tripsApi`: Trip management (CRUD, filtering, search)
- `requestsApi`: Join request handling (send, approve, reject)
- `messagesApi`: Chat functionality (send, retrieve, delete)
- `usersApi`: User profile management (view, update, stats)

## State Management

Zustand manages global application state:

```javascript
import useStore from './store/useStore';

function Component() {
  const { currentUser, login, logout } = useStore();
  
  // Use state and actions
}
```

**Persisted state:**
- Authentication status
- Current user information
- JWT token

**In-memory state:**
- Notifications
- Loading states

## Environment Configuration

**Development:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Production:**
```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Create production build
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint code analysis

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Development Guidelines

**Component Structure:**
- Use functional components with hooks
- Keep components focused and reusable
- Extract common logic into custom hooks

**Styling:**
- Use TailwindCSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors

**State Management:**
- Use Zustand for global state
- Keep component state local when possible
- Avoid prop drilling with context or Zustand

**API Calls:**
- Use the centralized API modules
- Handle loading and error states
- Show user feedback for all actions

## Testing

Manual testing workflow:

1. Register new account with IITR email
2. Create a trip with all details
3. Browse and filter trips
4. Send join request from another account
5. Approve request and verify chat access
6. Test real-time messaging

## Deployment

**Build the application:**
```bash
npm run build
```

**Deploy the `dist` folder to:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

**Update environment variables** for production API URL.

## License

MIT
