import User from '../../../sequelize/models/user.model';
import { UserCreatePassword, UserLogin, UserUpdatePassword } from '../../../types/user.type';
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

export const isUserCreatePassword = (object: unknown): object is UserCreatePassword => {
  if (!object || typeof object !== 'object') {
    throw new Error('UserField data is missing.');
  }
  const mandatory = ['username', 'name', 'password'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseUserCreatePassword = (object: unknown): UserCreatePassword => {
  if (!isUserCreatePassword(object)) {
    throw new Error('Some UserFields are missing. Needs username, name and password.');
  }

  const newUser: UserCreatePassword = {
    username: parseString(object.username, 'username'),
    name: parseString(object.name, 'name'),
    password: parsePassword(object.password),
  };

  return newUser;
};

/* Update User */

export const isUserUpdatePassword = (object: unknown): object is UserUpdatePassword => {
  if (!object || typeof object !== 'object') {
    throw new Error('User data is missing.');
  }
  const optional = ['name', 'password'];
  return optional.filter((p) => p in object).length > 0;
};

export const parseUserUpdatePassword = (object: unknown): UserUpdatePassword => {
  if (!isUserUpdatePassword(object)) {
    throw new Error('Only name and password can be updated.');
  }

  const updateUser: UserUpdatePassword = {};

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
