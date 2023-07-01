import { User } from './user.type';

export interface Blog {
  id: number;
  author: string;
  url: string;
  title: string;
  likes: number;
  userId: User['id'];
}

export type NewBlog = Omit<Blog, 'id'>;

export type UpdateBlog = Pick<NewBlog, 'likes'>;
