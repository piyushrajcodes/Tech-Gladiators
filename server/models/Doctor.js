const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  specialty: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  degree: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  slots_booked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
