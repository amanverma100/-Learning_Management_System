const express = require('express');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/lesson/:lessonId/complete', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!progress) {
      return res.status(400).json({ error: 'Not enrolled in this course' });
    }

    
    if (!progress.completedLessons.includes(req.params.lessonId)) {
      progress.completedLessons.push(req.params.lessonId);
      await progress.save();
    }

    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('completedLessons', 'title')
      .populate('quizAttempts.quiz', 'title');

    if (!progress) {
      return res.status(400).json({ error: 'Not enrolled in this course' });
    }

    const course = await Course.findById(req.params.courseId)
      .populate('lessons', 'title');

    const totalLessons = course.lessons.length;
    const completedLessons = progress.completedLessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      progress: {
        completedLessons: progress.completedLessons,
        quizAttempts: progress.quizAttempts,
        totalLessons,
        completedLessonsCount: completedLessons,
        progressPercentage
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;