import { BlogCreation } from '../../../src/types/blog.type';

const blog: BlogCreation = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://test.com',
  likes: 0,
  year: 2020,
};

const blogMock = {
  blog,
};

export default blogMock;
