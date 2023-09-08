import { BlogOrNothing } from '../../src/sequelize/models/blog.model';
import { LikeOrNothing } from '../../src/sequelize/models/like.model';
import { ReadingOrNothing } from '../../src/sequelize/models/reading.model';
import { UserOrNothing } from '../../src/sequelize/models/user.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      blog?: BlogOrNothing;
      user?: UserOrNothing;
      reading?: ReadingOrNothing;
      like?: LikeOrNothing;
      userOfSingleRoute?: UserOrNothing;
      token?: string;
    }
  }
}
