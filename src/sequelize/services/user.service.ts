import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import { StatusCodes } from '../../types/errors.type';
import User, { UserOrNothing } from '../models/user.model';
import {
  UserAttributes,
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
import Blog from '../models/blog.model';
import { getError } from '../../utils/middleware/errorHandler';

const defaultQueryOptions = {
  attributes: {
    exclude: ['hashedPassword'],
  },
  include: {
    model: Blog,
    as: 'blogs',
    attributes: {
      exclude: ['ownerId'],
    },
  },
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAll = async (): Promise<UserAttributes[]> => {
  const users = await User.findAll({ ...defaultQueryOptions, order: [['id', 'ASC']] });
  return users.map((user) => user.toJSON());
};

const getById = async (id: string): Promise<UserOrNothing> => {
  return await User.findByPk(id, defaultQueryOptions);
};

const getByUsername = async (username: string): Promise<UserOrNothing> => {
  return await User.findOne({ ...defaultQueryOptions, where: { username } });
};

const getUpdateAsUser = async (updateFields: UserUpdateAsUserInput): Promise<UserUpdateAsUser> => {
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

const updateOneAsUser = async (user: User, updateFields: UserUpdateAsUserInput): Promise<UserOrNothing> => {
  const update: UserUpdateAsUser = await getUpdateAsUser(updateFields);
  await user.update(update);
  return user;
};

const updateOneAsAdmin = async (user: User, updateFields: UserUpdateAsAdminInput): Promise<UserOrNothing> => {
  const { admin, disabled } = updateFields;
  const updateAsUser: UserUpdateAsUser = await getUpdateAsUser(updateFields);
  const update: UserUpdateAsAdmin = { ...updateAsUser };

  if (admin) {
    update.admin = admin;
  }

  if (disabled) {
    update.disabled = disabled;
  }

  await user.update(update);
  return user;
};

const addOne = async (newUserFields: UserCreateInput): Promise<UserAttributes> => {
  const { username, name, password, admin, disabled } = newUserFields;
  const exists = await User.findOne({ where: { username } });

  if (exists) {
    throw getError({ message: 'User already exists!', status: StatusCodes.BAD_REQUEST });
  }

  const hashedPassword = await hashPassword(password);
  const newUser: UserCreate = { username, name, hashedPassword, admin, disabled };
  const userModel = await User.create(newUser);
  const user = userModel.toJSON();
  return user;
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
