import { NewUser, NewUserFields, UpdateUser, UpdateUserFields } from '../../user.type';
import { parsePassword } from './common/password.parser';
import { parseString } from './common/string.parser';

/* NewUser */

export const isNewUser = (object: unknown): object is NewUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('User data is missing.');
  }
  const mandatory = ['username', 'name', 'hashedPassword'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseNewUser = (object: unknown): NewUser => {
  if (!isNewUser(object)) {
    throw new Error('Some User data fields are missing. Needs username, name and hashedPassword.');
  }

  const newUser: NewUser = {
    username: parseString(object.username, 'username'),
    name: parseString(object.name, 'name'),
    hashedPassword: parseString(object.hashedPassword, 'hashedPassword'),
  };

  return newUser;
};

/* NewUserFields */

export const isNewUserFields = (object: unknown): object is NewUserFields => {
  if (!object || typeof object !== 'object') {
    throw new Error('UserField data is missing.');
  }
  const mandatory = ['username', 'name', 'password'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseNewUserFields = (object: unknown): NewUserFields => {
  if (!isNewUserFields(object)) {
    throw new Error('Some UserFields are missing. Needs username, name and password.');
  }

  const newUser: NewUserFields = {
    username: parseString(object.username, 'username'),
    name: parseString(object.name, 'name'),
    password: parsePassword(object.password),
  };

  return newUser;
};

/* UpdateUser */

export const isUpdateUser = (object: unknown): object is UpdateUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('User data is missing.');
  }
  const optional = ['name', 'password'];
  return optional.filter((p) => p in object).length > 0;
};

export const parseUpdateUser = (object: unknown): UpdateUser => {
  if (!isUpdateUser(object)) {
    throw new Error('Some UserFields are missing. Only name and password can be updated.');
  }

  const updateUser: UpdateUser = {};

  if ('name' in object) updateUser.name = parseString(object.name, 'name');
  if ('password' in object) updateUser.hashedPassword = parseString(object.hashedPassword, 'hashedPassword');

  return updateUser;
};

/* UdateUserFields */

export const isUpdateUserFields = (object: unknown): object is UpdateUserFields => {
  if (!object || typeof object !== 'object') {
    throw new Error('User data is missing.');
  }
  const optional = ['name', 'password'];
  return optional.filter((p) => p in object).length > 0;
};

export const parseUpdateUserFields = (object: unknown): UpdateUserFields => {
  if (!isUpdateUserFields(object)) {
    throw new Error('Only name and password can be updated.');
  }

  const updateUser: UpdateUserFields = {};

  if ('name' in object) updateUser.name = parseString(object.name, 'name');
  if ('password' in object) updateUser.password = parsePassword(object.password);

  return updateUser;
};
