import { JwtPayload } from 'jsonwebtoken';
import BlogModel from '../../src/sequelize/models/blog.model';

export {};

declare global {
  namespace Express {
    export interface Request {
      blog?: BlogModel | null;
      token?: string | JwtPayload;
    }
  }
}
