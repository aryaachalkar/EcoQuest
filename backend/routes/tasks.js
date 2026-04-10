// ═══════════════════════════════════════════════════════════════
//  Task Routes — /api/tasks
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskSubmission = require('../models/TaskSubmission');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── GET /api/tasks — List all available tasks ───────────────
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Tasks fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/tasks/my-submissions — Get logged-in user's submissions ──
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.user._id })
      .populate('taskId', 'title pointsReward')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error('My submissions error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/tasks/upload-proof — Upload proof image ───────
router.post(
  '/upload-proof',
  protect,
  upload.single('proofImage'), // 'proofImage' must match the form field name in frontend
  async (req, res) => {
    try {
      const { taskId } = req.body;

      if (!taskId) {
        return res.status(400).json({
          success: false,
          message: 'taskId is required',
        });
      }

      // Check task exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Proof image file is required',
        });
      }

      // Check for duplicate submission
      const existingSubmission = await TaskSubmission.findOne({
        userId: req.user._id,
        taskId,
        status: { $in: ['pending', 'approved'] },
      });

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted proof for this task',
        });
      }

      // Create submission
      const submission = await TaskSubmission.create({
        userId: req.user._id,
        taskId,
        proofImageUrl: `/uploads/${req.file.filename}`,
        status: 'pending',
      });

      res.status(201).json({
        success: true,
        message: 'Proof uploaded successfully! Awaiting review 🌿',
        submission: {
          id: submission._id,
          taskId: submission.taskId,
          proofImageUrl: submission.proofImageUrl,
          status: submission.status,
          submittedAt: submission.submittedAt,
        },
      });
    } catch (error) {
      console.error('Upload proof error:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ─── GET /api/tasks/pending-reviews — Teachers see pending submissions ──
router.get(
  '/pending-reviews',
  protect,
  authorize('teacher', 'ngo'),
  async (req, res) => {
    try {
      const submissions = await TaskSubmission.find({ status: 'pending' })
        .populate('userId', 'firstName lastName rollNumber schoolName classStandard')
        .populate('taskId', 'title pointsReward')
        .sort({ submittedAt: -1 });

      res.json({
        success: true,
        count: submissions.length,
        submissions,
      });
    } catch (error) {
      console.error('Pending reviews error:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ─── PUT /api/tasks/review/:submissionId — Approve or reject ──
router.put(
  '/review/:submissionId',
  protect,
  authorize('teacher', 'ngo'),
  async (req, res) => {
    try {
      const { status, reviewerNote } = req.body;

      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be 'approved' or 'rejected'",
        });
      }

      const submission = await TaskSubmission.findById(req.params.submissionId)
        .populate('taskId', 'pointsReward title');

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found',
        });
      }

      if (submission.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'This submission has already been reviewed',
        });
      }

      // Update submission status
      submission.status = status;
      submission.reviewerNote = reviewerNote || '';
      await submission.save();

      // If approved, award points to the student
      if (status === 'approved') {
        await User.findByIdAndUpdate(submission.userId, {
          $inc: { totalPoints: submission.taskId.pointsReward },
        });
      }

      res.json({
        success: true,
        message: `Submission ${status} successfully ${status === 'approved' ? '✅' : '❌'}`,
        submission: {
          id: submission._id,
          status: submission.status,
          pointsAwarded: status === 'approved' ? submission.taskId.pointsReward : 0,
        },
      });
    } catch (error) {
      console.error('Review error:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
