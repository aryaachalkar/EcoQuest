// ═══════════════════════════════════════════════════════════════
//  TaskSubmission Model
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    proofImageUrl: {
      type: String,
      required: [true, 'Proof image is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewerNote: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema);
