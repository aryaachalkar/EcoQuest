// ═══════════════════════════════════════════════════════════════
//  Lesson Routes — /api/lessons
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// ─── GET /api/lessons — List all lessons (optionally filter by class) ──
router.get('/', async (req, res) => {
  try {
    const filter = {};

    // Optional query param: ?classStandard=7
    if (req.query.classStandard) {
      filter.classStandard = parseInt(req.query.classStandard);
    }

    const lessons = await Lesson.find(filter)
      .select('title description classStandard icon createdAt')
      .sort({ classStandard: 1, title: 1 });

    res.json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error('Lessons fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/lessons/:id — Get a specific lesson's full details ──
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    res.json({ success: true, lesson });
  } catch (error) {
    console.error('Lesson detail error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
