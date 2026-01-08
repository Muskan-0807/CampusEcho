const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength:1000,
  },
  category: {
    type: String,
    enum: ['Hostel', 'Mess', 'Academic','Infrastructure','Library','Security','IT/Network', 'Others'],
    required: true
  },
  
  // Student who posted (identity hidden in public view)
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },

  //official admin response (only one, editable)
  adminResponse: {
    type: String,
    default: ''
  },
  
  //student-only comments/agrees/disagrees
  agrees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  disagrees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
issueSchema.index({ studentId: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });

module.exports = mongoose.model('Issue', issueSchema);