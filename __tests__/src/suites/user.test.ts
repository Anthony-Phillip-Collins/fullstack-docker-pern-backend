import { UserAttributes, UserCreateInput, UserUpdateAsUserInput, UserWithToken } from '../../../src/types/user.type';
import testHelper from '../util/testHelper';
import { api } from '../../index.spec';
import userMock from '../mock/user.mock';

let testUser: UserAttributes;

const userTest = () => {
  describe('Create', () => {
    it('should create a user', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data = userMock.user;

      const response = await api.post('/api/users').send(data).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(201);

      const user: UserAttributes = response.body;
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toBe(data.username);
      expect(user.name).toBe(data.name);

      testUser = user;
    });

    it('should fail with status 400 if trying to create a user that exists', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserCreateInput = { ...userMock.user, username: 'test@foobar.com' };

      const response = await api.post('/api/users').send(data).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });

    it('should fail with status 400 if trying to create a user with invalid data', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserCreateInput = { ...userMock.user, username: 'invalid-email' };

      const response = await api.post('/api/users').send(data).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });
  });

  describe('Read', () => {
    it('should have an admin', async () => {
      const response = await api.get('/api/users').expect(200);
      const users: UserAttributes[] = response.body;
      expect(users.length).toBeGreaterThanOrEqual(1);

      const admin = users.find((user) => user.username === 'admin@foobar.com');
      expect(admin).toBeDefined();
    });

    it('should get a user', async () => {
      const response = await api.get(`/api/users/${testUser.id}`);
      expect(response.status).toBe(200);

      const user: UserAttributes = response.body;
      expect(user).toBeDefined();
      expect(user.id).toBe(testUser.id);
      expect(user.username).toBe(testUser.username);
      expect(user.name).toBe(testUser.name);
    });
  });

  describe('Update', () => {
    it('should update a user', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;

      const data: UserUpdateAsUserInput = {
        name: 'New Name',
      };

      const response = await api
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
  });

  describe('Delete', () => {
    it('should delete a user', async () => {
      const { accessToken } = (await testHelper.loginAsAdmin()).body as UserWithToken;
      const response = await api
        .delete(`/api/users/${testUser.username}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(204);
    });
  });
};

export default userTest;
