import supertest from 'supertest';
import app from '../src/app';
import connectToDatabase from '../src/util/connectToDatabase';
import { UserAttributes } from '../src/types/user.type';

const request = supertest(app);

describe('User routes', () => {
  it('should have an admin', async () => {
    await connectToDatabase();
    const response = await request.get('/api/users').expect(200);
    const users: UserAttributes[] = response.body;

    expect(users.length).toBeGreaterThanOrEqual(1);

    const admin = users.find((user) => user.username === 'admin@foobar.com');

    expect(admin).toBeDefined();
  });
});
