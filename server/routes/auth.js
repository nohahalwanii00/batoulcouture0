const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_SECRET
} = process.env;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET not set in environment. Set it in server/.env');
}

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Simple admin auth using environment variables
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin', email }, JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;