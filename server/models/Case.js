const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  disease: { type: String, required: true },
  cases: { type: Number, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true }, // e.g., 'Northeast', 'South', 'West', 'Central', 'North'
  date: { type: Date, default: Date.now } // Added date field
});

module.exports = mongoose.model('Case', CaseSchema);
