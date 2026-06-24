const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Please provide event coordinates']
    },
    address: {
      type: String,
      required: [true, 'Please provide event address']
    }
  },
  date: {
    type: Date,
    required: [true, 'Please specify event date and time'],
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['upcoming', 'completed'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

EventSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);
