import { BlogType } from './blog.type';

export interface UserType {
  id: number;
  username: string;
  name: string;
  hashedPassword: string;
  blogs?: BlogType[];
}

export type UserTypeForToken = Pick<UserType, 'username' | 'name'>;

export interface UserTypeWithToken extends UserTypeForToken {
  token: string;
}

export type NewUserType = Omit<UserType, 'id' | 'blogs'>;

export type NewUserTypeFields = Omit<NewUserType, 'hashedPassword'> & {
  password: string;
};

export type UpdateUserType = Partial<Pick<NewUserType, 'name' | 'hashedPassword'>>;

export type UpdateUserTypeFields = Partial<Omit<NewUserTypeFields, 'username'>>;

export type LoginFields = Pick<NewUserTypeFields, 'username' | 'password'>;
