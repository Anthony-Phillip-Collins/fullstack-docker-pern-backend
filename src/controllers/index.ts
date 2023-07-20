import { Express } from 'express';
import baseRouter from './base.router';
import blogRouter from './blog.router';
import userRouter from './user.router';
import authRouter from './auth.router';
import authorRouter from './author.router';
import readingRouter from './reading.router';
import { API_BASE_URL } from '../config';

const api = API_BASE_URL;

export const paths = {
  blogs: `${api}/blogs`,
  users: `${api}/users`,
  authors: `${api}/authors`,
  readings: `${api}/readings`,
  auth: `${api}/auth`,
};

const init = (app: Express) => {
  app.use(`${api}`, baseRouter);
  app.use(paths.blogs, blogRouter);
  app.use(paths.users, userRouter);
  app.use(paths.authors, authorRouter);
  app.use(paths.readings, readingRouter);
  app.use(paths.auth, authRouter);
};

const routes = {
  init,
  paths,
};

export default routes;
