import { StatusCodes } from '../../types/errors.type';
import { ReadingCreation } from '../../types/reading.type';
import { getError } from '../../util/middleware/errorHandler';
import Blog from '../models/blog.model';
import Reading from '../models/reading.model';

const getAll = async (): Promise<Reading[]> => {
  const readings = await Reading.findAll();
  return readings;
};

const addOne = async (newReading: ReadingCreation): Promise<Reading> => {
  const blog = await Blog.findByPk(newReading.blogId);

  if (!blog) {
    throw getError({ message: 'Blog can’t be added to readings, it doesn’t exist!', status: StatusCodes.NOT_FOUND });
  }

  const [reading, created] = await Reading.findOrCreate({
    where: { ...newReading },
  });

  if (!created) {
    throw getError({ message: 'Reading already exists!', status: StatusCodes.BAD_REQUEST });
  }

  return reading;
};

const getById = async (id: string): Promise<Reading | null> => {
  return await Reading.findByPk(id);
};

const readingService = {
  getAll,
  addOne,
  getById,
};

export default readingService;
