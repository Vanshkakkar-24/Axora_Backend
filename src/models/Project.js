import mongoose from 'mongoose';
import { PROJECT_ROLES } from '../constants/index.js';

const projectMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: PROJECT_ROLES,
      default: 'member'
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: {
      type: [projectMemberSchema],
      default: []
    }
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ name: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);

export default Project;