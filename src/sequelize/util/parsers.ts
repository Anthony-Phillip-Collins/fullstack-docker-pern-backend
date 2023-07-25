import { StatusCodes } from '../../types/errors.type';
import getError from '../../types/utils/getError';
import Blog from '../models/blog.model';
import Reading from '../models/reading.model';
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

export const parseReading = (object: unknown): Reading => {
  if (!(object instanceof Reading)) {
    throw getError({ message: 'Reading not found!', status: StatusCodes.NOT_FOUND });
  }
  return object;
};
