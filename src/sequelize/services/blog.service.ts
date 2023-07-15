import { Op, WhereOptions } from 'sequelize';
import { BlogAttributes, BlogCreation, BlogQuery } from '../../types/blog.type';
import { StatusCodes } from '../../types/errors.type';
import { getError } from '../../util/middleware/errorHandler';
import Blog from '../models/blog.model';
import User from '../models/user.model';

const getAll = async (query: BlogQuery = {}): Promise<Blog[]> => {
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
      {
        model: User,
        as: 'readers',
        attributes: ['name'],
        through: { attributes: ['read'] },
      },
    ],
    order: [['likes', 'DESC']],
    attributes: {
      exclude: ['ownerId'],
    },
    where,
  });

  return blogs;
};

const getById = async (id: string): Promise<Blog | null> => {
  return await Blog.findByPk(id, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['name'],
      },
      {
        model: User,
        as: 'readers',
        attributes: ['name'],
        through: { attributes: ['read'] },
      },
    ],
  });
};

const addOne = async (newBlog: BlogCreation, user: User): Promise<Blog> => {
  const { author, title } = newBlog;
  const exists = await Blog.findOne({ where: { author, title, ownerId: user.id } });

  if (exists) {
    throw getError({ message: 'Blog already exists!', status: StatusCodes.BAD_REQUEST });
  }

  return await user.createBlog(newBlog);
};

const deleteOne = async (blog: Blog, user: User): Promise<void> => {
  if (blog.ownerId !== user.id && !user.admin) {
    throw getError({ message: 'You can’t delete a blog you don’t own!', status: StatusCodes.FORBIDDEN });
  }

  const readers = await blog.getReaders();
  await blog.removeReaders(readers);

  await Blog.destroy({ where: { id: blog.id } });
};

const blogService = {
  getAll,
  getById,
  addOne,
  deleteOne,
};

export default blogService;
