import { UserWithToken } from '../../src/types/user.type';
import testHelper from '../util/testHelper';

const authTest = () => {
  describe('Verify', () => {
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
