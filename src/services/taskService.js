import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/index.js';
import  Task  from '../models/Task.js';
import { createPaginationMeta, getPagination } from '../utils/pagination.js';

import {
  findProjectForUser,
  getUserId,
  isProjectMember
} from './projectService.js';

const userSelect = 'name email';

const assertValidAssignee = (project, assignedTo) => {
  if (!assignedTo) {
    return;
  }

  if (!isProjectMember(project, assignedTo)) {
    const error = new Error(
      'Assigned user must be a member of the project'
    );

    error.statusCode = 400;

    throw error;
  }
};

const populateTask = (query) =>
  query
    .populate('assignedTo', userSelect)
    .populate('createdBy', userSelect)
    .populate('updatedBy', userSelect);

export const getTasksForProject = async (
  projectId,
  userId,
  query
) => {
  await findProjectForUser(projectId, userId);

  const { page, limit, skip } = getPagination(query);

  const filters = {
    project: projectId
  };

  if (
    query.status &&
    TASK_STATUSES.includes(query.status)
  ) {
    filters.status = query.status;
  }

  if (
    query.priority &&
    TASK_PRIORITIES.includes(query.priority)
  ) {
    filters.priority = query.priority;
  }

  if (query.assignedTo) {
    filters.assignedTo = query.assignedTo;
  }

  if (query.search) {
    const pattern = new RegExp(
      query.search.trim(),
      'i'
    );

    filters.$or = [
      { title: pattern },
      { description: pattern }
    ];
  }

  const [items, total] = await Promise.all([
    populateTask(Task.find(filters))
      .sort({
        dueDate: 1,
        createdAt: -1
      })
      .skip(skip)
      .limit(limit),

    Task.countDocuments(filters)
  ]);

  return {
    items,
    pagination: createPaginationMeta(
      total,
      page,
      limit
    )
  };
};

export const createTaskForProject = async (
  projectId,
  userId,
  payload
) => {
  const project = await findProjectForUser(
    projectId,
    userId
  );

  assertValidAssignee(
    project,
    payload.assignedTo
  );

  const task = await Task.create({
    project: projectId,
    title: payload.title,
    description: payload.description || '',
    priority: payload.priority,
    dueDate: payload.dueDate,
    assignedTo: payload.assignedTo,
    status: payload.status || 'Todo',
    createdBy: userId,
    updatedBy: userId
  });

  return populateTask(
    Task.findById(task._id)
  );
};

export const findTaskForUser = async (
  taskId,
  userId
) => {
  const task = await populateTask(
    Task.findById(taskId)
  );

  if (!task) {
    const error = new Error('Task not found');

    error.statusCode = 404;

    throw error;
  }

  const project = await findProjectForUser(
    task.project,
    userId
  );

  return { task, project };
};

export const updateTaskForUser = async (
  taskId,
  userId,
  payload
) => {
  const { task, project } =
    await findTaskForUser(taskId, userId);

  if (payload.assignedTo) {
    assertValidAssignee(
      project,
      payload.assignedTo
    );
  }

  const allowedFields = [
    'title',
    'description',
    'priority',
    'dueDate',
    'assignedTo',
    'status'
  ];

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      task[field] = payload[field];
    }
  });

  task.updatedBy = userId;

  await task.save();

  return populateTask(
    Task.findById(task._id)
  );
};

export const deleteTaskForUser = async (
  taskId,
  userId
) => {
  const { task } = await findTaskForUser(
    taskId,
    userId
  );

  await task.deleteOne();

  return {
    id: getUserId(task._id)
  };
};