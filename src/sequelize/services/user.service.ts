import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import { StatusCodes } from '../../types/errors.type';
import {
  LoginFields,
  NewUserTypeFields,
  UpdateUserType,
  UpdateUserTypeFields,
  UserTypeForToken,
  UserTypeWithToken,
} from '../../types/user.type';
import UserModel, { UserAttributes, UserCreationAttributes } from '../models/user.model';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAll = async (): Promise<UserAttributes[]> => {
  const userModels = await UserModel.findAll({ include: 'blogs' });
  const users = userModels.map((user) => user.toJSON());
  return users;
};

const getById = async (id: string): Promise<UserAttributes | undefined | null> => {
  const userModel = await UserModel.findByPk(id);
  return userModel ? userModel.toJSON() : null;
};

const deleteOne = async (id: string): Promise<UserAttributes | undefined | null> => {
  const userModel = await UserModel.findByPk(id);
  const user = userModel ? userModel.toJSON() : null;
  await userModel?.destroy();
  return user;
};

const updateOne = async (
  id: string,
  updateFields: UpdateUserTypeFields
): Promise<UserAttributes | undefined | null> => {
  const { password, name } = updateFields;
  const update: UpdateUserType = {};

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

const addOne = async (newUserFields: NewUserTypeFields): Promise<UserAttributes> => {
  const { username, name, password } = newUserFields;
  const exists = await UserModel.findOne({ where: { username } });

  if (exists) throw new Error('User already exists!');

  const hashedPassword = await hashPassword(password);
  const newUser: UserCreationAttributes = { username, name, hashedPassword };
  const userModel = await UserModel.create(newUser);
  const user = userModel.toJSON();
  return user;
};

const login = async (loginFields: LoginFields): Promise<UserTypeWithToken> => {
  const { username, password } = loginFields;
  const user = await UserModel.findOne({ where: { username } });

  const passwordCorrect = !user ? false : await bcrypt.compare(password, user.hashedPassword);

  if (!passwordCorrect || !user) {
    const error = new Error('invalid username or password');
    error.status = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const userForToken: UserTypeForToken = {
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
