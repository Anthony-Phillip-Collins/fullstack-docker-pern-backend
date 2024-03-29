import { StatusCodes } from '../../types/errors.type';
import { ReadingCreation, ReadingQuery, ReadingUpdate } from '../../types/reading.type';
import getError from '../../types/utils/getError';
import Blog from '../models/blog.model';
import Reading from '../models/reading.model';

const getAll = async (query: ReadingQuery): Promise<Reading[]> => {
  let where = {};

  if (query.read) {
    where = { where: { read: query.read === 'true' } };
  }

  const readings = await Reading.findAll(where);
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

const updateOne = async (reading: Reading, update: ReadingUpdate): Promise<Reading> => {
  await reading.update(update);
  return reading;
};

const getById = async (id: string | number): Promise<Reading | null> => {
  return await Reading.findByPk(id);
};

const deleteOne = async (reading: Reading): Promise<void> => {
  await reading.destroy();
};

const readingService = {
  getAll,
  addOne,
  updateOne,
  getById,
  deleteOne,
};

export default readingService;
