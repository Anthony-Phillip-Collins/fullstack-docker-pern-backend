import express from 'express';
import { init } from './src/app';
import connectToPostgres from './src/sequelize';
import logger from './src/utils/logger';

const app = express();

connectToPostgres()
  .then(() => {
    logger.info('Connected to Postgres');
    init(app);
  })
  .catch((error) => {
    logger.error('Error: Unable to connect to Postgres', error);
  });
