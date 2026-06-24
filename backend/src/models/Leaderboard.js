const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  impactScore: {
    type: Number,
    required: true,
    min: 0
  },
  rank: {
    type: Number,
    required: true,
    min: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Indexes for super-fast retrieval of ranked positions
LeaderboardSchema.index({ rank: 1 });
LeaderboardSchema.index({ impactScore: -1 });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
