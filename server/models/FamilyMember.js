
const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  medicalHistory: [{
    type: String,
  }],
  prescriptions: [{
    type: String,
  }],
  vaccinations: [{
    type: String,
  }],
  chronicIllnesses: [{
    type: String,
  }],
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
