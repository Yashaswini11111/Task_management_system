const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Route Imports
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoint Registrations
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Root route welcome message
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow REST API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      admin: '/api/admin'
    }
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
