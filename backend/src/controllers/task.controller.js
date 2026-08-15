const Task = require('../models/Task');
const { getIsConnected } = require('../config/db');
const { tasks, getNextTaskId } = require('../config/memoryStore');

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;
    if (!title || !description || !dueDate) {
      return res.status(400).json({ status: 'error', message: 'Please provide title, description, and due date' });
    }

    if (getIsConnected()) {
      const task = await Task.create({
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        category: category || 'Work',
        dueDate,
        createdBy: req.user._id,
        assignedTo: req.user._id
      });
      const populatedTask = await Task.findById(task._id).populate('createdBy', 'name email');
      return res.status(201).json({ status: 'success', task: populatedTask });
    } else {
      const newTask = {
        _id: getNextTaskId(),
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        category: category || 'Work',
        dueDate: new Date(dueDate),
        createdBy: { _id: req.user._id, name: req.user.name, email: req.user.email },
        assignedTo: { _id: req.user._id, name: req.user.name, email: req.user.email },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      tasks.unshift(newTask);
      return res.status(201).json({ status: 'success', task: newTask });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { search, status, priority, category, sortBy } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (req.user.role !== 'admin') {
        query.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (status && status !== 'all') query.status = status;
      if (priority && priority !== 'all') query.priority = priority;
      if (category && category !== 'all') query.category = category;

      let sort = { createdAt: -1 };
      if (sortBy === 'oldest') sort = { createdAt: 1 };
      if (sortBy === 'dueDate') sort = { dueDate: 1 };

      const resultTasks = await Task.find(query).populate('createdBy', 'name email').sort(sort);
      return res.status(200).json({ status: 'success', count: resultTasks.length, tasks: resultTasks });
    } else {
      // MemoryStore query
      let filtered = tasks.filter((t) => {
        if (req.user.role !== 'admin') {
          const isCreator = t.createdBy?._id?.toString() === req.user._id?.toString();
          const isAssignee = t.assignedTo?._id?.toString() === req.user._id?.toString();
          if (!isCreator && !isAssignee) return false;
        }
        if (search) {
          const matchTitle = t.title.toLowerCase().includes(search.toLowerCase());
          const matchDesc = t.description.toLowerCase().includes(search.toLowerCase());
          if (!matchTitle && !matchDesc) return false;
        }
        if (status && status !== 'all' && t.status !== status) return false;
        if (priority && priority !== 'all' && t.priority !== priority) return false;
        if (category && category !== 'all' && t.category !== category) return false;
        return true;
      });

      // Sorting
      if (sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === 'dueDate') {
        filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.status(200).json({ status: 'success', count: filtered.length, tasks: filtered });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    if (getIsConnected()) {
      const task = await Task.findById(req.params.id).populate('createdBy', 'name email');
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'success', task });
    } else {
      const task = tasks.find(t => t._id.toString() === req.params.id.toString());
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'success', task });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;
    if (getIsConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });

      if (title) task.title = title;
      if (description) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (category) task.category = category;
      if (dueDate) task.dueDate = dueDate;

      const updatedTask = await task.save();
      const populated = await Task.findById(updatedTask._id).populate('createdBy', 'name email');
      return res.status(200).json({ status: 'success', task: populated });
    } else {
      const taskIndex = tasks.findIndex(t => t._id.toString() === req.params.id.toString());
      if (taskIndex === -1) return res.status(404).json({ status: 'error', message: 'Task not found' });

      const task = tasks[taskIndex];
      if (title) task.title = title;
      if (description) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (category) task.category = category;
      if (dueDate) task.dueDate = new Date(dueDate);
      task.updatedAt = new Date();

      return res.status(200).json({ status: 'success', task });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (getIsConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      await task.deleteOne();
      return res.status(200).json({ status: 'success', id: req.params.id });
    } else {
      const index = tasks.findIndex(t => t._id.toString() === req.params.id.toString());
      if (index === -1) return res.status(404).json({ status: 'error', message: 'Task not found' });
      tasks.splice(index, 1);
      return res.status(200).json({ status: 'success', id: req.params.id });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (getIsConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      task.status = status;
      await task.save();
      return res.status(200).json({ status: 'success', task });
    } else {
      const task = tasks.find(t => t._id.toString() === req.params.id.toString());
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      task.status = status;
      task.updatedAt = new Date();
      return res.status(200).json({ status: 'success', task });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getTaskStats = async (req, res) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Task.find({});
    } else {
      list = tasks;
    }

    const totalTasks = list.length;
    const todoTasks = list.filter(t => t.status === 'todo').length;
    const inProgressTasks = list.filter(t => t.status === 'in-progress').length;
    const completedTasks = list.filter(t => t.status === 'completed').length;
    const highPriorityTasks = list.filter(t => t.priority === 'high').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      status: 'success',
      stats: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        highPriorityTasks,
        completionRate
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats
};
