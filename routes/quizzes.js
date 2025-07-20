const express = require('express');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();


router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const quiz = new Quiz({
      title,
      course: courseId,
      questions
    });

    await quiz.save();

  
    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/:id/attempt', auth, async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      return res.status(400).json({ error: 'Quiz has no questions' });
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    for (let i = 0; i < totalQuestions; i++) {
      const question = quiz.questions[i];
      if (!question || !Array.isArray(question.options)) continue;

      const userAnswer = answers[i];
      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);

      if (userAnswer === correctOptionIndex) {
        score++;
      }
    }

    const progress = await Progress.findOne({
      user: req.user.id,
      course: quiz.course
    });

    if (!progress) {
      return res.status(400).json({ error: 'Not enrolled in this course' });
    }

    progress.quizAttempts.push({
      quiz: quiz._id,
      score,
      totalQuestions,
      attemptDate: new Date()
    });

    await progress.save();

    res.json({
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
