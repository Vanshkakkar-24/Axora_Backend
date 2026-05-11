import {
  addProjectMemberByEmail,
  createProjectForUser,
  findProjectForUser,
  getProjectsForUser
} from '../services/projectService.js';

export const listProjects = async (req, res, next) => {
  try {
    const data = await getProjectsForUser(req.user._id, req.query);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await createProjectForUser(req.user._id, req.body);

    res.status(201).json({
      success: true,
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await findProjectForUser(
      req.params.projectId,
      req.user._id
    );

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const project = await addProjectMemberByEmail(
      req.params.projectId,
      req.user._id,
      req.body.email
    );

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    next(error);
  }
};