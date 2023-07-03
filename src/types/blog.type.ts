import User from '../sequelize/models/user.model';

export interface BlogAttributes {
  id: number;
  ownerId?: User['id'];
  title: string;
  author: string;
  url: string;
  likes: number;
}
export type BlogCreation = Omit<BlogAttributes, 'id'>;
export type BlogUpdate = Pick<BlogAttributes, 'likes'>;
