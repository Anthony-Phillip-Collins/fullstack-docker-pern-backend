export interface User {
  id: string;
  username: string;
  name: string;
  hashedPassword: string;
}

export type NewUser = Omit<User, 'id'>;

export interface NewUserFields extends Omit<NewUser, 'hashedPassword'> {
  password: string;
}

export type UpdateUser = Partial<Pick<NewUser, 'name' | 'hashedPassword'>>;

export type UpdateUserFields = Partial<Omit<NewUserFields, 'username'>>;
