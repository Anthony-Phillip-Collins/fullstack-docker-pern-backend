import { Op, WhereOptions } from 'sequelize';
import { BlogAttributes, BlogCreation, BlogQuery, BlogUpdate } from '../../types/blog.type';
import { StatusCodes } from '../../types/errors.type';
import getError from '../../types/utils/getError';
import Blog from '../models/blog.model';
import User from '../models/user.model';

const includes = {
  owner: {
    model: User,
    as: 'owner',
    attributes: ['name', 'username', 'id'],
  },
  readers: {
    model: User,
    as: 'readers',
    attributes: ['name', 'id'],
    through: { attributes: ['read'] },
  },
  likers: {
    model: User,
    as: 'likers',
    attributes: ['name', 'id'],
    through: { attributes: ['id'] },
  },
};

const options = {
  getAll: {
    include: [includes.owner],
    attributes: {
      exclude: ['ownerId', 'createdAt', 'updatedAt'],
    },
  },
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
    include: options.getAll.include,
    order: [['likes', 'DESC']],
    attributes: options.getAll.attributes,
    where,
  });

  return blogs;
};

const getById = async (id: string): Promise<Blog | null> => {
  return Blog.findByPk(id, {
    include: [includes.owner, includes.readers, includes.likers],
  });
};

const addOne = async (newBlog: BlogCreation, user: User): Promise<Blog | null> => {
  const { author, title } = newBlog;
  const exists = await Blog.findOne({ where: { author, title, ownerId: user.id } });

  if (exists) {
    throw getError({ message: 'Blog already exists!', status: StatusCodes.BAD_REQUEST });
  }

  await user.createBlog(newBlog);

  const { include, attributes } = options.getAll;

  return Blog.findOne({
    where: { author, title, ownerId: user.id },
    include,
    attributes,
  });
};

const updateOne = async (blog: Blog, update: BlogUpdate): Promise<Blog> => {
  await blog.update(update);

  const { include, attributes } = options.getAll;

  const updated = await Blog.findByPk(blog.id, {
    include,
    attributes,
  });

  if (!updated) {
    throw getError({ message: 'Blog not found!', status: StatusCodes.NOT_FOUND });
  }

  return updated;
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
  updateOne,
  deleteOne,
};

export default blogService;
