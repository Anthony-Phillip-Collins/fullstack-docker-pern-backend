import bcrypt from 'bcrypt';
import { StatusCodes } from '../../types/errors.type';
import {
  UserCreate,
  UserCreateInput,
  UserQuery,
  UserUpdateAsAdmin,
  UserUpdateAsAdminInput,
  UserUpdateAsUser,
  UserUpdateAsUserInput,
} from '../../types/user.type';
import getError from '../../types/utils/getError';
import Blog from '../models/blog.model';
import User, { UserOrNothing } from '../models/user.model';

const defaultQueryOptions = {
  attributes: {
    exclude: ['hashedPassword'],
  },
};

const includes = {
  blogs: {
    model: Blog,
    as: 'blogs',
    attributes: {
      exclude: ['ownerId', 'createdAt', 'updatedAt'],
    },
  },
  readings: {
    model: Blog,
    as: 'readings',
    attributes: {
      exclude: ['ownerId', 'createdAt', 'updatedAt'],
    },
    through: { attributes: ['read', 'id'] },
  },
  likings: {
    model: Blog,
    as: 'likings',
    attributes: {
      exclude: ['ownerId', 'createdAt', 'updatedAt'],
    },
    through: { attributes: ['id'] },
  },
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

const getById = async (id: string, query: UserQuery): Promise<UserOrNothing> => {
  let whereReadings = {};
  if (query?.read) {
    whereReadings = { where: { read: query.read === 'true' } };
  }

  return await User.findByPk(id, {
    ...defaultQueryOptions,
    include: [
      includes.blogs,
      includes.likings,
      { ...includes.readings, through: { attributes: ['read', 'id'], ...whereReadings } },
    ],
  });
};

const getByUsername = async (username: string): Promise<UserOrNothing> => {
  return await User.findOne({
    ...defaultQueryOptions,
    include: [includes.blogs, includes.likings, includes.readings],
    where: { username },
  });
};

const updateOneAsUser = async (user: User, updateFields: UserUpdateAsUserInput): Promise<User> => {
  const update: UserUpdateAsUser = await getUpdateAsUserFields(updateFields);
  await user.update(update);

  const updated = await User.findByPk(user.id, {
    ...defaultQueryOptions,
  });

  if (!updated) {
    throw getError({ message: 'User not found!', status: StatusCodes.NOT_FOUND });
  }

  return updated;
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
const userService = {
  getAll,
  getById,
  getByUsername,
  addOne,
  updateOneAsUser,
  updateOneAsAdmin,
};

export default userService;
