// ═══════════════════════════════════════════════════════════════
//  Task Model
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    pointsReward: {
      type: Number,
      required: true,
      default: 50,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    icon: {
      type: String,
      default: '🌱',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
