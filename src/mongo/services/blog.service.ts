import { Blog, BlogService, NewBlog, UpdateBlog } from '../../types/blog.type';
import BlogModel from '../models/blog.model';

const getAll = async (): Promise<Blog[]> => {
  return await BlogModel.find({});
};

const getById = async (id: string): Promise<Blog | undefined | null> => {
  return await BlogModel.findById(id);
};

const deleteOne = async (id: string): Promise<Blog | undefined | null> => {
  return await BlogModel.findByIdAndRemove(id);
};

const updateOne = async (id: string, update: UpdateBlog): Promise<Blog | undefined | null> => {
  const blog = await BlogModel.findByIdAndUpdate(id, update, { new: true });
  return blog;
};

export const addOne = async (newBlog: NewBlog): Promise<Blog> => {
  const { author, title } = newBlog;
  const exists = await BlogModel.exists({ author, title });

  if (exists) throw new Error('Blog already exists!');

  const Blog = new BlogModel(newBlog);

  return await Blog.save();
};

const blogService: BlogService = {
  getAll,
  getById,
  addOne,
  deleteOne,
  updateOne,
};

export default blogService;
