import { Router } from 'express';
import {
  addProjectMember,
  createProject,
  getProject,
  listProjects
} from '../controllers/projectController.js';
import { createTask, listTasks } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addMemberRules, createProjectRules, projectIdParam } from '../validators/projectValidators.js';
import { createTaskRules } from '../validators/taskValidators.js';

export const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.route('/').get(listProjects).post(createProjectRules, validate, createProject);
projectRouter.get('/:projectId', projectIdParam, validate, getProject);
projectRouter.post('/:projectId/members', addMemberRules, validate, addProjectMember);
projectRouter.route('/:projectId/tasks').get(projectIdParam, validate, listTasks).post(createTaskRules, validate, createTask);

export default projectRouter;