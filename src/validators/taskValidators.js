import { body, param } from 'express-validator';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/index.js';

export const taskIdParam = [param('taskId').isMongoId().withMessage('Valid task id is required')];

export const createTaskRules = [
  param('projectId').isMongoId().withMessage('Valid project id is required'),
  body('title').trim().isLength({ min: 2, max: 160 }).withMessage('Task title must be 2-160 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('priority').isIn(TASK_PRIORITIES).withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('dueDate').isISO8601().withMessage('Due date must be a valid ISO date'),
  body('assignedTo').isMongoId().withMessage('Assigned user id is required'),
  body('status').optional().isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`)
];

export const updateTaskRules = [
  ...taskIdParam,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage('Task title must be 2-160 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO date'),
  body('assignedTo').optional().isMongoId().withMessage('Assigned user id must be valid'),
  body('status').optional().isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`)
];
