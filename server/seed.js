require('dotenv').config({ path: 'c:/Users/Madhu Gupta/Desktop/test 2/server/.env' });
const mongoose = require('mongoose');
const connectDB = require('./db');
const Monitoring = require('./models/Monitoring');
const Case = require('./models/Case');
const Alert = require('./models/Alert');
const Doctor = require('./models/Doctor');
const monitoringData = require('./monitoring_data.json');
const data = require('./data.json');
const doctors = require('./doctors.json');

const seedDB = async () => {
  await connectDB();

  await Monitoring.deleteMany({});
  const transformedMonitoringData = monitoringData.cities.map(city => ({
    name: city.name,
    aqi: city.airQuality,
    water_quality: city.waterQuality,
    wasteManagement: city.wasteManagement,
    sewageManagement: city.sewageManagement,
    reported_diseases: city.commonDiseases,
    noise_pollution: city.noise_pollution,
    health_risk_score: city.health_risk_score,
    precautions: city.precautions,
  }));
  await Monitoring.insertMany(transformedMonitoringData);

  await Case.deleteMany({});
  await Case.insertMany(data.cases);

  await Alert.deleteMany({});
  await Alert.insertMany(data.alerts);

  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);

  console.log('Data seeded');
  mongoose.connection.close();
};

seedDB();
