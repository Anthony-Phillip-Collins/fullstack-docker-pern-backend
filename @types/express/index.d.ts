import { JwtPayload } from 'jsonwebtoken';
import { Blog } from '../../src/types/blog.type';

export {};

declare global {
  namespace Express {
    export interface Request {
      blog?: Blog | null;
      token?: string | JwtPayload;
    }
  }
}
