const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URL = "mongodb+srv://madhavvelu:Madhav1201@cluster0.jrmvp4q.mongodb.net/";

async function updateSpecificUsers() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // Update student1
    await User.findOneAndUpdate(
      { email: 'student1@example.com' },
      {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          department: 'Computer Science',
          semester: 3,
          enrollmentNumber: 'CS2023001',
          skills: [
            { name: 'Python', level: 75, endorsements: 5 },
            { name: 'JavaScript', level: 65, endorsements: 3 }
          ],
          streaks: { current: 5, longest: 12 },
          codingStats: {
            problemsSolved: 45,
            contestsParticipated: 3,
            ranking: 156,
            skillScore: 720
          }
        }
      },
      { new: true }
    );

    console.log('Updated student1 profile');

    // Update faculty1
    await User.findOneAndUpdate(
      { email: 'faculty1@example.com' },
      {
        profile: {
          firstName: 'Sarah',
          lastName: 'Wilson',
          department: 'Computer Science'
        }
      },
      { new: true }
    );

    console.log('Updated faculty1 profile');

    console.log('All specific users updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating user profiles:', error);
    process.exit(1);
  }
}

updateSpecificUsers();
