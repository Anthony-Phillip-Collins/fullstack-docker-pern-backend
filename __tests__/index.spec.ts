import supertest from 'supertest';
import app from '../src/app';
import connectToDatabase from '../src/util/connectToDatabase';
import authTest from './src/suites/auth.test';
import blogTest from './src/suites/blog.test';
import userTest from './src/suites/user.test';
import testHelper from './src/util/testHelper';

export const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
  await testHelper.cleanup();
});

describe('Auth', authTest);
describe('User', userTest);
describe('Blog', blogTest);
