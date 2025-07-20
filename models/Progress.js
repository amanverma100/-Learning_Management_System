const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  quizAttempts: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    totalQuestions: Number,
    attemptDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});


progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);