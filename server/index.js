const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const connectDB = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5001;

const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Smart Health Monitoring Server is running!');
});

const Monitoring = require('./models/Monitoring');
const Case = require('./models/Case');
const Alert = require('./models/Alert');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');
const User = require('./models/User'); // Import User model
const Quiz = require('./models/Quiz');
const Badge = require('./models/Badge');
const UserBadge = require('./models/UserBadge');
const CommunityPoint = require('./models/CommunityPoint');
const { authUser } = require('./middleware/auth');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

// Create mongo connection
const conn = mongoose.connection;

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

app.get('/api/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.get('/api/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }
    // Read output to browser
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});


app.get('/api/monitoring/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const data = await Monitoring.findOne({ name: new RegExp(city, 'i') });
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'City not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/cases/total', async (req, res) => {
  try {
    const totalCases = await Case.aggregate([
      { $group: { _id: null, total: { $sum: "$cases" } } }
    ]);
    res.json({ total: totalCases[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/cases/northeast', async (req, res) => {
  try {
    const northeastCases = await Case.aggregate([
      { $match: { region: 'Northeast' } },
      { $group: { _id: null, total: { $sum: "$cases" } } }
    ]);
    res.json({ total: northeastCases[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/alerts/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const alerts = await Alert.find({ district: new RegExp(city, 'i') });
    res.json({ success: true, alerts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'user',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// General login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update a doctor's profile
app.put('/api/doctors/:id', authUser, async (req, res) => {
  const { name, email, specialty, degree, experience, fees, address } = req.body;

  // Build doctor object
  const doctorFields = {};
  if (name) doctorFields.name = name;
  if (email) doctorFields.email = email;
  if (specialty) doctorFields.specialty = specialty;
  if (degree) doctorFields.degree = degree;
  if (experience) doctorFields.experience = experience;
  if (fees) doctorFields.fees = fees;
  if (address) doctorFields.address = address;

  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: doctorFields },
      { new: true }
    ).select('-password');

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Toggle a doctor's availability
app.put('/api/doctors/availability/:id', authUser, async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    doctor.isAvailable = !doctor.isAvailable;

    await doctor.save();

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Book an appointment
app.post('/api/appointments/book', authUser, async (req, res) => {
  const { doctorId, start, description, end } = req.body;
  const userId = req.user.id;

  try {
    const newAppointment = new Appointment({
      userId,
      doctorId,
      description,
      start,
      end,
      status: 'pending',
    });

    const appointment = await newAppointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all appointments for a user
app.get('/api/appointments/user/:userId', authUser, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all appointments for a doctor
app.get('/api/appointments/doctor/:doctorId', authUser, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Cancel an appointment
app.put('/api/appointments/cancel/:id', authUser, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    appointment.status = 'cancelled';

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark an appointment as completed
app.put('/api/appointments/complete/:id', authUser, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    appointment.status = 'completed';

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all appointments (admin)
app.get('/api/admin/appointments', authUser, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all doctors (admin)
app.get('/api/admin/doctors', authUser, async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Toggle a doctor's availability (admin)
app.put('/api/admin/doctors/availability/:id', authUser, async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    doctor.isAvailable = !doctor.isAvailable;

    await doctor.save();

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// SOS Alert
app.post('/api/sos', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const newSOS = new SOS({
      latitude,
      longitude,
    });

    const sos = await newSOS.save();
    res.json(sos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const FamilyCard = require('./models/FamilyCard');
const FamilyMember = require('./models/FamilyMember');

// Gamification routes
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

app.post('/api/quizzes/submit', authUser, async (req, res) => {
  const { quizId, answers } = req.body;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    const percentage = (score / quiz.questions.length) * 100;

    if (percentage === 100) {
      // Award badge
      const badge = await Badge.findOne({ name: 'Health Champion' });
      if (badge) {
        const userBadge = await UserBadge.findOne({ user: userId, badge: badge._id });
        if (!userBadge) {
          const newUserBadge = new UserBadge({ user: userId, badge: badge._id });
          await newUserBadge.save();
        }
      }

      // Award points
      let communityPoint = await CommunityPoint.findOne({ user: userId });
      if (!communityPoint) {
        communityPoint = new CommunityPoint({ user: userId, points: 0, history: [] });
      }
      communityPoint.points += 10;
      communityPoint.history.push({ points: 10, reason: `Completed quiz: ${quiz.title}` });
      await communityPoint.save();
    }

    res.json({ score, percentage });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/badges', async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/:userId/badges', async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.params.userId }).populate('badge');
    res.json(userBadges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/:userId/points', async (req, res) => {
  try {
    const communityPoint = await CommunityPoint.findOne({ user: req.params.userId });
    res.json(communityPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/community-points', async (req, res) => {
  try {
    const communityPoints = await CommunityPoint.find().populate('user', 'name').sort({ points: -1 });
    res.json(communityPoints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Family Health routes
app.post('/api/family-cards', authUser, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const newFamilyCard = new FamilyCard({
      name,
      userId,
    });

    const familyCard = await newFamilyCard.save();
    res.json(familyCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/family-cards/:cardId/members', authUser, async (req, res) => {
  const { name, dob, relation } = req.body;
  const { cardId } = req.params;

  try {
    const newFamilyMember = new FamilyMember({
      name,
      dob,
      relation,
    });

    const familyMember = await newFamilyMember.save();

    const familyCard = await FamilyCard.findById(cardId);
    familyCard.members.push(familyMember._id);
    await familyCard.save();

    res.json(familyMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/family-cards/:cardId/members/:memberId', authUser, async (req, res) => {
  const { medicalHistory, prescriptions, vaccinations, chronicIllnesses } = req.body;
  const { memberId } = req.params;

  try {
    const member = await FamilyMember.findById(memberId);

    if (!member) {
      return res.status(404).json({ msg: 'Family member not found' });
    }

    if (medicalHistory) {
      member.medicalHistory.push(medicalHistory);
    }
    if (prescriptions) {
      member.prescriptions.push(prescriptions);
    }
    if (vaccinations) {
      member.vaccinations.push(vaccinations);
    }
    if (chronicIllnesses) {
      member.chronicIllnesses.push(chronicIllnesses);
    }

    await member.save();
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/family-cards/user/:userId', authUser, async (req, res) => {
  try {
    const familyCards = await FamilyCard.find({ userId: req.params.userId }).populate('members');
    res.json(familyCards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/family-cards/:cardId/members', authUser, async (req, res) => {
  try {
    const familyCard = await FamilyCard.findById(req.params.cardId).populate('members');
    if (!familyCard) {
      return res.status(404).json({ msg: 'Family card not found' });
    }
    res.json(familyCard.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const { GoogleGenerativeAI } = require("@google/genai");

// Add a new route for the chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.json({ message: text });
  } catch (error) {
    console.error("Error in Gemini API call:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: "Error processing your request", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
