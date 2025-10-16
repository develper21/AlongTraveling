import io from 'socket.io-client';
import { SOCKET_URL } from './config';

let socket = null;

// Initialize Socket.IO connection
export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

// Connect socket
export const connectSocket = (userId) => {
  const sock = initSocket();
  sock.connect();
  sock.emit('user:join', userId);
  return sock;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

// Get socket instance
export const getSocket = () => {
  return socket;
};

// ============ TRIP ROOM EVENTS ============

export const joinTripRoom = (tripId) => {
  if (socket) {
    socket.emit('trip:join', tripId);
  }
};

export const leaveTripRoom = (tripId) => {
  if (socket) {
    socket.emit('trip:leave', tripId);
  }
};

// ============ MESSAGE EVENTS ============

export const sendMessageSocket = (tripId, message) => {
  if (socket) {
    socket.emit('message:send', { tripId, message });
  }
};

export const onNewMessage = (callback) => {
  if (socket) {
    socket.on('message:new', callback);
  }
};

export const offNewMessage = () => {
  if (socket) {
    socket.off('message:new');
  }
};

// ============ TYPING INDICATORS ============

export const startTyping = (tripId, userId, userName) => {
  if (socket) {
    socket.emit('typing:start', { tripId, userId, userName });
  }
};

export const stopTyping = (tripId, userId) => {
  if (socket) {
    socket.emit('typing:stop', { tripId, userId });
  }
};

export const onUserTyping = (callback) => {
  if (socket) {
    socket.on('user:typing', callback);
  }
};

export const onUserStoppedTyping = (callback) => {
  if (socket) {
    socket.on('user:stopped-typing', callback);
  }
};

// ============ USER PRESENCE ============

export const onUserJoined = (callback) => {
  if (socket) {
    socket.on('user:joined', callback);
  }
};

export const onUserLeft = (callback) => {
  if (socket) {
    socket.on('user:left', callback);
  }
};

// ============ REQUEST NOTIFICATIONS ============

export const sendRequestNotification = (organizerId, request) => {
  if (socket) {
    socket.emit('request:new', { organizerId, request });
  }
};

export const sendRequestResponse = (userId, response) => {
  if (socket) {
    socket.emit('request:response', { userId, response });
  }
};

export const onRequestNotification = (callback) => {
  if (socket) {
    socket.on('request:notification', callback);
  }
};

export const onRequestStatusUpdate = (callback) => {
  if (socket) {
    socket.on('request:status-update', callback);
  }
};

// Clean up all listeners
export const cleanupSocketListeners = () => {
  if (socket) {
    socket.off('message:new');
    socket.off('user:typing');
    socket.off('user:stopped-typing');
    socket.off('user:joined');
    socket.off('user:left');
    socket.off('request:notification');
    socket.off('request:status-update');
  }
};

export default {
  initSocket,
  connectSocket,
  disconnectSocket,
  getSocket,
  joinTripRoom,
  leaveTripRoom,
  sendMessageSocket,
  onNewMessage,
  offNewMessage,
  startTyping,
  stopTyping,
  onUserTyping,
  onUserStoppedTyping,
  onUserJoined,
  onUserLeft,
  sendRequestNotification,
  sendRequestResponse,
  onRequestNotification,
  onRequestStatusUpdate,
  cleanupSocketListeners
};
