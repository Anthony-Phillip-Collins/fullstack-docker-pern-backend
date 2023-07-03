import Blog, { BlogAttributes, BlogCreationAttributes } from '../models/blog.model';
import User from '../models/user.model';

const getAll = async (): Promise<BlogAttributes[]> => {
  const blogs = await Blog.findAll();
  return blogs.map((blog) => blog.toJSON());
};

const addOne = async (newBlog: BlogCreationAttributes, user: User): Promise<BlogAttributes> => {
  const { author, title } = newBlog;
  const exists = await Blog.findOne({ where: { author, title, ownerId: user.id } });

  if (exists) {
    throw new Error('Blog already exists!');
  }

  const blog = await user.createBlog(newBlog);

  return blog.toJSON();
};

const blogService = {
  getAll,
  addOne,
};

export default blogService;
