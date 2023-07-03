import User, {
  UserCreationAttributesInput,
  UserLogin,
  UserUpdateAttributesInput,
} from '../../../sequelize/models/user.model';
import { StatusCodes } from '../../errors.type';
import { parsePassword } from './common/password.parser';
import { parseString } from './common/string.parser';

export const parseUser = (object: unknown): User => {
  if (!(object instanceof User)) {
    const error = new Error('User not found!');
    error.status = StatusCodes.NOT_FOUND;
    throw error;
  }
  return object;
};

/* Create User */

export const isUserCreationAttributesInput = (object: unknown): object is UserCreationAttributesInput => {
  if (!object || typeof object !== 'object') {
    throw new Error('UserField data is missing.');
  }
  const mandatory = ['username', 'name', 'password'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseUserCreationAttributesInput = (object: unknown): UserCreationAttributesInput => {
  if (!isUserCreationAttributesInput(object)) {
    throw new Error('Some UserFields are missing. Needs username, name and password.');
  }

  const newUser: UserCreationAttributesInput = {
    username: parseString(object.username, 'username'),
    name: parseString(object.name, 'name'),
    password: parsePassword(object.password),
  };

  return newUser;
};

/* Update User */

export const isUserUpdateAttributesInput = (object: unknown): object is UserUpdateAttributesInput => {
  if (!object || typeof object !== 'object') {
    throw new Error('User data is missing.');
  }
  const optional = ['name', 'password'];
  return optional.filter((p) => p in object).length > 0;
};

export const parseUserUpdateAttributesInput = (object: unknown): UserUpdateAttributesInput => {
  if (!isUserUpdateAttributesInput(object)) {
    throw new Error('Only name and password can be updated.');
  }

  const updateUser: UserUpdateAttributesInput = {};

  if ('name' in object) updateUser.name = parseString(object.name, 'name');
  if ('password' in object) updateUser.password = parsePassword(object.password);

  return updateUser;
};

/* Login */

export const isUserLogin = (object: unknown): object is UserLogin => {
  if (!object || typeof object !== 'object') {
    throw new Error('Login data is missing.');
  }
  const mandatory = ['username', 'password'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseUserLogin = (object: unknown): UserLogin => {
  if (!isUserLogin(object)) {
    throw new Error('Provide username and password to log in.');
  }

  const loginFields: UserLogin = {
    username: parseString(object.username, 'username'),
    password: parsePassword(object.password),
  };

  return loginFields;
};
