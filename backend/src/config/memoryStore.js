const bcrypt = require('bcryptjs');

// In-memory data store arrays
const users = [];
const tasks = [];

let userIdCounter = 100;
let taskIdCounter = 1000;

// Seed default users & tasks
const initMemoryStore = async () => {
  if (users.length === 0) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const adminUser = {
      _id: 'usr_admin_1',
      name: 'System Admin',
      email: 'admin@taskflow.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const demoUser = {
      _id: 'usr_demo_1',
      name: 'John Doe',
      email: 'john@taskflow.com',
      password: userPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(adminUser, demoUser);

    tasks.push(
      {
        _id: 'tsk_1',
        title: 'Design TaskFlow UI Dashboard Wireframes',
        description: 'Create high-fidelity dark glassmorphic wireframes for user and admin dashboards.',
        status: 'completed',
        priority: 'high',
        category: 'Design',
        dueDate: new Date(Date.now() + 86400000 * 2),
        createdBy: demoUser,
        assignedTo: demoUser,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'tsk_2',
        title: 'Configure Express REST API & JWT Auth',
        description: 'Set up JWT authentication, password hashing, and error handling middlewares.',
        status: 'in-progress',
        priority: 'high',
        category: 'Backend',
        dueDate: new Date(Date.now() + 86400000 * 4),
        createdBy: demoUser,
        assignedTo: demoUser,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'tsk_3',
        title: 'Implement Task Search, Filter and Sort',
        description: 'Enable multi-criteria search by title/description, filter by status, and sort by due date.',
        status: 'todo',
        priority: 'medium',
        category: 'Frontend',
        dueDate: new Date(Date.now() + 86400000 * 7),
        createdBy: demoUser,
        assignedTo: demoUser,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'tsk_4',
        title: 'Prepare Internship Final Presentation',
        description: 'Compile system documentation, architecture diagrams, and feature walkthrough slides.',
        status: 'todo',
        priority: 'low',
        category: 'Documentation',
        dueDate: new Date(Date.now() + 86400000 * 10),
        createdBy: adminUser,
        assignedTo: demoUser,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    console.log('⚡ MemoryStore initialized with pre-seeded users and sample tasks!');
  }
};

initMemoryStore();

module.exports = {
  users,
  tasks,
  getNextUserId: () => `usr_${++userIdCounter}`,
  getNextTaskId: () => `tsk_${++taskIdCounter}`
};
