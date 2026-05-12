import e, { Router } from 'express';
import { deleteTask, updateTask } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { taskIdParam, updateTaskRules } from '../validators/taskValidators.js';

export const router = Router();

router.use(authenticate);

router.patch('/:taskId', updateTaskRules, validate, updateTask);
router.delete('/:taskId', taskIdParam, validate, deleteTask);

export default router;