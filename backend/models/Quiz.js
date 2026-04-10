// ═══════════════════════════════════════════════════════════════
//  Quiz Model
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length >= 2,
      message: 'At least 2 options are required',
    },
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pointsPerQuestion: {
      type: Number,
      default: 10,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'At least 1 question is required',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
