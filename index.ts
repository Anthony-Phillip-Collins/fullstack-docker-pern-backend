import express from 'express';
import { init } from './src/app';
import { redis } from './src/redis';
import connectToPostgres from './src/sequelize';
import logger from './src/util/logger';

const app = express();

connectToPostgres()
  .then(() => {
    logger.info('------------------------------------------');
    logger.info('Connected to Postgres!');
    logger.info('------------------------------------------');
    init(app);
  })
  .catch((error) => {
    logger.info('------------------------------------------');
    logger.error('Error: Unable to connect to Postgres', error);
    logger.info('------------------------------------------');
  });

redis
  .connect()
  .then(() => {
    logger.info('------------------------------------------');
    logger.info('Connected to Redis!');
    logger.info('------------------------------------------');
  })
  .catch((error) => {
    logger.info('------------------------------------------');
    logger.error('Error: Unable to connect to Redis', error);
    logger.info('------------------------------------------');
  });
