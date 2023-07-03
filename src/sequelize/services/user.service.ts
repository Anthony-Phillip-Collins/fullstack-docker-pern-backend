import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import { StatusCodes } from '../../types/errors.type';
import User, {
  UserAttributes,
  UserCreationAttributes,
  UserCreationAttributesInput,
  UserForToken,
  UserLogin,
  UserOrNothing,
  UserUpdateAttributes,
  UserUpdateAttributesInput,
  UserWithToken,
} from '../models/user.model';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAll = async (): Promise<UserAttributes[]> => {
  const users = await User.findAll({
    include: 'blogs',
  });
  return users.map((user) => user.toJSON());
};

const getById = async (id: string): Promise<UserOrNothing> => {
  return await User.findByPk(id);
};

const updateOne = async (user: User, updateFields: UserUpdateAttributesInput): Promise<UserOrNothing> => {
  const { password, name } = updateFields;
  const update: UserUpdateAttributes = {};

  if (password) {
    update.hashedPassword = await hashPassword(password);
  }

  if (name) {
    update.name = name;
  }

  await user.update(update);
  return user && user.toJSON();
};

const addOne = async (newUserFields: UserCreationAttributesInput): Promise<UserAttributes> => {
  const { username, name, password } = newUserFields;
  const exists = await User.findOne({ where: { username } });

  if (exists) throw new Error('User already exists!');

  const hashedPassword = await hashPassword(password);
  const newUser: UserCreationAttributes = { username, name, hashedPassword };
  const userModel = await User.create(newUser);
  const user = userModel.toJSON();
  return user;
};

const login = async (loginFields: UserLogin): Promise<UserWithToken> => {
  const { username, password } = loginFields;
  const user = await User.findOne({ where: { username } });

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
  updateOne,
  login,
};

export default userService;
