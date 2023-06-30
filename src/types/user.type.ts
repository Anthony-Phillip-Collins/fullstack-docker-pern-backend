export interface User {
  id: string;
  username: string;
  name: string;
  hashedPassword: string;
}

export type UserForToken = Pick<User, 'username' | 'name'>;

export interface UserWithToken extends UserForToken {
  token: string;
}

export type NewUser = Omit<User, 'id'>;

export type NewUserFields = Omit<NewUser, 'hashedPassword'> & {
  password: string;
};

export type UpdateUser = Partial<Pick<NewUser, 'name' | 'hashedPassword'>>;

export type UpdateUserFields = Partial<Omit<NewUserFields, 'username'>>;

export type LoginFields = Pick<NewUserFields, 'username' | 'password'>;
