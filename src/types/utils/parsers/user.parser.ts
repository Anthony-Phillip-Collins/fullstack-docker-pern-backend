import User from '../../../sequelize/models/user.model';
import { StatusCodes } from '../../errors.type';
import { LoginFields, NewUserTypeFields, UpdateUserTypeFields } from '../../user.type';
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

/* NewUserTypeFields */

export const isNewUserTypeFields = (object: unknown): object is NewUserTypeFields => {
  if (!object || typeof object !== 'object') {
    throw new Error('UserField data is missing.');
  }
  const mandatory = ['username', 'name', 'password'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseNewUserTypeFields = (object: unknown): NewUserTypeFields => {
  if (!isNewUserTypeFields(object)) {
    throw new Error('Some UserFields are missing. Needs username, name and password.');
  }

  const newUser: NewUserTypeFields = {
    username: parseString(object.username, 'username'),
    name: parseString(object.name, 'name'),
    password: parsePassword(object.password),
  };

  return newUser;
};

/* UdateUserFields */

export const isUpdateUserTypeFields = (object: unknown): object is UpdateUserTypeFields => {
  if (!object || typeof object !== 'object') {
    throw new Error('User data is missing.');
  }
  const optional = ['name', 'password'];
  return optional.filter((p) => p in object).length > 0;
};

export const parseUpdateUserTypeFields = (object: unknown): UpdateUserTypeFields => {
  if (!isUpdateUserTypeFields(object)) {
    throw new Error('Only name and password can be updated.');
  }

  const updateUser: UpdateUserTypeFields = {};

  if ('name' in object) updateUser.name = parseString(object.name, 'name');
  if ('password' in object) updateUser.password = parsePassword(object.password);

  return updateUser;
};

/* LoginFields */

export const isLoginFields = (object: unknown): object is LoginFields => {
  if (!object || typeof object !== 'object') {
    throw new Error('Login data is missing.');
  }
  const mandatory = ['username', 'password'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseLoginFields = (object: unknown): LoginFields => {
  if (!isLoginFields(object)) {
    throw new Error('Provide username and password to log in.');
  }

  const loginFields: LoginFields = {
    username: parseString(object.username, 'username'),
    password: parsePassword(object.password),
  };

  return loginFields;
};
