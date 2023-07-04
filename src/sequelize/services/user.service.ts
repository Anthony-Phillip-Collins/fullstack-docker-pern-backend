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
  UserUpdate,
  UserUpdateInput,
  UserWithToken,
} from '../../types/user.type';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAll = async (): Promise<UserAttributes[]> => {
  const users = await User.findAll({
    include: {
      association: 'blogs',
      attributes: ['id', 'title', 'author', 'url', 'likes'],
    },
  });
  return users.map((user) => user.toJSON());
};

const getById = async (id: string): Promise<UserOrNothing> => {
  return await User.findByPk(id);
};

const updateOne = async (user: User, updateFields: UserUpdateInput): Promise<UserOrNothing> => {
  const { password, name } = updateFields;
  const update: UserUpdate = {};

  if (password) {
    update.hashedPassword = await hashPassword(password);
  }

  if (name) {
    update.name = name;
  }

  await user.update(update);
  return user && user.toJSON();
};

const addOne = async (newUserFields: UserCreateInput): Promise<UserAttributes> => {
  const { username, name, password } = newUserFields;
  const exists = await User.findOne({ where: { username } });

  if (exists) throw new Error('User already exists!');

  const hashedPassword = await hashPassword(password);
  const newUser: UserCreate = { username, name, hashedPassword };
  const userModel = await User.create(newUser);
  const user = userModel.toJSON();
  return user;
};

const login = async (login: UserLogin): Promise<UserWithToken> => {
  const { username, password } = login;
  const user = await User.findOne({ where: { username } });

  const passwordCorrect = !user ? false : await bcrypt.compare(password, user.hashedPassword);

  if (!passwordCorrect || !user) {
    const error = new Error('invalid username or password');
    error.status = StatusCodes.UNAUTHORIZED;
    throw error;
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
  addOne,
  updateOne,
  login,
};

export default userService;
