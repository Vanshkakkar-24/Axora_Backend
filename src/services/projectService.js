import Project from '../models/Project.js';
import User from '../models/User.js';
import {
  createPaginationMeta,
  getPagination
} from '../utils/pagination.js';

const userSelect =
  'name email createdAt';

export const getUserId = (
  value
) => String(value?._id || value);

export const isProjectMember = (
  project,
  userId
) =>
  project.members.some(
    (member) =>
      getUserId(member.user) ===
      String(userId)
  );

export const isProjectOwner = (
  project,
  userId
) =>
  getUserId(project.owner) ===
  String(userId);

export const findProjectForUser =
  async (projectId, userId) => {
    const project =
      await Project.findOne({
        _id: projectId,
        'members.user': userId
      })
        .populate(
          'owner',
          userSelect
        )
        .populate(
          'members.user',
          userSelect
        );

    if (!project) {
      throw {
        statusCode: 404,
        message:
          'Project not found'
      };
    }

    return project;
  };

export const getProjectsForUser =
  async (userId, query) => {
    const { page, limit, skip } =
      getPagination(query);

    const filters = {
      'members.user': userId
    };

    if (query.search) {
      const pattern = new RegExp(
        query.search.trim(),
        'i'
      );

      filters.$or = [
        { name: pattern },
        { description: pattern }
      ];
    }

    const [items, total] =
      await Promise.all([
        Project.find(filters)
          .sort({
            updatedAt: -1
          })
          .skip(skip)
          .limit(limit)
          .populate(
            'owner',
            userSelect
          )
          .populate(
            'members.user',
            userSelect
          ),

        Project.countDocuments(
          filters
        )
      ]);

    return {
      items,
      pagination:
        createPaginationMeta(
          total,
          page,
          limit
        )
    };
  };

export const createProjectForUser =
  async (userId, payload) => {
    const project =
      await Project.create({
        name: payload.name,
        description:
          payload.description || '',
        owner: userId,
        members: [
          {
            user: userId,
            role: 'owner'
          }
        ]
      });

    return findProjectForUser(
      project._id,
      userId
    );
  };

export const addProjectMemberByEmail =
  async (
    projectId,
    currentUserId,
    email
  ) => {
    const project =
      await findProjectForUser(
        projectId,
        currentUserId
      );

    if (
      !isProjectOwner(
        project,
        currentUserId
      )
    ) {
      throw {
        statusCode: 403,
        message:
          'Only project owner can add members'
      };
    }

    const user =
      await User.findOne({
        email: email
          .toLowerCase()
          .trim()
      });

    if (!user) {
      throw {
        statusCode: 404,
        message:
          'No account found with this email'
      };
    }

    if (
      isProjectMember(
        project,
        user._id
      )
    ) {
      throw {
        statusCode: 409,
        message:
          'User is already a member'
      };
    }

    project.members.push({
      user: user._id,
      role: 'member'
    });

    await project.save();

    return findProjectForUser(
      projectId,
      currentUserId
    );
  };