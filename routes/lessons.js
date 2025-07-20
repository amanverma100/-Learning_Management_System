const express = require('express');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, videoUrl, resourceLinks, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    let lessonOrder = order;

    if (!lessonOrder) {
      const count = await Lesson.countDocuments({ course: courseId });
      lessonOrder = count + 1;
    } else {
      await Lesson.updateMany(
        { course: courseId, order: { $gte: lessonOrder } },
        { $inc: { order: 1 } }
      );
    }

    const lesson = new Lesson({
      title,
      videoUrl,
      resourceLinks,
      course: courseId,
      order: lessonOrder
    });

    await lesson.save();
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
