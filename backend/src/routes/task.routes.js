const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

// All task routes require authentication
router.use(protect);

router.route('/')
  .post(createTask)
  .get(getTasks);

router.get('/stats/summary', getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
