import { LoginFields, NewUserFields, UpdateUserFields } from '../../user.type';
import { parsePassword } from './common/password.parser';
import { parseString } from './common/string.parser';

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
