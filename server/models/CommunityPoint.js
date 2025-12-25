const mongoose = require('mongoose');

const CommunityPointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  history: [
    {
      points: {
        type: Number,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('CommunityPoint', CommunityPointSchema);
