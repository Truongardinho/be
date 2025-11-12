const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Registration', registrationSchema);