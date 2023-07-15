import { Express } from 'express';
import constants from '../constants';
import baseRouter from './base.router';
import blogRouter from './blog.router';
import userRouter from './user.router';
import loginRouter from './login.router';
import authorRouter from './author.router';
import readingRouter from './reading.router';

const api = constants.API_BASE_URL;

export const paths = {
  blogs: `${api}/blogs`,
  users: `${api}/users`,
  authors: `${api}/authors`,
  readings: `${api}/readings`,
  login: `${api}/login`,
};

const init = (app: Express) => {
  app.use(`${api}`, baseRouter);
  app.use(paths.blogs, blogRouter);
  app.use(paths.users, userRouter);
  app.use(paths.authors, authorRouter);
  app.use(paths.readings, readingRouter);
  app.use(paths.login, loginRouter);
};

const routes = {
  init,
  paths,
};

export default routes;
