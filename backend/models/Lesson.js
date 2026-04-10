// ═══════════════════════════════════════════════════════════════
//  Lesson Model
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Lesson description is required'],
      trim: true,
    },
    content: {
      type: String, // Can hold HTML or rich text
      required: [true, 'Lesson content is required'],
    },
    classStandard: {
      type: Number,
      required: [true, 'Class/Standard is required'],
      min: 1,
      max: 10,
    },
    icon: {
      type: String, // Emoji or icon identifier for the frontend cards
      default: '🌿',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
