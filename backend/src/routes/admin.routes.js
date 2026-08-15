const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllSystemTasks,
  deleteSystemTask,
  getAdminStats
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/tasks', getAllSystemTasks);
router.delete('/tasks/:id', deleteSystemTask);

router.get('/stats', getAdminStats);

module.exports = router;
