import supertest from 'supertest';
import app from '../../src/app';
import { UserAttributes, UserCreateInput, UserUpdateAsUserInput, UserWithToken } from '../../src/types/user.type';
import connectToDatabase from '../../src/util/connectToDatabase';
import testHelper from '../../src/util/testHelper';

const request = supertest(app);
let testUser: UserAttributes;

const userTest = () => {
  beforeAll(async () => {
    await connectToDatabase();
    await testHelper.cleanup();
  });

  describe('User routes', () => {
    it('should have an admin', async () => {
      const response = await request.get('/api/users').expect(200);
      const users: UserAttributes[] = response.body;
      expect(users.length).toBeGreaterThanOrEqual(1);

      const admin = users.find((user) => user.username === 'admin@foobar.com');
      expect(admin).toBeDefined();
    });

    it('should create a user', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserCreateInput = {
        username: 'test@foobar.com',
        name: 'Test User',
        password: 'letmein',
      };

      const response = await request.post('/api/users').send(data).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(201);

      const user: UserAttributes = response.body;
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toBe(data.username);
      expect(user.name).toBe(data.name);

      testUser = user;
    });

    it('should get a user', async () => {
      const response = await request.get(`/api/users/${testUser.id}`);
      expect(response.status).toBe(200);

      const user: UserAttributes = response.body;
      expect(user).toBeDefined();
      expect(user.id).toBe(testUser.id);
      expect(user.username).toBe(testUser.username);
      expect(user.name).toBe(testUser.name);
    });

    it('should update a user', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserUpdateAsUserInput = {
        name: 'New Name',
      };

      const response = await request
        .put(`/api/users/${testUser.username}`)
        .send(data)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);

      const user: UserAttributes = response.body;
      expect(user).toBeDefined();
      expect(user.id).toBe(testUser.id);
      expect(user.username).toBe(testUser.username);
      expect(user.name).toBe(data.name);
    });

    it('should fail with status 400 if trying to create a user that exists', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserCreateInput = {
        username: 'test@foobar.com',
        name: 'Test User',
        password: 'letmein',
      };

      const response = await request.post('/api/users').send(data).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });

    it('should fail with status 400 if trying to create a user with invalid data', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserCreateInput = {
        username: 'invalid-email',
        name: 'Test User',
        password: 'letmein',
      };

      const response = await request.post('/api/users').send(data).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });

    it('should delete a user', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;
      const response = await request
        .delete(`/api/users/${testUser.username}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(204);
    });
  });
};

export default userTest;
