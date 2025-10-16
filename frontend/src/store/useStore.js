import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAuthToken, removeAuthToken } from '../api/config'
import { connectSocket, disconnectSocket } from '../api/socket'

// Global store using Zustand with persistence
const useStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      isAuthenticated: false,
      currentUser: null,
      token: null,

      // Login action - stores token and user, connects socket
      login: (userData, token) => {
        setAuthToken(token);
        set({ 
          isAuthenticated: true, 
          currentUser: userData,
          token 
        });
        
        // Connect to Socket.IO
        if (userData._id) {
          connectSocket(userData._id);
        }
      },

      // Logout action - clears token, disconnects socket
      logout: () => {
        removeAuthToken();
        disconnectSocket();
        set({ 
          isAuthenticated: false, 
          currentUser: null,
          token: null 
        });
      },

      // Update current user
      updateCurrentUser: (user) => set({ currentUser: user }),

      // Notifications (in-memory)
      notifications: [],
      
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { 
          id: Date.now(), 
          ...notification,
          timestamp: new Date()
        }]
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      clearNotifications: () => set({ notifications: [] }),

      // UI state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'hopalong-auth', // localStorage key
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        currentUser: state.currentUser,
        token: state.token
      }),
    }
  )
)

export default useStore
