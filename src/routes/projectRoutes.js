import { Router } from 'express';
import {
  addProjectMember,
  createProject,
  getProject,
  listProjects
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addMemberRules, createProjectRules, projectIdParam } from '../validators/projectValidators.js';

const router = Router();

router.use(authenticate);

router.route('/').get(listProjects).post(createProjectRules, validate, createProject);
router.get('/:projectId', projectIdParam, validate, getProject);
router.post('/:projectId/members', addMemberRules, validate, addProjectMember);
export default router;