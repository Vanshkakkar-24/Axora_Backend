import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const signupUser = async ( req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw {
        statusCode: 400,
        message:
          'All fields are required'
      };
    }

    const userExists =
      await User.findOne({
        email: email
          .toLowerCase()
          .trim()
      });

    if (userExists) {
      throw {
        statusCode: 409,
        message:
          'User already exists'
      };
    }

    const hashedPassword = await bcrypt.hash( password, 10 );

    const user =
      await User.create({
        name,
        email: email
          .toLowerCase()
          .trim(),
        password:
          hashedPassword
      });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(
        user._id
      )
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async ( req, res,next ) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw {
        statusCode: 400,
        message:
          'Email and password are required'
      };
    }

    const user =
      await User.findOne({
        email: email
          .toLowerCase()
          .trim()
      });

    if (
      !user ||
      !(
        await bcrypt.compare(
          password,
          user.password
        )
      )
    ) {
      throw {
        statusCode: 401,
        message:
          'Invalid email or password'
      };
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(
        user._id
      )
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser =
  async ( req, res, next ) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select('-password');

      if (!user) {
        throw {
          statusCode: 404,
          message:
            'User not found'
        };
      }

      res.json({
        user
      });
    } catch (error) {
      next(error);
    }
  };