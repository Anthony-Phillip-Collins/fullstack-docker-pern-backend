import { Op, WhereOptions } from 'sequelize';
import { BlogAttributes, BlogCreation, BlogQuery } from '../../types/blog.type';
import Blog from '../models/blog.model';
import User from '../models/user.model';

const getAll = async (query: BlogQuery): Promise<BlogAttributes[]> => {
  let where: WhereOptions<BlogAttributes> = {};

  if (query.search) {
    where = {
      ...where,
      [Op.or]: [
        {
          title: {
            [Op.substring]: query.search,
          },
        },
        {
          author: {
            [Op.substring]: query.search,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['name'],
      },
    ],
    order: [['likes', 'DESC']],
    attributes: {
      exclude: ['ownerId'],
    },
    where,
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
