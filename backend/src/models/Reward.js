const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  pointsCost: {
    type: Number,
    required: true,
    min: 0,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    default: 100,
  },
});

module.exports = mongoose.model('Reward', RewardSchema);
