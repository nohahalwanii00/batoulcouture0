const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

function normalizeEnvString(value) {
  if (value === undefined || value === null) return '';
  const trimmed = String(value).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function maskEmail(email) {
  const normalized = String(email || '').trim();
  if (!normalized) return '';
  const [local, domain] = normalized.split('@');
  if (!domain) return `${normalized.slice(0, 2)}***`;
  const safeLocal = local.length <= 2 ? `${local}***` : `${local.slice(0, 2)}***`;
  return `${safeLocal}@${domain}`;
}

router.post('/login', (req, res) => {
  try {
    const adminEmail = normalizeEnvString(process.env.ADMIN_EMAIL);
    const adminPassword = normalizeEnvString(process.env.ADMIN_PASSWORD);
    const jwtSecret = normalizeEnvString(process.env.JWT_SECRET);
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

    // This checks user credentials and returns a token.
    if (email === adminEmail.toLowerCase() && password === adminPassword) {
      const token = jwt.sign({ role: 'admin', email }, jwtSecret || 'dev_secret', { expiresIn: '7d' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/status', (req, res) => {
  try {
    const rawAdminEmail = process.env.ADMIN_EMAIL;
    const rawAdminPassword = process.env.ADMIN_PASSWORD;
    const rawJwtSecret = process.env.JWT_SECRET;

    const adminEmail = normalizeEnvString(rawAdminEmail);
    const adminPassword = normalizeEnvString(rawAdminPassword);
    const jwtSecret = normalizeEnvString(rawJwtSecret);
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(200).json({
      ok: true,
      nodeEnv: process.env.NODE_ENV || 'development',
      isProduction,
      adminEmailConfigured: Boolean(adminEmail),
      adminPasswordConfigured: Boolean(adminPassword),
      jwtSecretConfigured: Boolean(jwtSecret),
      jwtSecretRequired: isProduction,
      adminEmailPreview: adminEmail ? maskEmail(adminEmail) : '',
      adminEmailHasWhitespace: Boolean(rawAdminEmail && String(rawAdminEmail) !== String(rawAdminEmail).trim()),
      adminPasswordHasWhitespace: Boolean(
        rawAdminPassword && String(rawAdminPassword) !== String(rawAdminPassword).trim()
      ),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

module.exports = router;
