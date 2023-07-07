import { BlogOrNothing } from '../../src/sequelize/models/blog.model';
import { UserOrNothing } from '../../src/sequelize/models/user.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      blog?: BlogOrNothing;
      user?: UserOrNothing;
      userOfSingleRoute?: UserOrNothing;
      token?: string;
    }
  }
}
