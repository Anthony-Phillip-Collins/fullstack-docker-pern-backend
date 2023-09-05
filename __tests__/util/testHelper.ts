import { Response } from 'supertest';
import User from '../../src/sequelize/models/user.model';
import { UserLogin, UserWithToken } from '../../src/types/user.type';
import { api } from '../index.spec';

const cleanup = async () =>
  await User.destroy({
    where: {
      username: 'test@foobar.com',
    },
  });

const login = async (data: UserLogin): Promise<Response> => {
  const response = await api.post('/api/auth/login').send(data);
  expect(response.status).toBe(200);

  const user = response.body as UserWithToken;
  expect(user).toBeDefined();
  expect(user.accessToken).toBeDefined();
  return response;
};

const loginAsAdmin = async () =>
  login({
    username: 'admin@foobar.com',
    password: 'letmein',
  });

const testHelper = {
  cleanup,
  login,
  loginAsAdmin,
};

export default testHelper;
