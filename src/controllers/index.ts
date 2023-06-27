import { Express } from 'express';
import constants from '../constants';
import baseRouter from './base.router';
import blogRouter from './blog.router';

const api = constants.API_BASE_URL;

const routes = (app: Express) => {
  app.use(`${api}`, baseRouter);
  app.use(`${api}/blogs`, blogRouter);
};

export default routes;
