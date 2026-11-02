const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const spService = require('../services/spService');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_for_realestate_app_2323';

// Auth middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// 1. Customer Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ error: 'First name, email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUsers = await spService.query('SELECT id FROM Users WHERE email = ?', [cleanEmail]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into MySQL
    const result = await spService.query(
      'INSERT INTO Users (firstName, lastName, email, password, phone, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [firstName.trim(), lastName ? lastName.trim() : '', cleanEmail, hashedPassword, phone || '', 'customer']
    );

    const newUser = {
      id: result.insertId,
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      email: cleanEmail,
      phone: phone || '',
      role: 'customer'
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, firstName: newUser.firstName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send Welcome Email asynchronously
    emailService.sendUserWelcomeEmail(newUser).catch(err => {
      console.error('[Auth] Failed to send welcome email:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration' });
  }
});

// 2. Customer Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = await spService.query('SELECT * FROM Users WHERE email = ?', [cleanEmail]);

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Server error during login' });
  }
});

// 3. Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admins = await spService.query('SELECT * FROM AdminUsers WHERE email = ?', [cleanEmail]);

    if (admins.length === 0) {
      return res.status(400).json({ error: 'Invalid admin credentials' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: err.message || 'Server error during admin login' });
  }
});

// 4. Get Current User / Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const users = await spService.query(
      'SELECT id, firstName, lastName, email, phone, avatar, role, createdAt FROM Users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      // Check if admin user
      const admins = await spService.query(
        'SELECT id, name, email, role, createdAt FROM AdminUsers WHERE id = ?',
        [req.user.id]
      );
      if (admins.length === 0) return res.status(404).json({ error: 'User not found' });
      return res.json({ ...admins[0], isAdmin: true });
    }

    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    await spService.query(
      'UPDATE Users SET firstName = ?, lastName = ?, phone = ?, avatar = ?, updatedAt = NOW() WHERE id = ?',
      [firstName, lastName, phone, avatar || null, req.user.id]
    );

    const updated = await spService.query(
      'SELECT id, firstName, lastName, email, phone, avatar, role FROM Users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, message: 'Profile updated successfully', user: updated[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Forgot Password (generates token & dispatches email)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });

    const cleanEmail = email.toLowerCase().trim();
    const users = await spService.query('SELECT * FROM Users WHERE email = ?', [cleanEmail]);

    if (users.length === 0) {
      // Return success anyway for security best practice to prevent email enumeration
      return res.json({ success: true, message: 'If an account exists with that email, a password reset link has been dispatched.' });
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await spService.query(
      'UPDATE Users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?',
      [resetToken, expiry, user.id]
    );

    await emailService.sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ error: 'Email, reset token, and new password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = await spService.query(
      'SELECT * FROM Users WHERE email = ? AND resetToken = ? AND resetTokenExpiry > NOW()',
      [cleanEmail, resetToken]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired password reset link' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await spService.query(
      'UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL, updatedAt = NOW() WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
