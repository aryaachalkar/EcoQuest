// ═══════════════════════════════════════════════════════════════
//  Quiz Routes — /api/quizzes
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── GET /api/quizzes/:lessonId — Get quiz for a lesson ──────
router.get('/:lessonId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this lesson',
      });
    }

    // Return quiz WITHOUT correct answers (so students can't cheat)
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        lessonId: quiz.lessonId,
        pointsPerQuestion: quiz.pointsPerQuestion,
        totalQuestions: quiz.questions.length,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    console.error('Quiz fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/quizzes/submit — Submit quiz answers ──────────
router.post('/submit', protect, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    // answers should be an array like: [{ questionId: "...", selectedAnswer: "..." }, ...]

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'quizId and answers array are required',
      });
    }

    // Check if already attempted
    const existingAttempt = await QuizAttempt.findOne({
      userId: req.user._id,
      quizId,
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: 'You have already attempted this quiz',
        previousScore: existingAttempt.score,
      });
    }

    // Fetch quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Grade the quiz
    let correctCount = 0;
    const results = quiz.questions.map((question) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );
      const isCorrect =
        studentAnswer && studentAnswer.selectedAnswer === question.correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionId: question._id,
        questionText: question.questionText,
        correctAnswer: question.correctAnswer,
        studentAnswer: studentAnswer ? studentAnswer.selectedAnswer : null,
        isCorrect: !!isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const pointsEarned = correctCount * quiz.pointsPerQuestion;

    // Save attempt
    await QuizAttempt.create({
      userId: req.user._id,
      quizId,
      score: scorePercent,
      totalQuestions,
      correctAnswers: correctCount,
      pointsEarned,
    });

    // Add points to user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalPoints: pointsEarned },
    });

    res.json({
      success: true,
      message: `Quiz completed! You scored ${scorePercent}% 🎉`,
      score: scorePercent,
      correctAnswers: correctCount,
      totalQuestions,
      pointsEarned,
      results,
    });
  } catch (error) {
    console.error('Quiz submit error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
