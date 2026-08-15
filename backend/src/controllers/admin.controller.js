const User = require('../models/User');
const Task = require('../models/Task');
const { getIsConnected } = require('../config/db');
const { users, tasks } = require('../config/memoryStore');

const getAllUsers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const dbUsers = await User.find({}).select('-password');
      return res.status(200).json({ status: 'success', count: dbUsers.length, users: dbUsers });
    } else {
      const sanitized = users.map(({ password, ...u }) => u);
      return res.status(200).json({ status: 'success', count: sanitized.length, users: sanitized });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (getIsConnected()) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      await Task.deleteMany({ $or: [{ createdBy: req.params.id }, { assignedTo: req.params.id }] });
      await user.deleteOne();
      return res.status(200).json({ status: 'success', message: 'User deleted' });
    } else {
      const index = users.findIndex(u => u._id.toString() === req.params.id.toString());
      if (index === -1) return res.status(404).json({ status: 'error', message: 'User not found' });
      users.splice(index, 1);
      return res.status(200).json({ status: 'success', message: 'User deleted' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getAllSystemTasks = async (req, res) => {
  try {
    if (getIsConnected()) {
      const systemTasks = await Task.find({}).populate('createdBy', 'name email');
      return res.status(200).json({ status: 'success', count: systemTasks.length, tasks: systemTasks });
    } else {
      return res.status(200).json({ status: 'success', count: tasks.length, tasks });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteSystemTask = async (req, res) => {
  try {
    if (getIsConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      await task.deleteOne();
      return res.status(200).json({ status: 'success', message: 'Task removed' });
    } else {
      const index = tasks.findIndex(t => t._id.toString() === req.params.id.toString());
      if (index === -1) return res.status(404).json({ status: 'error', message: 'Task not found' });
      tasks.splice(index, 1);
      return res.status(200).json({ status: 'success', message: 'Task removed' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    let uList = getIsConnected() ? await User.find({}) : users;
    let tList = getIsConnected() ? await Task.find({}) : tasks;

    const totalUsers = uList.length;
    const adminCount = uList.filter(u => u.role === 'admin').length;
    const standardUserCount = uList.filter(u => u.role === 'user').length;
    const totalTasks = tList.length;

    res.status(200).json({
      status: 'success',
      stats: {
        totalUsers,
        adminCount,
        standardUserCount,
        totalTasks
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllSystemTasks,
  deleteSystemTask,
  getAdminStats
};
