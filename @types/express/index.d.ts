import BlogModel from '../../src/sequelize/models/blog.model';
import UserModel from '../../src/sequelize/models/user.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      blog?: BlogModel | null;
      user?: UserModel | null;
      token?: string;
    }
  }
}
