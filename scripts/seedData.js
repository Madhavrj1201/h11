const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Problem = require('../models/Problem');
const Assignment = require('../models/Assignment');
const CodeRoom = require('../models/CodeRoom');
const Contest = require('../models/Contest');
const CodingTrack = require('../models/CodingTrack');
const MockTest = require('../models/MockTest');

const MONGO_URL = "mongodb+srv://madhavvelu:Madhav1201@cluster0.jrmvp4q.mongodb.net/";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Problem.deleteMany({}),
      Assignment.deleteMany({}),
      CodeRoom.deleteMany({}),
      Contest.deleteMany({}),
      CodingTrack.deleteMany({}),
      MockTest.deleteMany({})
    ]);

    // Create users
    const users = await User.create([
      {
        username: 'student1',
        email: 'student1@example.com',
        role: 'student',
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
      {
        username: 'faculty1',
        email: 'faculty1@example.com',
        role: 'faculty',
        profile: {
          firstName: 'Sarah',
          lastName: 'Wilson',
          department: 'Computer Science'
        }
      }
    ]);

    // Create courses
    const courses = await Course.create([
      {
        title: 'Data Structures and Algorithms',
        code: 'CS301',
        description: 'Fundamental course on DSA concepts',
        instructor: users[1]._id,
        type: 'coding',
        semester: 3,
        department: 'Computer Science',
        credits: 4,
        maxStudents: 60,
        students: [users[0]._id],
        schedule: [{
          day: 'Monday',
          startTime: '10:00',
          endTime: '11:30',
          room: 'CS-Lab-1'
        }],
        content: [{
          title: 'Introduction to Arrays',
          type: 'lecture',
          content: 'Basics of array data structure',
          isPublished: true
        }]
      }
    ]);

    // Create problems
    const problems = await Problem.create([
      {
        title: 'Two Sum',
        description: 'Find two numbers in array that add up to target',
        difficulty: 'easy',
        category: 'arrays',
        testCases: [{
          input: '[2,7,11,15], target = 9',
          expectedOutput: '[0,1]',
          isHidden: false,
          explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
        }],
        statistics: {
          totalSubmissions: 100,
          acceptedSubmissions: 75,
          difficulty_rating: 3
        }
      }
    ]);

    // Create coding tracks
    const tracks = await CodingTrack.create([
      {
        title: 'DSA Mastery',
        description: 'Master Data Structures and Algorithms',
        category: 'DSA',
        difficulty: 'intermediate',
        modules: [{
          title: 'Array Fundamentals',
          description: 'Basic array operations and algorithms',
          order: 1,
          estimatedHours: 4,
          problems: [problems[0]._id]
        }]
      }
    ]);

    // Create contests
    const contests = await Contest.create([
      {
        title: 'Weekly Coding Challenge',
        description: 'Test your coding skills',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-21'),
        problems: [{
          title: 'Array Rotation',
          description: 'Rotate array by k positions',
          difficulty: 'medium',
          points: 100
        }],
        status: 'upcoming'
      }
    ]);

    // Create mock tests
    const mockTests = await MockTest.create([
      {
        title: 'Practice Interview - DSA',
        description: 'Mock technical interview',
        type: 'coding',
        duration: 120,
        questions: [{
          type: 'coding',
          question: 'Implement a stack using arrays',
          points: 25
        }],
        scheduledFor: new Date('2024-01-25'),
        eligibilityCriteria: {
          minCGPA: 7.5,
          requiredSkills: ['DSA', 'Problem Solving']
        }
      }
    ]);

    // Create code rooms
    const codeRooms = await CodeRoom.create([
      {
        title: 'DSA Problem Solving Session',
        description: 'Collaborative problem solving',
        participants: [{
          user: users[0]._id,
          role: 'host'
        }],
        code: {
          content: '// Initial code\nfunction solve() {\n  // Your solution here\n}',
          language: 'javascript'
        },
        status: 'active'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();