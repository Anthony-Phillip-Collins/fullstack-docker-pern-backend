import { NewBlog, UpdateBlog } from '../../blog.type';
import { parseNumber } from './common/number.parser';
import { parseString } from './common/string.parser';

export const isNewBlog = (object: unknown): object is NewBlog => {
  if (!object || typeof object !== 'object') {
    throw new Error('Blog data is missing.');
  }
  const mandatory = ['author', 'title', 'url'];
  return mandatory.filter((p) => p in object).length === mandatory.length;
};

export const parseNewBlog = (object: unknown): NewBlog => {
  if (!isNewBlog(object)) {
    throw new Error('Some Blog data fields are missing. Needs author, title and url.');
  }

  const newBlog: NewBlog = {
    author: parseString(object.author, 'author'),
    title: parseString(object.title, 'title'),
    url: parseString(object.url, 'url'),
    likes: parseNumber(object.likes, 'likes'),
  };

  return newBlog;
};

export const isUpdateBlog = (object: unknown): object is UpdateBlog => {
  if (!object || typeof object !== 'object') {
    throw new Error('Blog data is missing.');
  }
  const mandatory = ['likes'];
  const exact = Object.keys(object).length === mandatory.length;
  return mandatory.filter((p) => p in object).length === mandatory.length && exact;
};

export const parseUpdateBlog = (object: unknown): UpdateBlog => {
  if (!isUpdateBlog(object)) {
    throw new Error('Only likes can be updated.');
  }

  const updateBlog: UpdateBlog = {
    likes: parseNumber(object.likes, 'likes'),
  };

  return updateBlog;
};
