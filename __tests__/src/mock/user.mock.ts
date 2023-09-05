import { UserCreateInput } from '../../../src/types/user.type';

const user: UserCreateInput = {
  username: 'test@foobar.com',
  name: 'Test User',
  password: 'letmein',
};

const userMock = {
  user,
};

export default userMock;
