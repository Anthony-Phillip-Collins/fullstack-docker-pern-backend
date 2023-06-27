import { Schema, model } from 'mongoose';
import { Blog } from '../../types/blog.type';
import schemaToJSON from '../util/schemaToJSON';

const schema = new Schema<Blog>({
  author: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

schemaToJSON(schema);

const BlogModel = model<Blog>('Blog', schema);

export default BlogModel;
