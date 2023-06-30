import bcrypt from 'bcrypt';
import { NewUserFields, UpdateUser, UpdateUserFields, User } from '../../types/user.type';
import UserModel from '../models/user.model';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAll = async (): Promise<User[]> => {
  const userModels = await UserModel.findAll();
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

export const addOne = async (newUser: NewUserFields): Promise<User> => {
  const { username, name, password } = newUser;
  const exists = await UserModel.findOne({ where: { username } });

  if (exists) throw new Error('User already exists!');

  const hashedPassword = await hashPassword(password);

  const userModel = await UserModel.create({ username, name, hashedPassword });
  const user = userModel.toJSON();
  return user;
};

const userService = {
  getAll,
  getById,
  addOne,
  deleteOne,
  updateOne,
};

export default userService;
