import { Response } from 'supertest';
import User from '../../../src/sequelize/models/user.model';
import { UserLogin, UserWithToken } from '../../../src/types/user.type';
import { api } from '../../index.spec';
import Blog from '../../../src/sequelize/models/blog.model';

const cleanup = async () => {
  await User.destroy({
    where: {
      username: 'test@foobar.com',
    },
  });

  await Blog.destroy({
    where: {
      title: 'Test Blog',
    },
  });
};

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
