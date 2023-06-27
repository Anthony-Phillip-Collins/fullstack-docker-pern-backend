import express from 'express';
import { init } from './src/app';
import connectToMongo from './src/mongo';
import connectToPostgres from './src/sequelize';
import logger from './src/utils/logger';
import constants from './src/constants';

const app = express();

console.log(process.env);

if (constants.IS_MONGODB) {
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
