import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import { StatusCodes } from '../../types/errors.type';
import {
  LoginFields,
  NewUser,
  NewUserFields,
  UpdateUser,
  UpdateUserFields,
  User,
  UserForToken,
  UserWithToken,
} from '../../types/user.type';
import UserModel from '../models/user.model';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAll = async (): Promise<User[]> => {
  const userModels = await UserModel.findAll({ include: 'blogs' });
  const users = userModels.map((user) => user.toJSON());
  return users;
};

const getById = async (id: string): Promise<User | undefined | null> => {
  const userModel = await UserModel.findByPk(id);
  return userModel ? userModel.toJSON() : null;
};

const deleteOne = async (id: string): Promise<User | undefined | null> => {
  const userModel = await UserModel.findByPk(id);
  const user = userModel ? userModel.toJSON() : null;
  await userModel?.destroy();
  return user;
};

const updateOne = async (id: string, updateFields: UpdateUserFields): Promise<User | undefined | null> => {
  const { password, name } = updateFields;
  const update: UpdateUser = {};

  if (password) {
    update.hashedPassword = await hashPassword(password);
  }

  if (name) {
    update.name = name;
  }

  await UserModel.update(update, { where: { id } });
  const userModel = await UserModel.findByPk(id);
  const user = userModel ? userModel.toJSON() : null;
  return user;
};

const addOne = async (newUserFields: NewUserFields): Promise<User> => {
  const { username, name, password } = newUserFields;
  const exists = await UserModel.findOne({ where: { username } });

  if (exists) throw new Error('User already exists!');

  const hashedPassword = await hashPassword(password);
  const newUser: NewUser = { username, name, hashedPassword };
  const userModel = await UserModel.create(newUser);
  const user = userModel.toJSON();
  return user;
};

const login = async (loginFields: LoginFields): Promise<UserWithToken> => {
  const { username, password } = loginFields;
  const user = await UserModel.findOne({ where: { username } });

  const passwordCorrect = !user ? false : await bcrypt.compare(password, user.hashedPassword);

  if (!passwordCorrect || !user) {
    const error = new Error('invalid username or password');
    error.status = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const userForToken: UserForToken = {
    username: username,
    name: user.name,
  };

  const token = jwt.sign(userForToken, constants.JWT_SECRET);

  return { token, ...userForToken };
};

const userService = {
  getAll,
  getById,
  addOne,
  deleteOne,
  updateOne,
  login,
};

export default userService;
