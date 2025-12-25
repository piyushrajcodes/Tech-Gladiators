const mongoose = require('mongoose');
const connectDB = require('./db');
const Quiz = require('./models/Quiz');
const Badge = require('./models/Badge');

const quizzes = [
  {
    title: 'Hygiene Quiz',
    questions: [
      {
        question: 'How often should you wash your hands?',
        options: ['Once a day', 'After every meal', 'Before and after meals, and after using the toilet', 'Only when they look dirty'],
        correctAnswer: 'Before and after meals, and after using the toilet',
      },
      {
        question: 'What is the most effective way to prevent the spread of germs?',
        options: ['Wearing a mask', 'Washing your hands', 'Using hand sanitizer', 'Avoiding crowded places'],
        correctAnswer: 'Washing your hands',
      },
    ],
  },
  {
    title: 'Nutrition Quiz',
    questions: [
      {
        question: 'Which of these is a good source of protein?',
        options: ['Apple', 'Lentils', 'Bread', 'Rice'],
        correctAnswer: 'Lentils',
      },
      {
        question: 'What is a balanced diet?',
        options: ['Eating only fruits and vegetables', 'Eating a variety of foods from all food groups', 'Eating only protein', 'Eating only carbohydrates'],
        correctAnswer: 'Eating a variety of foods from all food groups',
      },
    ],
  },
];

const badges = [
  {
    name: 'Health Champion',
    description: 'Awarded for completing a quiz with 100% score.',
    icon: 'health_champion.png',
  },
  {
    name: 'Community Helper',
    description: 'Awarded for helping in awareness campaigns.',
    icon: 'community_helper.png',
  },
];

const seedDB = async () => {
  await connectDB();
  await Quiz.deleteMany({});
  await Badge.deleteMany({});
  await Quiz.insertMany(quizzes);
  await Badge.insertMany(badges);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB();
