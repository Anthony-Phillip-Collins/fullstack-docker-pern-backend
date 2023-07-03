import { StatusCodes } from '../../types/errors.type';
import Blog from '../models/blog.model';
import User from '../models/user.model';

export const parseBlog = (object: unknown): Blog => {
  if (!(object instanceof Blog)) {
    const error = new Error('Blog not found!');
    error.status = StatusCodes.NOT_FOUND;
    throw error;
  }
  return object;
};

export const parseUser = (object: unknown): User => {
  if (!(object instanceof User)) {
    const error = new Error('User not found!');
    error.status = StatusCodes.NOT_FOUND;
    throw error;
  }
  return object;
};
