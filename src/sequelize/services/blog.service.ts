import { Blog, BlogService, NewBlog, UpdateBlog } from '../../types/blog.type';
import BlogModel from '../models/blog.model';

const getAll = async (): Promise<Blog[]> => {
  const blogModels = await BlogModel.findAll();
  const blogs = blogModels.map((blog) => blog.toJSON());
  return blogs;
};

const getById = async (id: string): Promise<Blog | undefined | null> => {
  const blogModel = await BlogModel.findByPk(id);
  return blogModel ? blogModel.toJSON() : null;
};

const deleteOne = async (id: string): Promise<Blog | undefined | null> => {
  const blogModel = await BlogModel.findByPk(id);
  const blog = blogModel ? blogModel.toJSON() : null;
  await blogModel?.destroy();
  return blog;
};

const updateOne = async (id: string, update: UpdateBlog): Promise<Blog | undefined | null> => {
  await BlogModel.update(update, { where: { id } });
  const blogModel = await BlogModel.findByPk(id);
  const blog = blogModel ? blogModel.toJSON() : null;
  return blog;
};

export const addOne = async (newBlog: NewBlog): Promise<Blog> => {
  const { author, title } = newBlog;
  const exists = await BlogModel.findOne({ where: { author, title } });

  if (exists) throw new Error('Blog already exists!');

  const blogModel = await BlogModel.create(newBlog);
  const blog = blogModel.toJSON();
  return blog;
};

const blogService: BlogService = {
  getAll,
  getById,
  addOne,
  deleteOne,
  updateOne,
};

export default blogService;
