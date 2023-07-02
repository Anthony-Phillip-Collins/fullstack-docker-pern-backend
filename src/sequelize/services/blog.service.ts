import Blog, { BlogAttributes, BlogCreationAttributes } from '../models/blog.model';
import User from '../models/user.model';

const getAll = async (): Promise<BlogAttributes[]> => {
  const blogModels = await Blog.findAll();
  const blogs = blogModels.map((blog) => blog.toJSON());
  return blogs;
};

const getById = async (id: string): Promise<BlogAttributes | undefined | null> => {
  const blogModel = await Blog.findByPk(id);
  return blogModel ? blogModel.toJSON() : null;
};

// const deleteOne = async (id: string): Promise<BlogAttributes | undefined | null> => {
//   const blogModel = await Blog.findByPk(id);
//   const blog = blogModel ? blogModel.toJSON() : null;
//   await blogModel?.destroy();
//   return blog;
// };

// const updateOne = async (blog: Blog, update: BlogUpdateAttributes): Promise<BlogAttributes | undefined | null> => {
//   await blog.update(update);
//   // await Blog.update(update, { where: { id } });
//   // const blogModel = await Blog.findByPk(id);
//   // const blog = blogModel ? blogModel.toJSON() : null;
//   return blog.toJSON();
// };

const addOne = async (newBlog: BlogCreationAttributes, user: User): Promise<BlogAttributes> => {
  const { author, title } = newBlog;

  const exists = await Blog.findOne({ where: { author, title, ownerId: user.id } });

  if (exists) {
    throw new Error('Blog already exists!');
  }

  const blog = await user.createBlog(newBlog);

  return blog.toJSON();
};

const blogService = {
  getAll,
  getById,
  addOne,
  // deleteOne,
  // updateOne,
};

export default blogService;
