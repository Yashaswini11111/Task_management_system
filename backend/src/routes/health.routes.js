const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint to verify backend status
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Management System API is running smoothly',
    stage: 'Stage 1 - Project Setup',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
