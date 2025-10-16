import { randomDelay, generateId } from '../lib/utils'
import { mockUsers, mockTrips, mockRequests, mockMessages } from '../data/mockData'

// In-memory data store (mutable for CRUD operations)
let users = [...mockUsers]
let trips = [...mockTrips]
let requests = [...mockRequests]
let messages = [...mockMessages]

// ============ TRIPS API ============

export const getTrips = async (filters = {}) => {
  await randomDelay()
  
  let filteredTrips = [...trips]

  // Apply filters
  if (filters.destination) {
    filteredTrips = filteredTrips.filter(trip =>
      trip.destination.toLowerCase().includes(filters.destination.toLowerCase())
    )
  }

  if (filters.dateFrom) {
    filteredTrips = filteredTrips.filter(trip =>
      new Date(trip.dateFrom) >= new Date(filters.dateFrom)
    )
  }

  if (filters.dateTo) {
    filteredTrips = filteredTrips.filter(trip =>
      new Date(trip.dateTo) <= new Date(filters.dateTo)
    )
  }

  if (filters.travelMode) {
    filteredTrips = filteredTrips.filter(trip =>
      trip.travelMode === filters.travelMode
    )
  }

  if (filters.tripType) {
    filteredTrips = filteredTrips.filter(trip =>
      trip.tripType === filters.tripType
    )
  }

  // Sort by creation date (newest first)
  filteredTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Add owner details
  const tripsWithOwner = filteredTrips.map(trip => ({
    ...trip,
    owner: users.find(u => u.id === trip.ownerId)
  }))

  return {
    success: true,
    data: tripsWithOwner,
    total: tripsWithOwner.length
  }
}

export const getTrip = async (id) => {
  await randomDelay()
  
  const trip = trips.find(t => t.id === id)
  
  if (!trip) {
    return {
      success: false,
      error: 'Trip not found'
    }
  }

  // Add owner and participants details
  const owner = users.find(u => u.id === trip.ownerId)
  const participants = trip.participants.map(pid => 
    users.find(u => u.id === pid)
  )

  return {
    success: true,
    data: {
      ...trip,
      owner,
      participants
    }
  }
}

export const createTrip = async (tripData) => {
  await randomDelay()

  const newTrip = {
    id: generateId(),
    ...tripData,
    seatsOccupied: 1, // Owner takes one seat
    status: 'open',
    participants: [tripData.ownerId],
    createdAt: new Date().toISOString()
  }

  trips.push(newTrip)

  return {
    success: true,
    data: newTrip
  }
}

export const updateTrip = async (id, updates) => {
  await randomDelay()

  const index = trips.findIndex(t => t.id === id)
  
  if (index === -1) {
    return {
      success: false,
      error: 'Trip not found'
    }
  }

  trips[index] = { ...trips[index], ...updates }

  return {
    success: true,
    data: trips[index]
  }
}

export const deleteTrip = async (id) => {
  await randomDelay()

  const index = trips.findIndex(t => t.id === id)
  
  if (index === -1) {
    return {
      success: false,
      error: 'Trip not found'
    }
  }

  trips.splice(index, 1)

  return {
    success: true
  }
}

// ============ REQUESTS API ============

export const sendRequest = async (tripId, message, userId) => {
  await randomDelay()

  // Check if request already exists
  const existingRequest = requests.find(
    r => r.tripId === tripId && r.userId === userId
  )

  if (existingRequest) {
    return {
      success: false,
      error: 'Request already sent'
    }
  }

  const newRequest = {
    id: generateId(),
    tripId,
    userId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  requests.push(newRequest)

  return {
    success: true,
    data: newRequest
  }
}

export const getRequestsForTrip = async (tripId) => {
  await randomDelay()

  const tripRequests = requests
    .filter(r => r.tripId === tripId)
    .map(r => ({
      ...r,
      user: users.find(u => u.id === r.userId)
    }))

  return {
    success: true,
    data: tripRequests
  }
}

export const getRequestsByUser = async (userId) => {
  await randomDelay()

  const userRequests = requests
    .filter(r => r.userId === userId)
    .map(r => ({
      ...r,
      trip: trips.find(t => t.id === r.tripId)
    }))

  return {
    success: true,
    data: userRequests
  }
}

export const updateRequestStatus = async (requestId, status) => {
  await randomDelay()

  const request = requests.find(r => r.id === requestId)
  
  if (!request) {
    return {
      success: false,
      error: 'Request not found'
    }
  }

  request.status = status

  // If approved, add user to trip participants
  if (status === 'approved') {
    const trip = trips.find(t => t.id === request.tripId)
    if (trip && !trip.participants.includes(request.userId)) {
      trip.participants.push(request.userId)
      trip.seatsOccupied += 1
      
      // Update trip status if full
      if (trip.seatsOccupied >= trip.seatsTotal) {
        trip.status = 'full'
      }
    }
  }

  return {
    success: true,
    data: request
  }
}

// ============ USERS API ============

export const getUser = async (id) => {
  await randomDelay()

  const user = users.find(u => u.id === id)

  if (!user) {
    return {
      success: false,
      error: 'User not found'
    }
  }

  return {
    success: true,
    data: user
  }
}

export const getUsers = async () => {
  await randomDelay()

  return {
    success: true,
    data: users
  }
}

export const updateUser = async (userId, updates) => {
  await randomDelay()

  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return {
      success: false,
      error: 'User not found'
    }
  }

  // Merge updates (but preserve email and id)
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id: users[userIndex].id,
    email: users[userIndex].email
  }

  return {
    success: true,
    data: users[userIndex]
  }
}

export const getUserTrips = async (userId) => {
  await randomDelay()

  const userTrips = trips
    .filter(t => t.ownerId === userId)
    .map(trip => ({
      ...trip,
      owner: users.find(u => u.id === trip.ownerId)
    }))

  return {
    success: true,
    data: userTrips
  }
}

export const getUserParticipations = async (userId) => {
  await randomDelay()

  const participations = trips
    .filter(t => t.participants.includes(userId) && t.ownerId !== userId)
    .map(trip => ({
      ...trip,
      owner: users.find(u => u.id === trip.ownerId)
    }))

  return {
    success: true,
    data: participations
  }
}

// ============ MESSAGES API ============

export const getMessages = async (tripId) => {
  await randomDelay()

  const tripMessages = messages
    .filter(m => m.tripId === tripId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return {
    success: true,
    data: tripMessages
  }
}

export const sendMessage = async (tripId, userId, userName, message) => {
  await randomDelay()

  const newMessage = {
    id: generateId(),
    tripId,
    userId,
    userName,
    message,
    timestamp: new Date().toISOString()
  }

  messages.push(newMessage)

  return {
    success: true,
    data: newMessage
  }
}

// ============ HELPER FUNCTIONS ============

export const getJoinedUsers = async (tripId) => {
  await randomDelay()

  const trip = trips.find(t => t.id === tripId)
  
  if (!trip) {
    return {
      success: false,
      error: 'Trip not found'
    }
  }

  const joinedUsers = trip.participants.map(pid =>
    users.find(u => u.id === pid)
  )

  return {
    success: true,
    data: joinedUsers
  }
}

export const isUserJoined = (tripId, userId) => {
  const trip = trips.find(t => t.id === tripId)
  return trip ? trip.participants.includes(userId) : false
}

export const hasUserRequested = (tripId, userId) => {
  return requests.some(r => r.tripId === tripId && r.userId === userId)
}

// Reset function for testing
export const resetMockApi = () => {
  users = [...mockUsers]
  trips = [...mockTrips]
  requests = [...mockRequests]
  messages = [...mockMessages]
  console.log('Mock API data reset')
}
