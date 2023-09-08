import { StatusCodes } from '../../types/errors.type';
import { LikeCreation } from '../../types/like.type';
import getError from '../../types/utils/getError';
import Blog from '../models/blog.model';
import Like from '../models/like.model';

const getAll = async (): Promise<Like[]> => {
  const likes = await Like.findAll();
  return likes;
};

const addOne = async (newLike: LikeCreation): Promise<Like> => {
  const blog = await Blog.findByPk(newLike.blogId);

  if (!blog) {
    throw getError({ message: 'Blog can’t be added to likes, it doesn’t exist!', status: StatusCodes.NOT_FOUND });
  }

  const [like, created] = await Like.findOrCreate({
    where: { ...newLike },
  });

  if (!created) {
    throw getError({ message: 'Like already exists!', status: StatusCodes.BAD_REQUEST });
  }

  await blog.increment('likes');

  return like;
};

const getById = async (id: string | number): Promise<Like | null> => {
  return await Like.findByPk(id);
};

const deleteOne = async (like: Like): Promise<void> => {
  const blog = await Blog.findByPk(like.blogId);

  if (blog) {
    await blog.decrement('likes');
  }

  await like.destroy();
};

const likeService = {
  getAll,
  addOne,
  getById,
  deleteOne,
};

export default likeService;
