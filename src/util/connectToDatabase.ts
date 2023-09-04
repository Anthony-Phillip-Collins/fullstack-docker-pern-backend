import { API_BASE_URL, DATABASE_URL, REDIS_URL } from '../config';
import redis from '../redis';
import connectToPostgres from '../sequelize';
import logger from './logger';

const connectToDatabase = async () => {
  console.log('//////////////////////////////////////////');
  console.log('API_BASE_URL', API_BASE_URL);
  console.log('DATABASE_URL', DATABASE_URL);
  console.log('REDIS_URL', REDIS_URL);
  console.log('//////////////////////////////////////////');

  try {
    await connectToPostgres();
    logger.info('------------------------------------------');
    logger.info('Connected to Postgres :)');
    logger.info('------------------------------------------');
  } catch (error) {
    logger.info('------------------------------------------');
    logger.error('Error: Unable to connect to Postgres', error);
    logger.info('------------------------------------------');
  }

  try {
    await redis.connect();
    logger.info('------------------------------------------');
    logger.info('Connected to Redis :)');
    logger.info('------------------------------------------');
  } catch (error) {
    logger.info('------------------------------------------');
    logger.error('Error: Unable to connect to Redis', error);
    logger.info('------------------------------------------');
  }
};

export default connectToDatabase;
