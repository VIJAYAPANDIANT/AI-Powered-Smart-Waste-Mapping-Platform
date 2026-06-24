const mongoose = require('mongoose');

const WasteReportSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Please provide GPS coordinates [longitude, latitude]']
    },
    address: {
      type: String,
      required: [true, 'Please provide a location address'],
      trim: true
    }
  },
  wasteType: {
    type: String,
    required: [true, 'Please specify waste type'],
    enum: {
      values: ['Plastic', 'Organic', 'E-waste', 'Metal', 'Glass', 'Hazardous', 'Other'],
      message: '{VALUE} is not a valid waste type'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'resolved'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  photoUrl: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report must be linked to a reporting user']
  },
  assignedTeam: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for query performance optimization
WasteReportSchema.index({ 'location': '2dsphere' }); // Spatial index for finding reports nearby
WasteReportSchema.index({ status: 1 });
WasteReportSchema.index({ userId: 1 });
WasteReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('WasteReport', WasteReportSchema);
