const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin login is not configured on the server.' });
    }

    if (isProduction && !jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured on the server.' });
    }

    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '').trim();
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Simple admin auth using environment variables
    if (email === adminEmail.trim().toLowerCase() && password === adminPassword) {
      const token = jwt.sign({ role: 'admin', email }, jwtSecret || 'dev_secret', { expiresIn: '7d' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
