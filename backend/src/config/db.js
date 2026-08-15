const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let isConnected = false;

// Seed initial users & tasks for instant demonstration
const seedInitialData = async (User, Task) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial TaskFlow database records...');

      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);

      const adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@taskflow.com',
        password: adminPassword,
        role: 'admin'
      });

      const demoUser = await User.create({
        name: 'John Doe',
        email: 'john@taskflow.com',
        password: userPassword,
        role: 'user'
      });

      const sampleTasks = [
        {
          title: 'Design TaskFlow UI Dashboard Wireframes',
          description: 'Create high-fidelity dark glassmorphic wireframes for user and admin dashboards.',
          status: 'completed',
          priority: 'high',
          category: 'Design',
          dueDate: new Date(Date.now() + 86400000 * 2),
          createdBy: demoUser._id,
          assignedTo: demoUser._id
        },
        {
          title: 'Configure Express REST API & JWT Auth',
          description: 'Set up JWT authentication, password hashing, and error handling middlewares.',
          status: 'in-progress',
          priority: 'high',
          category: 'Backend',
          dueDate: new Date(Date.now() + 86400000 * 4),
          createdBy: demoUser._id,
          assignedTo: demoUser._id
        },
        {
          title: 'Implement Task Search, Filter and Sort',
          description: 'Enable multi-criteria search by title/description, filter by status, and sort by due date.',
          status: 'todo',
          priority: 'medium',
          category: 'Frontend',
          dueDate: new Date(Date.now() + 86400000 * 7),
          createdBy: demoUser._id,
          assignedTo: demoUser._id
        },
        {
          title: 'Prepare Internship Final Presentation',
          description: 'Compile system documentation, architecture diagrams, and feature walkthrough slides.',
          status: 'todo',
          priority: 'low',
          category: 'Documentation',
          dueDate: new Date(Date.now() + 86400000 * 10),
          createdBy: adminUser._id,
          assignedTo: demoUser._id
        }
      ];

      await Task.insertMany(sampleTasks);
      console.log('✅ Seeded initial database with 2 users & 4 sample tasks!');
    }
  } catch (err) {
    console.error('Error seeding data:', err.message);
  }
};

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow_db';
  
  // Disable Mongoose command buffering when disconnected to prevent hanging queries
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // 2 seconds fast timeout
    });
    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    const User = require('../models/User');
    const Task = require('../models/Task');
    await seedInitialData(User, Task);

  } catch (error) {
    console.warn(`⚠️ Local MongoDB service not detected on port 27017. Initializing instant memory-based data repository.`);
    isConnected = false;
  }
};

module.exports = { connectDB, getIsConnected: () => isConnected };
