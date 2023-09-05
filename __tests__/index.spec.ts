import supertest from 'supertest';
import app from '../src/app';
import connectToDatabase from '../src/util/connectToDatabase';
import authTest from './suites/auth.test';
import blogTest from './suites/blog.test';
import userTest from './suites/user.test';
import testHelper from './util/testHelper';

export const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
  await testHelper.cleanup();
});

describe('Auth', authTest);
describe('User', userTest);
describe('Blog', blogTest);
