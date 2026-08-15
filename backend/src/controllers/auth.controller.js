const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');
const { users, getNextUserId } = require('../config/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_stage1', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    const lowerEmail = email.toLowerCase();

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: lowerEmail });
      if (userExists) {
        return res.status(400).json({ status: 'error', message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user'
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        status: 'success',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // MemoryStore fallback
      const userExists = users.find(u => u.email === lowerEmail);
      if (userExists) {
        return res.status(400).json({ status: 'error', message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: getNextUserId(),
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);

      const token = generateToken(newUser._id);
      return res.status(201).json({
        status: 'success',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
    }

    const lowerEmail = email.toLowerCase();

    if (getIsConnected()) {
      const user = await User.findOne({ email: lowerEmail });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password credentials' });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        status: 'success',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // MemoryStore fallback
      const user = users.find(u => u.email === lowerEmail);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password credentials' });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        status: 'success',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt
    }
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (getIsConnected()) {
      const user = await User.findById(req.user._id);
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase();
      await user.save();

      return res.status(200).json({
        status: 'success',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      const user = users.find(u => u._id.toString() === req.user._id.toString());
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        user.updatedAt = new Date();
      }
      return res.status(200).json({
        status: 'success',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: 'error', message: 'Please provide current and new password' });
    }

    if (getIsConnected()) {
      const user = await User.findById(req.user._id);
      if (!(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    } else {
      const user = users.find(u => u._id.toString() === req.user._id.toString());
      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    res.status(200).json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword };
