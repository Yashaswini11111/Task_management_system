const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { users } = require('../config/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_stage1');

      let user;
      if (getIsConnected()) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = users.find((u) => u._id.toString() === decoded.id.toString());
      }

      if (!user) {
        return res.status(401).json({ status: 'error', message: 'User belonging to this token no longer exists' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ status: 'error', message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Not authorized, no bearer token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
  }
};

module.exports = { protect, adminOnly };
