export interface UserAttributes {
  id: number;
  username: string;
  name: string;
  hashedPassword: string;
}
export type UserCreate = Omit<UserAttributes, 'id'>;
export type UserCreatePassword = Pick<UserAttributes, 'username' | 'name'> & {
  password: string;
};
export type UserUpdate = Partial<Pick<UserCreate, 'name' | 'hashedPassword'>>;
export type UserUpdatePassword = Partial<Pick<UserCreatePassword, 'name' | 'password'>>;

export type UserNonSensitive = Omit<UserAttributes, 'hashedPassword'>;

export type UserForToken = Pick<UserAttributes, 'username' | 'name'>;
export interface UserWithToken extends UserForToken {
  token: string;
}

export type UserLogin = Pick<UserCreatePassword, 'username' | 'password'>;
