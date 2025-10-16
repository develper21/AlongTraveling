import api from './client';

// ============ AUTHENTICATION API ============

export const authApi = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  updatePassword: async (currentPassword, newPassword) => {
    return await api.put('/auth/updatepassword', { currentPassword, newPassword });
  }
};

// ============ TRIPS API ============

export const tripsApi = {
  getTrips: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.mode) params.append('mode', filters.mode);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    return await api.get(`/trips?${params.toString()}`);
  },

  getTrip: async (id) => {
    return await api.get(`/trips/${id}`);
  },

  createTrip: async (tripData) => {
    return await api.post('/trips', tripData);
  },

  updateTrip: async (id, updates) => {
    return await api.put(`/trips/${id}`, updates);
  },

  deleteTrip: async (id) => {
    return await api.delete(`/trips/${id}`);
  },

  getUserTrips: async (userId) => {
    return await api.get(`/trips/user/${userId}`);
  },

  getTripStats: async () => {
    return await api.get('/trips/stats');
  }
};

// ============ REQUESTS API ============

export const requestsApi = {
  sendRequest: async (tripId, message) => {
    return await api.post('/requests', { trip: tripId, tripId, message });
  },

  getRequestsForTrip: async (tripId) => {
    return await api.get(`/requests/trip/${tripId}`);
  },

  getUserRequests: async (userId) => {
    return await api.get(`/requests/user/${userId}`);
  },

  approveRequest: async (requestId) => {
    return await api.put(`/requests/${requestId}/approve`);
  },

  rejectRequest: async (requestId) => {
    return await api.put(`/requests/${requestId}/reject`);
  },

  cancelRequest: async (requestId) => {
    return await api.delete(`/requests/${requestId}`);
  }
};

// ============ MESSAGES API ============

export const messagesApi = {
  getMessages: async (tripId) => {
    return await api.get(`/messages/trip/${tripId}`);
  },

  sendMessage: async (tripId, content) => {
    return await api.post('/messages', { trip: tripId, content });
  },

  deleteMessage: async (messageId) => {
    return await api.delete(`/messages/${messageId}`);
  }
};

// ============ USERS API ============

export const usersApi = {
  getUser: async (userId) => {
    return await api.get(`/users/${userId}`);
  },

  updateUser: async (userId, updates) => {
    return await api.put(`/users/${userId}`, updates);
  },

  getUserTrips: async (userId) => {
    return await api.get(`/users/${userId}/trips`);
  },

  getUserParticipations: async (userId) => {
    return await api.get(`/users/${userId}/participations`);
  },

  getUserStats: async (userId) => {
    return await api.get(`/users/${userId}/stats`);
  }
};

// Export all as default for convenience
export default {
  auth: authApi,
  trips: tripsApi,
  requests: requestsApi,
  messages: messagesApi,
  users: usersApi
};
