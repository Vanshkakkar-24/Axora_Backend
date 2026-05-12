import mongoose from 'mongoose';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/index.js';

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'Medium'
    },
    dueDate: {
      type: Date,
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'Todo',
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, priority: 1 });
taskSchema.index({ project: 1, assignedTo: 1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);

export default Task;