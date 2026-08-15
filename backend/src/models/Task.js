const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      trim: true
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: ['Work', 'Study', 'Personal', 'Project', 'Design', 'Backend', 'Frontend', 'Documentation', 'Other'],
      default: 'Work'
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexing for search performance
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
