import { body, param } from 'express-validator';

export const projectIdParam = [param('projectId').isMongoId().withMessage('Valid project id is required')];

export const createProjectRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Project name must be 2-120 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
];

export const addMemberRules = [
  ...projectIdParam,
  body('email').isEmail().withMessage('A valid member email is required').normalizeEmail()
];
