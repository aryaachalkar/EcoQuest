// ═══════════════════════════════════════════════════════════════
//  QuizAttempt Model — tracks which quizzes a user has completed
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    pointsEarned: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attempts on the same quiz
quizAttemptSchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
