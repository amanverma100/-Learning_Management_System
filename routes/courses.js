const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { auth, adminAuth } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validation');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.find()
      .select('title description instructor price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments();

    res.json({
      courses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCourses: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons', 'title videoUrl resourceLinks order')
      .populate('quizzes', 'title');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', adminAuth, validateCourse, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const user = await User.findById(req.user.id);
    

    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }


    user.enrolledCourses.push(course._id);
    await user.save();

   
    course.enrolledStudents.push(user._id);
    await course.save();

 
    const progress = new Progress({
      user: user._id,
      course: course._id,
      completedLessons: [],
      quizAttempts: []
    });
    await progress.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;