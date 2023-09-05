import { UserWithToken } from '../../src/types/user.type';
import connectToDatabase from '../../src/util/connectToDatabase';
import testHelper from '../../src/util/testHelper';

const authTest = () => {
  beforeAll(async () => {
    await connectToDatabase();
    await testHelper.cleanup();
  });

  describe('Auth routes', () => {
    it('should log in as admin', async () => {
      const response = await testHelper.loginAsAdmin();
      expect(response.status).toBe(200);

      const user: UserWithToken = response.body;
      expect(user).toBeDefined();
      expect(user.accessToken).toBeDefined();
    });
  });
};

export default authTest;
