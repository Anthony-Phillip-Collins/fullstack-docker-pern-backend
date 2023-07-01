import { Blog } from './blog.type';

export interface User {
  id: number;
  username: string;
  name: string;
  hashedPassword: string;
  blogs?: Blog[];
}

export type UserForToken = Pick<User, 'username' | 'name'>;

export interface UserWithToken extends UserForToken {
  token: string;
}

export type NewUser = Omit<User, 'id' | 'blogs'>;

export type NewUserFields = Omit<NewUser, 'hashedPassword'> & {
  password: string;
};

export type UpdateUser = Partial<Pick<NewUser, 'name' | 'hashedPassword'>>;

export type UpdateUserFields = Partial<Omit<NewUserFields, 'username'>>;

export type LoginFields = Pick<NewUserFields, 'username' | 'password'>;
