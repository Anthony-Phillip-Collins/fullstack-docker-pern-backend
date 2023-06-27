import express from 'express';
import { init } from './src/app';
import constants, { DB } from './src/constants';
import connectToMongo from './src/mongo';
import logger from './src/utils/logger';
import connectToPostgres from './src/sequelize';

const app = express();
// init(app);

if (constants.DB_TYPE === DB.MONGODB) {
  connectToMongo()
    .then(() => {
      logger.info('Connected to MongoDB');
      init(app);
    })
    .catch(() => {
      logger.error('Error: Unable to connect to MongoDB');
    });
} else {
  connectToPostgres
    .then(() => {
      logger.info('Connected to Postgres');
      init(app);
    })
    .catch((error) => {
      logger.error('Error: Unable to connect to Postgres', error);
    });
}
