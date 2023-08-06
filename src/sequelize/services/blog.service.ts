import { Op, WhereOptions } from 'sequelize';
import { BlogAttributes, BlogCreation, BlogQuery } from '../../types/blog.type';
import { StatusCodes } from '../../types/errors.type';
import Blog from '../models/blog.model';
import User from '../models/user.model';
import getError from '../../types/utils/getError';

const includes = {
  owner: {
    model: User,
    as: 'owner',
    attributes: ['name', 'username', 'id'],
  },
  readers: {
    model: User,
    as: 'readers',
    attributes: ['name'],
    through: { attributes: ['read'] },
  },
};

const attributesForGetAll = {
  exclude: ['ownerId', 'createdAt', 'updatedAt'],
};

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
    include: [includes.owner],
    order: [['likes', 'DESC']],
    attributes: attributesForGetAll,
    where,
  });

  return blogs;
};

const getById = async (id: string): Promise<Blog | null> => {
  return Blog.findByPk(id, {
    include: [includes.owner, includes.readers],
  });
};

const addOne = async (newBlog: BlogCreation, user: User): Promise<Blog | null> => {
  const { author, title } = newBlog;
  const exists = await Blog.findOne({ where: { author, title, ownerId: user.id } });

  if (exists) {
    throw getError({ message: 'Blog already exists!', status: StatusCodes.BAD_REQUEST });
  }

  await user.createBlog(newBlog);

  return Blog.findOne({
    where: { author, title, ownerId: user.id },
    include: [includes.owner],
    attributes: attributesForGetAll,
  });
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
