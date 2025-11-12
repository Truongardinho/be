const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Event = require('./models/Event');

const seedData = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Event.deleteMany({});

    // Tạo admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Tạo organizer
    const organizer = await User.create({
      username: 'organizer',
      email: 'organizer@example.com',
      password: hashedPassword,
      role: 'organizer'
    });

    // Tạo regular user
    await User.create({
      username: 'user',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });

    // Tạo events mẫu
    await Event.create([
      {
        title: 'Tech Conference 2025',
        description: 'Annual technology conference featuring the latest innovations',
        date: new Date('2025-12-01'),
        location: 'Convention Center',
        capacity: 500,
        price: 99.99,
        organizer: organizer._id,
        category: 'Technology',
        status: 'upcoming'
      },
      {
        title: 'Music Festival',
        description: 'A day of live music and entertainment',
        date: new Date('2025-11-15'),
        location: 'City Park',
        capacity: 1000,
        price: 49.99,
        organizer: organizer._id,
        category: 'Entertainment',
        status: 'upcoming'
      }
    ]);

    console.log('Sample data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();