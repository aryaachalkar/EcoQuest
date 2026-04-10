// ═══════════════════════════════════════════════════════════════
//  Authentication Routes — /api/auth
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Helper: generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── POST /api/auth/register ─────────────────────────────────
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('schoolName').trim().notEmpty().withMessage('School name is required'),
    body('classStandard')
      .isInt({ min: 1, max: 10 })
      .withMessage('Class must be between 1 and 10'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('role')
      .optional()
      .isIn(['student', 'teacher', 'ngo'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      // Validate inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { firstName, lastName, schoolName, classStandard, email, rollNumber, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { rollNumber: rollNumber.toUpperCase() }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email or roll number already exists',
        });
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        schoolName,
        classStandard,
        email,
        rollNumber,
        password,
        role: role || 'student',
      });

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully! 🌱',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          rollNumber: user.rollNumber,
          classStandard: user.classStandard,
          schoolName: user.schoolName,
          role: user.role,
          totalPoints: user.totalPoints,
        },
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({ success: false, message: 'Server error during registration' });
    }
  }
);

// ─── POST /api/auth/login ────────────────────────────────────
router.post(
  '/login',
  [
    body('identifier').trim().notEmpty().withMessage('Email or Roll Number is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role')
      .optional()
      .isIn(['student', 'teacher', 'ngo'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { identifier, password, role } = req.body;

      // Find user by email OR roll number, and include password field
      const query = {
        $or: [
          { email: identifier.toLowerCase() },
          { rollNumber: identifier.toUpperCase() },
        ],
      };

      // If role is provided, add it to the query
      if (role) {
        query.role = role;
      }

      const user = await User.findOne(query).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials — no account found',
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials — wrong password',
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Welcome back! 🌿',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          rollNumber: user.rollNumber,
          classStandard: user.classStandard,
          schoolName: user.schoolName,
          role: user.role,
          totalPoints: user.totalPoints,
        },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }
);

module.exports = router;
