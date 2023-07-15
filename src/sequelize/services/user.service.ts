import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import { StatusCodes } from '../../types/errors.type';
import {
  UserCreate,
  UserCreateInput,
  UserForToken,
  UserLogin,
  UserUpdateAsAdmin,
  UserUpdateAsAdminInput,
  UserUpdateAsUser,
  UserUpdateAsUserInput,
  UserWithToken,
} from '../../types/user.type';
import { getError } from '../../util/middleware/errorHandler';
import Blog from '../models/blog.model';
import User, { UserOrNothing } from '../models/user.model';

const defaultQueryOptions = {
  attributes: {
    exclude: ['hashedPassword'],
  },
};

const singleQueryOptions = {
  ...defaultQueryOptions,
  include: [
    {
      model: Blog,
      as: 'blogs',
      attributes: {
        exclude: ['ownerId', 'createdAt', 'updatedAt'],
      },
    },
    {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['url', 'likes', 'year', 'ownerId', 'createdAt', 'updatedAt'],
      },
      through: { attributes: ['read'] },
    },
  ],
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getUpdateAsUserFields = async (updateFields: UserUpdateAsUserInput): Promise<UserUpdateAsUser> => {
  const { password, name } = updateFields;
  const update: UserUpdateAsUser = {};

  if (password) {
    update.hashedPassword = await hashPassword(password);
  }

  if (name) {
    update.name = name;
  }

  return update;
};

const getAll = async (): Promise<User[]> => {
  return await User.findAll({ ...defaultQueryOptions });
};

const getById = async (id: string): Promise<UserOrNothing> => {
  return await User.findByPk(id, singleQueryOptions);
};

const getByUsername = async (username: string): Promise<UserOrNothing> => {
  return await User.findOne({ ...singleQueryOptions, where: { username } });
};

const updateOneAsUser = async (user: User, updateFields: UserUpdateAsUserInput): Promise<UserOrNothing> => {
  const update: UserUpdateAsUser = await getUpdateAsUserFields(updateFields);
  return await user.update(update);
};

const updateOneAsAdmin = async (user: User, updateFields: UserUpdateAsAdminInput): Promise<UserOrNothing> => {
  const { admin, disabled } = updateFields;
  const updateAsUser: UserUpdateAsUser = await getUpdateAsUserFields(updateFields);
  const update: UserUpdateAsAdmin = { ...updateAsUser };

  if (admin) {
    update.admin = admin;
  }

  if (disabled) {
    update.disabled = disabled;
  }

  return await user.update(update);
};

const addOne = async (newUserFields: UserCreateInput): Promise<User> => {
  const { username, name, password, admin, disabled } = newUserFields;
  const exists = await User.findOne({ where: { username } });

  if (exists) {
    throw getError({ message: 'User already exists!', status: StatusCodes.BAD_REQUEST });
  }

  const hashedPassword = await hashPassword(password);
  const newUser: UserCreate = { username, name, hashedPassword, admin, disabled };
  return await User.create(newUser);
};

const login = async (login: UserLogin): Promise<UserWithToken | null> => {
  const { username, password } = login;
  const user = await User.findOne({ where: { username } });

  const passwordCorrect = !user ? false : await bcrypt.compare(password, user.hashedPassword);

  if (!passwordCorrect || !user) {
    throw getError({ message: 'invalid username or password', status: StatusCodes.UNAUTHORIZED });
  }

  const UserForToken: UserForToken = {
    username: username,
    name: user.name,
  };

  const token = jwt.sign(UserForToken, constants.JWT_SECRET);

  return { token, ...UserForToken };
};

const userService = {
  getAll,
  getById,
  getByUsername,
  addOne,
  updateOneAsUser,
  updateOneAsAdmin,
  login,
};

export default userService;
