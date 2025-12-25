const mongoose = require('mongoose');

const MonitoringSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  water_quality: {
    type: String,
    required: true,
  },
  aqi: {
    type: String,
    required: true,
  },
  sewageManagement: {
    type: String,
    required: true,
  },
  wasteManagement: {
    type: String,
    required: true,
  },
  reported_diseases: {
    type: [String],
    required: true,
  },
  noise_pollution: {
    type: String,
    required: true,
  },
  health_risk_score: {
    type: Number,
    required: true,
  },
  precautions: {
    type: Map,
    of: String,
    required: true,
  },
});

module.exports = mongoose.model('Monitoring', MonitoringSchema);
