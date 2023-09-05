import { BlogAttributes } from '../../../src/types/blog.type';
import { UserWithToken } from '../../../src/types/user.type';
import { api } from '../../index.spec';
import blogMock from '../mock/blog.mock';
import testHelper from '../util/testHelper';

let testBlog: BlogAttributes;

const blogTest = () => {
  describe('Create', () => {
    it('should create a blog', async () => {
      const loginResponse = await testHelper.loginAsAdmin();
      const { accessToken }: UserWithToken = loginResponse.body;

      const data = blogMock.blog;

      const response = await api
        .post('/api/blogs')
        .send(data)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const blog: BlogAttributes = response.body;
      expect(blog).toHaveProperty('id');
      expect(blog).toHaveProperty('title', data.title);
      expect(blog).toHaveProperty('author', data.author);
      expect(blog).toHaveProperty('url', data.url);
      expect(blog).toHaveProperty('likes', data.likes);
      expect(blog).toHaveProperty('year', data.year);

      const response2 = await api.get(`/api/blogs/${blog.id}`).expect(200);
      expect(response2.body).toHaveProperty('title', data.title);
      expect(response2.body).toHaveProperty('author', data.author);
      expect(response2.body).toHaveProperty('url', data.url);
      expect(response2.body).toHaveProperty('likes', data.likes);
      expect(response2.body).toHaveProperty('year', data.year);

      testBlog = blog;
    });

    it('should fail with status 400 if trying to create a blog with invalid data', async () => {
      const loginResponse = await testHelper.loginAsAdmin();
      const { accessToken }: UserWithToken = loginResponse.body;

      const data = { ...blogMock.blog, url: 'invalid-url' };

      await api.post('/api/blogs').send(data).set('Authorization', `Bearer ${accessToken}`).expect(400);
    });

    it('should fail with status 401 if trying to create a blog without a token', async () => {
      await api.post('/api/blogs').send(blogMock.blog).expect(401);
    });

    it('should fail with status 400 if trying to create a blog that exists', async () => {
      const loginResponse = await testHelper.loginAsAdmin();
      const { accessToken }: UserWithToken = loginResponse.body;
      await api.post('/api/blogs').send(blogMock.blog).set('Authorization', `Bearer ${accessToken}`).expect(400);
    });
  });

  describe('Read', () => {
    it('should have blogs', async () => {
      const response = await api.get('/api/blogs').expect(200);
      const blogs: BlogAttributes[] = response.body;
      expect(blogs.length).toBeGreaterThanOrEqual(1);
    });

    it('should get a blog', async () => {
      const response = await api.get(`/api/blogs/${testBlog.id}`).expect(200);

      const blog: BlogAttributes = response.body;
      expect(blog).toHaveProperty('id');
      expect(blog).toHaveProperty('title', testBlog.title);
      expect(blog).toHaveProperty('author', testBlog.author);
      expect(blog).toHaveProperty('url', testBlog.url);
      expect(blog).toHaveProperty('likes', testBlog.likes);
      expect(blog).toHaveProperty('year', testBlog.year);
    });

    it('should fail with status 404 if trying to get a blog that does not exist', async () => {
      await api.get('/api/blogs/999').expect(404);
    });
  });

  describe('Update', () => {
    it('should update a blog', async () => {
      const loginResponse = await testHelper.loginAsAdmin();
      const { accessToken }: UserWithToken = loginResponse.body;

      const data = { ...blogMock.blog, url: 'http://updated.com' };

      const response = await api
        .put(`/api/blogs/${testBlog.id}`)
        .send(data)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const blog: BlogAttributes = response.body;
      expect(blog).toHaveProperty('url', data.url);

      const response2 = await api.get(`/api/blogs/${testBlog.id}`).expect(200);
      expect(response2.body).toHaveProperty('url', data.url);
    });

    it('should fail with status 400 if trying to update a blog with invalid data', async () => {
      const loginResponse = await testHelper.loginAsAdmin();
      const { accessToken }: UserWithToken = loginResponse.body;

      const data = { ...blogMock.blog, url: 'invalid-url' };

      await api.put(`/api/blogs/${testBlog.id}`).send(data).set('Authorization', `Bearer ${accessToken}`).expect(400);
    });

    it('should fail with status 401 if trying to update a blog without a token', async () => {
      await api.put(`/api/blogs/${testBlog.id}`).send(blogMock.blog).expect(401);
    });
  });

  describe('Delete', () => {
    it('should fail with status 401 if trying to delete a blog without a token', async () => {
      await api.delete(`/api/blogs/${testBlog.id}`).expect(401);
    });

    it('should delete a blog', async () => {
      const loginResponse = await testHelper.loginAsAdmin();
      const { accessToken }: UserWithToken = loginResponse.body;

      await api.delete(`/api/blogs/${testBlog.id}`).set('Authorization', `Bearer ${accessToken}`).expect(204);

      await api.get(`/api/blogs/${testBlog.id}`).expect(404);
    });
  });
};

export default blogTest;
