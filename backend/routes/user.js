const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    }
  });
});

router.get('/dashboard', protect, (req, res) => {
  res.json({
    message: `Welcome back, ${req.user.name}!`,
    stats: {
      memberSince: req.user.createdAt,
      lastActive: new Date().toISOString()
    }
  });
});

module.exports = router;