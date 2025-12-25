const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
  },
  alert: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', AlertSchema);
