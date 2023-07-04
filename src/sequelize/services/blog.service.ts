import { BlogAttributes, BlogCreation } from '../../types/blog.type';
import Blog from '../models/blog.model';
import User from '../models/user.model';

const getAll = async (): Promise<BlogAttributes[]> => {
  const blogs = await Blog.findAll({
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['name'],
      },
    ],
    attributes: {
      exclude: ['ownerId'],
    },
  });
  return blogs.map((blog) => blog.toJSON());
};

const addOne = async (newBlog: BlogCreation, user: User): Promise<BlogAttributes> => {
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
