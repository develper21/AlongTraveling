// Mock data for TripBuddy app - simulates database

export const mockUsers = [
  {
    id: 'user_1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@iitr.ac.in',
    branch: 'CSE',
    year: '3rd Year',
    bio: 'Adventure enthusiast looking for travel buddies!'
  },
  {
    id: 'user_2',
    name: 'Priya Gupta',
    email: 'priya.gupta@iitr.ac.in',
    branch: 'ECE',
    year: '2nd Year',
    bio: 'Love exploring new places and cultures'
  },
  {
    id: 'user_3',
    name: 'Amit Kumar',
    email: 'amit.kumar@iitr.ac.in',
    branch: 'Mechanical',
    year: '4th Year',
    bio: 'Trek lover and photographer'
  },
  {
    id: 'user_4',
    name: 'Sneha Patel',
    email: 'sneha.patel@iitr.ac.in',
    branch: 'Chemical',
    year: '3rd Year',
    bio: 'Beach person who loves road trips'
  },
  {
    id: 'user_5',
    name: 'Vikram Singh',
    email: 'vikram.singh@iitr.ac.in',
    branch: 'Civil',
    year: '2nd Year',
    bio: 'Budget traveler, mountain enthusiast'
  },
  {
    id: 'user_6',
    name: 'Anjali Verma',
    email: 'anjali.verma@iitr.ac.in',
    branch: 'Biotechnology',
    year: '3rd Year',
    bio: 'Solo traveler looking for companions'
  }
]

export const mockTrips = [
  {
    id: 'trip_1',
    title: 'Weekend Trek to Triund',
    destination: 'Triund, Himachal Pradesh',
    dateFrom: '2025-10-18',
    dateTo: '2025-10-20',
    seatsTotal: 6,
    seatsOccupied: 3,
    budgetEstimate: 3500,
    travelMode: 'bus',
    tripType: 'trek',
    notes: 'Moderate difficulty trek with stunning views. Experience required. Carrying camping gear.',
    ownerId: 'user_3',
    status: 'open',
    participants: ['user_3', 'user_2', 'user_5'],
    createdAt: '2025-10-05T10:00:00Z'
  },
  {
    id: 'trip_2',
    title: 'Goa Beach Holiday',
    destination: 'Goa',
    dateFrom: '2025-10-25',
    dateTo: '2025-10-29',
    seatsTotal: 4,
    seatsOccupied: 4,
    budgetEstimate: 8000,
    travelMode: 'flight',
    tripType: 'vacation',
    notes: 'Beach hopping, water sports, nightlife. Looking for chill vibes!',
    ownerId: 'user_4',
    status: 'full',
    participants: ['user_4', 'user_1', 'user_6', 'user_2'],
    createdAt: '2025-10-03T14:30:00Z'
  },
  {
    id: 'trip_3',
    title: 'Jaipur Heritage Tour',
    destination: 'Jaipur, Rajasthan',
    dateFrom: '2025-11-02',
    dateTo: '2025-11-05',
    seatsTotal: 5,
    seatsOccupied: 2,
    budgetEstimate: 5000,
    travelMode: 'train',
    tripType: 'vacation',
    notes: 'Explore forts, palaces, and local cuisine. History buffs welcome!',
    ownerId: 'user_1',
    status: 'open',
    participants: ['user_1', 'user_3'],
    createdAt: '2025-10-07T09:15:00Z'
  },
  {
    id: 'trip_4',
    title: 'Rishikesh Adventure Weekend',
    destination: 'Rishikesh, Uttarakhand',
    dateFrom: '2025-10-22',
    dateTo: '2025-10-24',
    seatsTotal: 8,
    seatsOccupied: 5,
    budgetEstimate: 4000,
    travelMode: 'bus',
    tripType: 'trek',
    notes: 'River rafting, camping, bonfire. Adventure seekers only!',
    ownerId: 'user_5',
    status: 'open',
    participants: ['user_5', 'user_1', 'user_3', 'user_4', 'user_6'],
    createdAt: '2025-10-06T16:45:00Z'
  },
  {
    id: 'trip_5',
    title: 'Manali Snow Expedition',
    destination: 'Manali, Himachal Pradesh',
    dateFrom: '2025-12-20',
    dateTo: '2025-12-25',
    seatsTotal: 6,
    seatsOccupied: 1,
    budgetEstimate: 12000,
    travelMode: 'bus',
    tripType: 'vacation',
    notes: 'Winter wonderland trip! Skiing, snowboarding, and cozy cafes.',
    ownerId: 'user_2',
    status: 'open',
    participants: ['user_2'],
    createdAt: '2025-10-08T11:20:00Z'
  },
  {
    id: 'trip_6',
    title: 'Kasol Backpacking Trip',
    destination: 'Kasol, Himachal Pradesh',
    dateFrom: '2025-10-28',
    dateTo: '2025-10-31',
    seatsTotal: 4,
    seatsOccupied: 3,
    budgetEstimate: 4500,
    travelMode: 'bus',
    tripType: 'trek',
    notes: 'Budget backpacking trip. Exploring cafes, short treks, chill vibes.',
    ownerId: 'user_6',
    status: 'open',
    participants: ['user_6', 'user_5', 'user_2'],
    createdAt: '2025-10-04T13:00:00Z'
  },
  {
    id: 'trip_7',
    title: 'Home Trip - Diwali Break',
    destination: 'Delhi',
    dateFrom: '2025-11-10',
    dateTo: '2025-11-13',
    seatsTotal: 3,
    seatsOccupied: 2,
    budgetEstimate: 1500,
    travelMode: 'train',
    tripType: 'home',
    notes: 'Going home for Diwali. Can share cab from station.',
    ownerId: 'user_1',
    status: 'open',
    participants: ['user_1', 'user_4'],
    createdAt: '2025-10-09T08:30:00Z'
  },
  {
    id: 'trip_8',
    title: 'Agra Day Trip - Taj Mahal',
    destination: 'Agra, Uttar Pradesh',
    dateFrom: '2025-10-15',
    dateTo: '2025-10-15',
    seatsTotal: 5,
    seatsOccupied: 4,
    budgetEstimate: 2000,
    travelMode: 'car',
    tripType: 'vacation',
    notes: 'Quick day trip to see the Taj Mahal. Leaving early morning, back by night.',
    ownerId: 'user_3',
    status: 'open',
    participants: ['user_3', 'user_1', 'user_2', 'user_6'],
    createdAt: '2025-10-02T07:00:00Z'
  }
]

export const mockRequests = [
  {
    id: 'req_1',
    tripId: 'trip_1',
    userId: 'user_1',
    message: 'I have trekking experience and would love to join!',
    status: 'pending',
    createdAt: '2025-10-08T10:30:00Z'
  },
  {
    id: 'req_2',
    tripId: 'trip_3',
    userId: 'user_4',
    message: 'Interested in the heritage tour. Count me in!',
    status: 'pending',
    createdAt: '2025-10-09T15:20:00Z'
  },
  {
    id: 'req_3',
    tripId: 'trip_5',
    userId: 'user_3',
    message: 'Never been to Manali in winter. Would be a great experience!',
    status: 'approved',
    createdAt: '2025-10-08T18:00:00Z'
  },
  {
    id: 'req_4',
    tripId: 'trip_4',
    userId: 'user_2',
    message: 'Love adventure sports! Can I join?',
    status: 'rejected',
    createdAt: '2025-10-07T12:00:00Z'
  }
]

export const mockMessages = [
  {
    id: 'msg_1',
    tripId: 'trip_2',
    userId: 'user_4',
    userName: 'Sneha Patel',
    message: 'Hey everyone! So excited for this trip!',
    timestamp: '2025-10-10T09:00:00Z'
  },
  {
    id: 'msg_2',
    tripId: 'trip_2',
    userId: 'user_1',
    userName: 'Rahul Sharma',
    message: 'Same here! What activities are we planning?',
    timestamp: '2025-10-10T09:15:00Z'
  },
  {
    id: 'msg_3',
    tripId: 'trip_2',
    userId: 'user_6',
    userName: 'Anjali Verma',
    message: 'I vote for parasailing and jet skiing!',
    timestamp: '2025-10-10T09:30:00Z'
  },
  {
    id: 'msg_4',
    tripId: 'trip_4',
    userId: 'user_5',
    userName: 'Vikram Singh',
    message: 'Meeting point will be campus gate at 5 AM sharp!',
    timestamp: '2025-10-10T20:00:00Z'
  },
  {
    id: 'msg_5',
    tripId: 'trip_4',
    userId: 'user_1',
    userName: 'Rahul Sharma',
    message: 'Got it! Should we book rafting in advance?',
    timestamp: '2025-10-10T20:15:00Z'
  }
]

// Helper function to reset data (for testing)
export const resetMockData = () => {
  // In a real app, this would reset the data to initial state
  console.log('Mock data reset')
}
