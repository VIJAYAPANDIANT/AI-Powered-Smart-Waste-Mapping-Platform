const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');
const Achievement = require('../models/Achievement');
const Leaderboard = require('../models/Leaderboard');
const Reward = require('../models/Reward');

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@smartwaste.org',
    password: 'password123',
    role: 'admin',
    impactScore: 500
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    impactScore: 180
  },
  {
    username: 'jane_green',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    impactScore: 250
  }
];

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_waste_db';
    console.log(`Connecting to database for seeding: ${connStr}`);
    await mongoose.connect(connStr);

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await WasteReport.deleteMany({});
    await Notification.deleteMany({});
    await Achievement.deleteMany({});
    await Leaderboard.deleteMany({});
    await Reward.deleteMany({});

    console.log('Seeding Users...');
    const createdUsers = await User.create(sampleUsers);
    
    const adminUser = createdUsers[0];
    const johnUser = createdUsers[1];
    const janeUser = createdUsers[2];

    console.log('Seeding Waste Reports...');
    const reports = [
      {
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749], // San Francisco
          address: 'Market St, San Francisco, CA'
        },
        wasteType: 'Plastic',
        description: 'Large pile of plastic bottles discarded near the transit center.',
        status: 'approved',
        photoUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/plastic-pile.jpg',
        userId: johnUser._id,
        assignedTeam: 'Green Cleanup Squad'
      },
      {
        location: {
          type: 'Point',
          coordinates: [-122.4089, 37.7882], // SF Union Square
          address: 'Union Square, San Francisco, CA'
        },
        wasteType: 'Hazardous',
        description: 'Discarded electronic batteries and aerosol cans.',
        status: 'pending',
        photoUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/batteries.jpg',
        userId: janeUser._id
      },
      {
        location: {
          type: 'Point',
          coordinates: [-122.4312, 37.7694], // SF Castro
          address: 'Castro St, San Francisco, CA'
        },
        wasteType: 'Organic',
        description: 'Fallen fruit rotting on the public sidewalk causing odor.',
        status: 'resolved',
        photoUrl: '',
        userId: janeUser._id,
        assignedTeam: 'District Composting Team'
      }
    ];
    await WasteReport.create(reports);

    console.log('Seeding Achievements...');
    const achievements = [
      {
        userId: johnUser._id,
        title: 'Eco Beginner',
        description: 'Reported your first waste pile to help clean the planet!',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-beginner.png'
      },
      {
        userId: janeUser._id,
        title: 'Eco Beginner',
        description: 'Reported your first waste pile to help clean the planet!',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-beginner.png'
      },
      {
        userId: janeUser._id,
        title: 'Eco Champion',
        description: 'Earned 100+ impact points by resolving waste piles!',
        badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-champion.png'
      }
    ];
    await Achievement.create(achievements);

    console.log('Seeding Notifications...');
    const notifications = [
      {
        userId: johnUser._id,
        message: 'Your waste report for Plastic has been approved.',
        read: true,
        type: 'report_status'
      },
      {
        userId: janeUser._id,
        message: 'Achievement Unlocked: Eco Champion!',
        read: false,
        type: 'achievement'
      }
    ];
    await Notification.create(notifications);

    console.log('Seeding Leaderboard cached standings...');
    const standings = [
      {
        userId: adminUser._id,
        username: adminUser.username,
        impactScore: adminUser.impactScore,
        rank: 1
      },
      {
        userId: janeUser._id,
        username: janeUser.username,
        impactScore: janeUser.impactScore,
        rank: 2
      },
      {
        userId: johnUser._id,
        username: johnUser.username,
        impactScore: johnUser.impactScore,
        rank: 3
      }
    ];
    await Leaderboard.create(standings);

    console.log('Seeding Marketplace Rewards...');
    const rewards = [
      {
        title: 'Free Eco Coffee Voucher',
        description: 'Redeem for a organic coffee in a reusable mug at participating shops.',
        pointsCost: 50,
        code: 'ECOCOFFEE50',
        stock: 50
      },
      {
        title: 'Plant a Forest Tree Initiative',
        description: 'Deduct points to sponsor the planting of one native tree in the municipal park.',
        pointsCost: 100,
        code: 'PLANTTREE100',
        stock: 100
      },
      {
        title: '$15 Zero-Waste Store Coupon',
        description: 'Redeem for $15 store credit at local Smart City package-free grocers.',
        pointsCost: 200,
        code: 'ZEROWASTE15',
        stock: 20
      }
    ];
    await Reward.create(rewards);

    console.log('Database successfully seeded!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

// Run if direct execution
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
