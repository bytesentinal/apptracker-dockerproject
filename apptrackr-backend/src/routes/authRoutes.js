const express = require('express');
const router = express.Router();
const { register, login, logout, refresh } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

// Test protected route
router.get('/me', protect, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;