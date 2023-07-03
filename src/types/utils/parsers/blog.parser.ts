import Blog from '../../../sequelize/models/blog.model';
import { BlogCreation, BlogUpdate } from '../../blog.type';
import { StatusCodes } from '../../errors.type';
import { parseNumber } from './common/number.parser';
import { parseString } from './common/string.parser';

export const parseBlog = (object: unknown): Blog => {
  if (!(object instanceof Blog)) {
    const error = new Error('Blog not found!');
    error.status = StatusCodes.NOT_FOUND;
    throw error;
  }
  return object;
};

export const isNewBlog = (object: unknown): object is BlogCreation => {
  if (!object || typeof object !== 'object') {
    throw new Error('Blog data is missing.');
  }
  const mandatory = ['author', 'title', 'url', 'likes'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseNewBlog = (object: unknown): BlogCreation => {
  if (!isNewBlog(object)) {
    throw new Error('Some Blog data fields are missing. Needs author, title, url and likes.');
  }

  const newBlog: BlogCreation = {
    author: parseString(object.author, 'author'),
    title: parseString(object.title, 'title'),
    url: parseString(object.url, 'url'),
    likes: parseNumber(object.likes, 'likes'),
  };

  return newBlog;
};

export const isUpdateBlog = (object: unknown): object is BlogUpdate => {
  if (!object || typeof object !== 'object') {
    throw new Error('Blog data is missing.');
  }
  const mandatory = ['likes'];
  const exact = Object.keys(object).length === mandatory.length;
  return mandatory.filter((p) => p in object).length === mandatory.length && exact;
};

export const parseUpdateBlog = (object: unknown): BlogUpdate => {
  if (!isUpdateBlog(object)) {
    throw new Error('Only likes can be updated.');
  }

  const updateBlog: BlogUpdate = {
    likes: parseNumber(object.likes, 'likes'),
  };

  return updateBlog;
};
