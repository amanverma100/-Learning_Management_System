const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one option is required']
  },
  correctOption: {
    type: Number,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one question is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
