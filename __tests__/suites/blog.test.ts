import { BlogAttributes } from '../../src/types/blog.type';
import { api } from '../index.spec';

const blogTest = () => {
  describe('Create', () => {});

  describe('Read', () => {
    it('should have blogs', async () => {
      const response = await api.get('/api/blogs').expect(200);
      const blogs: BlogAttributes[] = response.body;
      expect(blogs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Update', () => {});

  describe('Delete', () => {});
};

export default blogTest;
