const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Event = require('./models/Event');
const Comment = require('./models/Comment');
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const Like = require('./models/Like');
const Bookmark = require('./models/Bookmark');
const Notification = require('./models/Notification');
const Report = require('./models/Report');
const Registration = require('./models/Registration');

const seedData = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Event.deleteMany({});
    await Comment.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Like.deleteMany({});
    await Bookmark.deleteMany({});
    await Notification.deleteMany({});
    await Report.deleteMany({});
    await Registration.deleteMany({});

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
    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });

    // Tạo Categories
    const techCategory = await Category.create({ name: 'Technology', slug: 'technology' });
    const entertainmentCategory = await Category.create({ name: 'Entertainment', slug: 'entertainment' });

    // Tạo Tags
    const jsTag = await Tag.create({ name: 'JavaScript', slug: 'javascript' });
    const musicTag = await Tag.create({ name: 'Music', slug: 'music' });
    const networkingTag = await Tag.create({ name: 'Networking', slug: 'networking' });

    // Tạo events mẫu
    const sampleEvents = await Event.create([
      {
        title: 'Tech Conference 2025',
        description: 'Annual technology conference featuring the latest innovations',
        date: new Date('2025-12-01'),
        location: 'Convention Center',
        capacity: 500,
        price: 99.99,
        organizer: organizer._id,
        category: techCategory._id,
        tags: [jsTag._id, networkingTag._id],
        status: 'upcoming',
        images: ['/uploads/sample-tech.jpg']
      },
      {
        title: 'Music Festival',
        description: 'A day of live music and entertainment',
        date: new Date('2025-11-15'),
        location: 'City Park',
        capacity: 1000,
        price: 49.99,
        organizer: organizer._id,
        category: entertainmentCategory._id,
        tags: [musicTag._id],
        status: 'upcoming',
        images: ['/uploads/sample-music.jpg']
      }
    ]);

    // Tạo comments mẫu
    const sampleComments = await Comment.create([
      {
        content: 'This looks like an amazing conference!',
        user: regularUser._id,
        event: sampleEvents[0]._id,
      },
      {
        content: 'Can\'t wait for the music festival!',
        user: admin._id,
        event: sampleEvents[1]._id,
      },
    ]);

    // Tạo Likes
    await Like.create({
      user: regularUser._id,
      likeableId: sampleEvents[0]._id,
      likeableType: 'Event',
    });

    // Tạo Bookmarks
    await Bookmark.create({
      user: regularUser._id,
      event: sampleEvents[1]._id,
    });

    // Tạo Notifications
    await Notification.create({
      recipient: organizer._id,
      sender: regularUser._id,
      type: 'new_comment',
      content: `${regularUser.username} has commented on your event: ${sampleEvents[0].title}`,
      link: `/events/${sampleEvents[0]._id}`,
    });

    // Tạo Reports
    await Report.create({
      reporter: regularUser._id,
      reportedId: sampleComments[1]._id,
      reportedType: 'Comment',
      reason: 'This is spam.',
      status: 'pending',
    });

    // Tạo Registrations
    await Registration.create({
      event: sampleEvents[0]._id,
      user: regularUser._id,
      status: 'confirmed',
      ticketNumber: `TICKET-${Date.now()}`,
    });

    console.log('Sample users, events, comments created.');
    console.log('Sample categories, tags, likes, bookmarks, notifications, reports, and registrations created.');

    console.log('Sample data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();