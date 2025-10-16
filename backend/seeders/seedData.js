const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Trip = require('../models/Trip');
const JoinRequest = require('../models/JoinRequest');
const Message = require('../models/Message');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample users
const users = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@iitr.ac.in',
    password: 'password123',
    branch: 'Computer Science',
    year: '3rd Year',
    bio: 'Love to explore new places and meet new people!'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@iitr.ac.in',
    password: 'password123',
    branch: 'Electrical Engineering',
    year: '2nd Year',
    bio: 'Adventure enthusiast and photography lover.'
  },
  {
    name: 'Arjun Kumar',
    email: 'arjun.kumar@iitr.ac.in',
    password: 'password123',
    branch: 'Mechanical Engineering',
    year: '4th Year',
    bio: 'Passionate traveler seeking new experiences.'
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@iitr.ac.in',
    password: 'password123',
    branch: 'Civil Engineering',
    year: '3rd Year',
    bio: 'Nature lover and hiking enthusiast.'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@iitr.ac.in',
    password: 'password123',
    branch: 'Chemical Engineering',
    year: '2nd Year',
    bio: 'Always up for spontaneous trips!'
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@iitr.ac.in',
    password: 'password123',
    branch: 'Architecture',
    year: '1st Year',
    bio: 'Exploring India one trip at a time.'
  }
];

// Sample trips generator
const generateTrips = (userIds) => [
  {
    title: 'Weekend Trek to Rishikesh',
    description: 'Join us for an exciting weekend trek to Rishikesh. We will explore the beautiful trails, visit ashrams, and enjoy river rafting in the Ganges.',
    destination: 'Rishikesh',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    maxParticipants: 8,
    currentParticipants: 1,
    estimatedCost: 2500,
    mode: 'Bus',
    type: 'Adventure',
    status: 'upcoming',
    organizer: userIds[0],
    participants: [userIds[0]]
  },
  {
    title: 'Mussoorie Hill Station Trip',
    description: 'Experience the scenic beauty of Mussoorie. Visit Kempty Falls, Gun Hill, and enjoy the pleasant weather.',
    destination: 'Mussoorie',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    maxParticipants: 6,
    currentParticipants: 3,
    estimatedCost: 3500,
    mode: 'Car',
    type: 'Leisure',
    status: 'upcoming',
    organizer: userIds[1],
    participants: [userIds[1], userIds[2], userIds[3]]
  },
  {
    title: 'Delhi Heritage Walk',
    description: 'Explore the rich heritage of Delhi. Visit Red Fort, Qutub Minar, India Gate, and enjoy local street food.',
    destination: 'Delhi',
    startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    maxParticipants: 10,
    currentParticipants: 5,
    estimatedCost: 1500,
    mode: 'Train',
    type: 'Cultural',
    status: 'upcoming',
    organizer: userIds[2],
    participants: [userIds[2], userIds[0], userIds[1], userIds[4], userIds[5]]
  },
  {
    title: 'Haridwar Spiritual Retreat',
    description: 'A peaceful spiritual journey to Haridwar. Attend Ganga Aarti, visit temples, and experience the divine atmosphere.',
    destination: 'Haridwar',
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    maxParticipants: 5,
    currentParticipants: 2,
    estimatedCost: 2000,
    mode: 'Bus',
    type: 'Cultural',
    status: 'upcoming',
    organizer: userIds[3],
    participants: [userIds[3], userIds[4]]
  },
  {
    title: 'Nainital Lake City Getaway',
    description: 'Enjoy boating in Naini Lake, visit Naina Devi Temple, and explore the beautiful mall road.',
    destination: 'Nainital',
    startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxParticipants: 7,
    currentParticipants: 1,
    estimatedCost: 4000,
    mode: 'Car',
    type: 'Leisure',
    status: 'upcoming',
    organizer: userIds[4],
    participants: [userIds[4]]
  },
  {
    title: 'Agra Day Trip - Taj Mahal',
    description: 'One day trip to Agra to witness the magnificent Taj Mahal and Agra Fort.',
    destination: 'Agra',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    maxParticipants: 8,
    currentParticipants: 4,
    estimatedCost: 1800,
    mode: 'Train',
    type: 'Cultural',
    status: 'upcoming',
    organizer: userIds[5],
    participants: [userIds[5], userIds[0], userIds[2], userIds[3]]
  },
  {
    title: 'Dehradun Food Trail',
    description: 'Explore the culinary delights of Dehradun. Visit popular eateries and try local Garhwali cuisine.',
    destination: 'Dehradun',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    maxParticipants: 6,
    currentParticipants: 3,
    estimatedCost: 800,
    mode: 'Bus',
    type: 'Leisure',
    status: 'upcoming',
    organizer: userIds[0],
    participants: [userIds[0], userIds[1], userIds[5]]
  },
  {
    title: 'Jim Corbett Wildlife Safari',
    description: 'Experience thrilling wildlife safari at Jim Corbett National Park. Spot tigers, elephants, and diverse flora.',
    destination: 'Jim Corbett',
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
    maxParticipants: 8,
    currentParticipants: 2,
    estimatedCost: 5500,
    mode: 'Car',
    type: 'Adventure',
    status: 'upcoming',
    organizer: userIds[1],
    participants: [userIds[1], userIds[3]]
  },
  {
    title: 'Lansdowne Nature Escape',
    description: 'Peaceful getaway to Lansdowne. Perfect for nature lovers seeking tranquility away from city chaos.',
    destination: 'Lansdowne',
    startDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000),
    maxParticipants: 5,
    currentParticipants: 1,
    estimatedCost: 3200,
    mode: 'Bus',
    type: 'Leisure',
    status: 'upcoming',
    organizer: userIds[2],
    participants: [userIds[2]]
  },
  {
    title: 'Jaipur Pink City Tour',
    description: 'Discover the royal heritage of Jaipur. Visit Amber Fort, Hawa Mahal, City Palace, and shop at local bazaars.',
    destination: 'Jaipur',
    startDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000),
    maxParticipants: 10,
    currentParticipants: 6,
    estimatedCost: 6000,
    mode: 'Train',
    type: 'Cultural',
    status: 'upcoming',
    organizer: userIds[3],
    participants: [userIds[3], userIds[0], userIds[1], userIds[2], userIds[4], userIds[5]]
  }
];

// Import data
const importData = async () => {
  try {
    console.log('Starting data import...'.yellow.bold);

    // Delete all existing data
    await User.deleteMany();
    await Trip.deleteMany();
    await JoinRequest.deleteMany();
    await Message.deleteMany();
    console.log('Existing data cleared'.red.bold);

    // Create users
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created`.green.bold);

    const userIds = createdUsers.map(user => user._id);

    // Create trips
    const trips = generateTrips(userIds);
    const createdTrips = await Trip.create(trips);
    console.log(`${createdTrips.length} trips created`.green.bold);

    // Update users with their created and joined trips
    for (let i = 0; i < createdUsers.length; i++) {
      const userTrips = createdTrips.filter(trip => 
        trip.organizer.toString() === userIds[i].toString()
      );
      const joinedTrips = createdTrips.filter(trip => 
        trip.participants.includes(userIds[i]) && 
        trip.organizer.toString() !== userIds[i].toString()
      );

      await User.findByIdAndUpdate(userIds[i], {
        tripsCreated: userTrips.map(t => t._id),
        tripsJoined: joinedTrips.map(t => t._id)
      });
    }
    console.log('User trip references updated'.green.bold);

    // Create sample join requests
    const joinRequests = [
      {
        trip: createdTrips[0]._id,
        user: userIds[2],
        message: 'Hey! I would love to join this trek. I have previous trekking experience and can help with planning.',
        status: 'pending'
      },
      {
        trip: createdTrips[0]._id,
        user: userIds[4],
        message: 'Count me in! Been wanting to visit Rishikesh for a while now.',
        status: 'pending'
      },
      {
        trip: createdTrips[4]._id,
        user: userIds[0],
        message: 'I have always wanted to visit Nainital. Would be great to join you!',
        status: 'pending'
      },
      {
        trip: createdTrips[8]._id,
        user: userIds[5],
        message: 'Love nature and peaceful getaways. Please consider my request!',
        status: 'approved'
      }
    ];

    const createdRequests = await JoinRequest.create(joinRequests);
    console.log(`${createdRequests.length} join requests created`.green.bold);

    // Update trips with join request references
    for (const request of createdRequests) {
      await Trip.findByIdAndUpdate(request.trip, {
        $push: { joinRequests: request._id }
      });
    }

    // Create sample messages for trips with multiple participants
    const messages = [
      {
        trip: createdTrips[1]._id,
        sender: userIds[1],
        content: 'Hey everyone! Looking forward to this trip!'
      },
      {
        trip: createdTrips[1]._id,
        sender: userIds[2],
        content: 'Same here! Should we plan the itinerary?'
      },
      {
        trip: createdTrips[1]._id,
        sender: userIds[3],
        content: 'I can help with booking accommodation if needed.'
      },
      {
        trip: createdTrips[2]._id,
        sender: userIds[2],
        content: 'Excited for the heritage walk! What time should we start?'
      },
      {
        trip: createdTrips[2]._id,
        sender: userIds[0],
        content: 'I suggest we start early morning around 6 AM to avoid crowds.'
      },
      {
        trip: createdTrips[5]._id,
        sender: userIds[5],
        content: 'Don\'t forget to carry your ID cards for entry!'
      },
      {
        trip: createdTrips[5]._id,
        sender: userIds[0],
        content: 'Thanks for the reminder! Also, should we book train tickets together?'
      },
      {
        trip: createdTrips[9]._id,
        sender: userIds[3],
        content: 'This is going to be an amazing trip! The Pink City awaits!'
      },
      {
        trip: createdTrips[9]._id,
        sender: userIds[1],
        content: 'I have been to Jaipur before. Happy to share some recommendations.'
      }
    ];

    const createdMessages = await Message.create(messages);
    console.log(`${createdMessages.length} messages created`.green.bold);

    // Update trips with message references
    for (const message of createdMessages) {
      await Trip.findByIdAndUpdate(message.trip, {
        $push: { messages: message._id }
      });
    }

    console.log('Data import completed successfully!'.green.inverse.bold);
    console.log('\nTest Credentials:'.cyan.bold);
    console.log('Email: rahul.sharma@iitr.ac.in'.yellow);
    console.log('Password: password123'.yellow);
    console.log('\nAll users have the same password: password123'.magenta);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Trip.deleteMany();
    await JoinRequest.deleteMany();
    await Message.deleteMany();
    
    console.log('Data destroyed successfully!'.red.inverse.bold);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
