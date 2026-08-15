const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Initialize DB and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 TaskFlow Backend REST API Server running on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
