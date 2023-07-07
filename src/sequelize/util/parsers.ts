import { StatusCodes } from '../../types/errors.type';
import { getError } from '../../utils/middleware/errorHandler';
import Blog from '../models/blog.model';
import User from '../models/user.model';

export const parseBlog = (object: unknown): Blog => {
  if (!(object instanceof Blog)) {
    throw getError({ message: 'Blog not found!', status: StatusCodes.NOT_FOUND });
  }
  return object;
};

export const parseUser = (object: unknown): User => {
  if (!(object instanceof User)) {
    throw getError({ message: 'User not found!', status: StatusCodes.NOT_FOUND });
  }
  return object;
};
