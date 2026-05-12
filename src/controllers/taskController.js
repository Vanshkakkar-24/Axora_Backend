import {
  createTaskForProject,
  deleteTaskForUser,
  getTasksForProject,
  updateTaskForUser
} from '../services/taskService.js';

export const listTasks = async (req, res, next) => {
  try {
    const data = await getTasksForProject(
      req.params.projectId,
      req.user._id,
      req.query
    );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskForProject(
      req.params.projectId,
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskForUser(
      req.params.taskId,
      req.user._id,
      req.body
    );

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const data = await deleteTaskForUser(
      req.params.taskId,
      req.user._id
    );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};