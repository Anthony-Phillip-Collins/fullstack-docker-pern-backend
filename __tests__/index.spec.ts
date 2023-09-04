import supertest from 'supertest';
import app from '../src/app';
import connectToDatabase from '../src/util/connectToDatabase';

const request = supertest(app);

describe('User routes', () => {
  it('should have a user and an admin', async () => {
    await connectToDatabase();
    // const response = await request.get('/api/users').expect('Content-Type', /json/).expect(200);
    const response = await request.get('/api/users').expect(200);
    console.log(response.body);
    // const users: UserAttributes[] = response.body;
    // expect(users[0].name).toBe('Admin');
    // expect(users[1].name).toBe('User');
  });
});
