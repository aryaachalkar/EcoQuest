// ═══════════════════════════════════════════════════════════════
//  User / Dashboard Routes — /api/users
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TaskSubmission = require('../models/TaskSubmission');
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/auth');

// ─── GET /api/users/me — Get current user's profile & stats ──
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get additional stats for the dashboard
    const tasksCompleted = await TaskSubmission.countDocuments({
      userId: req.user._id,
      status: 'approved',
    });

    const tasksPending = await TaskSubmission.countDocuments({
      userId: req.user._id,
      status: 'pending',
    });

    const quizzesCompleted = await QuizAttempt.countDocuments({
      userId: req.user._id,
    });

    // Calculate rank
    const rank = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints },
    });

    res.json({
      success: true,
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
        createdAt: user.createdAt,
      },
      stats: {
        tasksCompleted,
        tasksPending,
        quizzesCompleted,
        rank: rank + 1, // 1-based ranking
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/users/leaderboard — Top 50 users by points ─────
router.get('/leaderboard', async (req, res) => {
  try {
    const leaders = await User.find({ role: 'student' })
      .select('firstName lastName schoolName classStandard totalPoints')
      .sort({ totalPoints: -1 })
      .limit(50);

    res.json({
      success: true,
      leaderboard: leaders.map((user, index) => ({
        rank: index + 1,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        school: user.schoolName,
        classStandard: user.classStandard,
        totalPoints: user.totalPoints,
      })),
    });
  } catch (error) {
    console.error('Leaderboard error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
